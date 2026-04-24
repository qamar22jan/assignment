import type { CreateToolMode } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ─── Ultra-minimal system prompt (~20 tokens) ────────────────────────────────
// AI does ONE thing: write content. Cover page, formatting, PDF = all React.
const SYSTEM_PROMPT = 'You are an academic writer. Write well-structured assignments in markdown with ## headings, paragraphs, and a References section.';

/* types handled inline */

export interface GroqCallResult {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cached_tokens: number;
    total_time_ms: number;
  };
}

// ─── Model configs ───────────────────────────────────────────────────────────
const MAX_TOKENS: Record<string, number> = {
  'llama-3.1-8b-instant': 8192,
  'llama-3.3-70b-versatile': 8192,
};

const DEFAULT_MAX_TOKENS = 8192;
const DEFAULT_WORD_RANGE = '2500-3500';
const WORDS_PER_PAGE = 320;

interface GroqRequestMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChunkResult {
  content: string;
  finishReason: string | null;
  usage: GroqCallResult['usage'];
}

const emptyUsage = (): GroqCallResult['usage'] => ({
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
  cached_tokens: 0,
  total_time_ms: 0,
});

const mergeUsage = (
  a: GroqCallResult['usage'],
  b: GroqCallResult['usage']
): GroqCallResult['usage'] => ({
  prompt_tokens: a.prompt_tokens + b.prompt_tokens,
  completion_tokens: a.completion_tokens + b.completion_tokens,
  total_tokens: a.total_tokens + b.total_tokens,
  cached_tokens: a.cached_tokens + b.cached_tokens,
  total_time_ms: a.total_time_ms + b.total_time_ms,
});

const parseWordRange = (wordCount: string): { min: number; max: number } => {
  const nums = (wordCount || '').match(/\d+/g)?.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0) || [];
  if (!nums.length) return { min: 2500, max: 3500 };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
};

const extractRequestedPages = (text: string): number | null => {
  const m = (text || '').toLowerCase().match(/(\d{1,2})(?:\s*(?:-|to)\s*(\d{1,2}))?\s*pages?/);
  if (!m) return null;
  const first = Number(m[1] || 0);
  const second = Number(m[2] || 0);
  if (!first) return null;
  return Math.max(first, second || first);
};

const countWords = (text: string): number =>
  (text || '').trim().split(/\s+/).filter(Boolean).length;

const getLengthTarget = (wordCount: string, requirements: string) => {
  const parsed = parseWordRange(wordCount || DEFAULT_WORD_RANGE);
  const pages = extractRequestedPages(requirements);
  const pageWordTarget = pages ? pages * WORDS_PER_PAGE : 0;
  const targetWords = Math.max(parsed.max, pageWordTarget);

  return {
    minWords: parsed.min,
    maxWords: targetWords,
    pages,
    rangeLabel: `${parsed.min}-${targetWords}`,
  };
};

const getMaxTokensForLength = (modelId: string, targetWords: number): number => {
  const modelCap = MAX_TOKENS[modelId] ?? DEFAULT_MAX_TOKENS;
  const estimatedTokens = Math.ceil(targetWords * 1.85) + 500;
  return Math.min(modelCap, Math.max(2600, estimatedTokens));
};

async function callGroq(
  apiKey: string,
  body: any,
  rateLimitFixHint: string
): Promise<GroqChunkResult> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err?.error?.message || `API error ${res.status}`;
    if (msg.includes('TPM') || msg.includes('tokens per minute') || msg.includes('rate_limit')) {
      throw new Error(`Rate limit: ${msg}\n\n${rateLimitFixHint}`);
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const usage = data.usage || {};
  const pd = usage.prompt_tokens_details || {};
  const cd = usage.completion_tokens_details || {};

  return {
    content: data.choices?.[0]?.message?.content || '',
    finishReason: data.choices?.[0]?.finish_reason || null,
    usage: {
      prompt_tokens: usage.prompt_tokens || 0,
      completion_tokens: usage.completion_tokens || 0,
      total_tokens: usage.total_tokens || 0,
      cached_tokens: pd.cached_tokens || 0,
      total_time_ms: (cd.prompt_time_ms || 0) + (cd.completion_time_ms || 0),
    },
  };
}

