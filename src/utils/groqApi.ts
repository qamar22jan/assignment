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
  'llama-3.1-8b-instant': 3000,
  'llama-3.3-70b-versatile': 3000,
};

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
  const maxTokens = MAX_TOKENS[modelId] ?? 3000;

  let userMsg = `Write a ${assignmentType || 'assignment'} on "${topic}" for ${subjectName}. Target ~${wordCount || '1200-1500'} words.`;
  if (requirements?.trim()) userMsg += ` ${requirements}`;
  if (ocrContext?.trim()) userMsg += ` Ref: ${ocrContext.slice(0, 800)}`;

  const body: any = {
    model: modelId,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMsg },
    ],
    temperature: 0.3,
    max_tokens: maxTokens,
  };

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const msg = err?.error?.message || `API error ${res.status}`;
    if (msg.includes('TPM') || msg.includes('tokens per minute') || msg.includes('rate_limit')) {
      throw new Error(
        `Rate limit: ${msg}\n\n💡 Fix: Switch to "Llama 3.1 8B Instant" (30K TPM) or wait 60s.`
      );
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const usage = data.usage || {};
  const pd = usage.prompt_tokens_details || {};
  const cd = usage.completion_tokens_details || {};

  return {
    content: data.choices?.[0]?.message?.content || '',
    usage: {
      prompt_tokens: usage.prompt_tokens || 0,
      completion_tokens: usage.completion_tokens || 0,
      total_tokens: usage.total_tokens || 0,
      cached_tokens: pd.cached_tokens || 0,
      total_time_ms: (cd.prompt_time_ms || 0) + (cd.completion_time_ms || 0),
    },
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