const CREATE_MODE_PROMPTS: Record<CreateToolMode, string> = {
  chat: 'You are a practical assistant. Give direct, useful answers with clear steps when needed.',
  document: 'You are a document drafting assistant. Produce clean sections, headings, and actionable content.',
  presentation: 'You are a presentation assistant. Return slide-ready outlines with concise bullets and speaker cues.',
  spreadsheet: 'You are a spreadsheet assistant. Suggest table structures, formulas, and clear data organization.',
  voiceover: 'You are a voiceover writing assistant. Write natural scripts with pacing notes and delivery guidance.',
};

export interface GroqChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Generate Assignment (plain markdown, no JSON) ──────────────────────────
export async function generateAssignment(
  apiKey: string,
  topic: string,
  requirements: string,
  subjectName: string,
  assignmentType: string,
  wordCount: string,
  modelId: string,
  ocrContext?: string
): Promise<GroqCallResult> {
  const lengthTarget = getLengthTarget(wordCount || DEFAULT_WORD_RANGE, requirements || '');
  const maxTokens = getMaxTokensForLength(modelId, lengthTarget.maxWords);

  let userMsg = `Write a ${assignmentType || 'assignment'} on "${topic}" for ${subjectName}.`;
  userMsg += ` Target ${lengthTarget.rangeLabel} words.`;
  if (lengthTarget.pages) {
    userMsg += ` User requested around ${lengthTarget.pages} pages, so the output length must actually match that request.`;
  }
  userMsg += ' Use clear markdown with ## headings, detailed paragraphs, and a References section.';
  userMsg += ' Do not stop early; continue until the required length is reached.';
  if (requirements?.trim()) userMsg += ` ${requirements}`;
  if (ocrContext?.trim()) userMsg += ` Reference text: ${ocrContext.slice(0, 2000)}`;

  const baseMessages: GroqRequestMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMsg },
  ];

  const maxPasses = 3;
  let combinedContent = '';
  let usage = emptyUsage();

  for (let pass = 0; pass < maxPasses; pass++) {
    const isContinuation = pass > 0;
    const body: any = {
      model: modelId,
      messages: isContinuation
        ? [
            ...baseMessages,
            { role: 'assistant', content: combinedContent },
            {
              role: 'user',
              content:
                'Continue from exactly where you stopped. Do not repeat prior lines. Keep the same structure and complete remaining sections until the required length is satisfied.',
            },
          ]
        : baseMessages,
      temperature: 0.3,
      max_tokens: maxTokens,
    };

    const chunk = await callGroq(
      apiKey,
      body,
      '💡 Fix: Switch to "Llama 3.1 8B Instant" (30K TPM) or wait 60s.'
    );

    usage = mergeUsage(usage, chunk.usage);
    const text = chunk.content?.trim();
    if (!text) break;

    combinedContent = combinedContent ? `${combinedContent}\n\n${text}` : text;

    const enoughWords = countWords(combinedContent) >= lengthTarget.maxWords;
    if (enoughWords) {
      break;
    }
  }

  return {
    content: combinedContent,
    usage,
  };
}

export async function generateCreateResponse(
  apiKey: string,
  mode: CreateToolMode,
  messages: GroqChatMessage[],
  modelId: string
): Promise<GroqCallResult> {
  const maxTokens = MAX_TOKENS[modelId] ?? DEFAULT_MAX_TOKENS;
  const prompt = CREATE_MODE_PROMPTS[mode] || CREATE_MODE_PROMPTS.chat;
  const trimmedMessages = messages
    .filter((message) => message.content?.trim().length)
    .slice(-14);

  const body: any = {
    model: modelId,
    messages: [
      { role: 'system', content: prompt },
      ...trimmedMessages,
    ],
    temperature: 0.5,
    max_tokens: maxTokens,
  };

  const chunk = await callGroq(
    apiKey,
    body,
    'Fix: switch to Llama 3.1 8B Instant or wait 60 seconds.'
  );

  return {
    content: chunk.content,
    usage: chunk.usage,
  };
}

// ─── OCR ─────────────────────────────────────────────────────────────────────
export async function performOCR(apiKey: string, base64Image: string): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Transcribe all text from this image exactly.' },
          { type: 'image_url', image_url: { url: base64Image } },
        ],
      }],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `OCR error ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
