import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Folder,
  Home,
  LoaderCircle,
  MessageSquare,
  Mic,
  Monitor,
  Paperclip,
  Plus,
  Send,
  Settings,
  Sparkles,
  Table2,
  Trash2,
  Wrench,
} from 'lucide-react';
import type { CreateToolMode, TokenUsage } from '../types';
import { GROQ_MODELS } from '../types';
import { generateCreateResponse, type GroqChatMessage } from '../utils/groqApi';

interface CreateWorkspaceProps {
  onBack: () => void;
  onOpenAssignment: () => void;
}

interface ToolConfig {
  id: CreateToolMode;
  label: string;
  title: string;
  description: string;
  placeholder: string;
  actionLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const TOOL_CONFIGS: ToolConfig[] = [
  {
    id: 'chat',
    label: 'Chat',
    title: 'Create Workspace',
    description: 'Use a single workspace to plan, draft, and refine your content from one prompt.',
    placeholder: 'Ask anything. Example: Create a week-by-week study plan for my finals.',
    actionLabel: 'Send',
    icon: MessageSquare,
  },
  {
    id: 'document',
    label: 'Document',
    title: 'Document Builder',
    description: 'Generate structured reports, proposals, essays, and polished written documents.',
    placeholder: 'Describe the document you want to generate...',
    actionLabel: 'Generate Document',
    icon: FileText,
  },
  {
    id: 'presentation',
    label: 'Presentation',
    title: 'Presentation Builder',
    description: 'Build slide-by-slide outlines with talking points and concise narrative flow.',
    placeholder: 'Create a 10-slide outline on sustainable coffee sourcing with speaker notes.',
    actionLabel: 'Generate Slides',
    icon: Monitor,
  },
  {
    id: 'spreadsheet',
    label: 'Spreadsheet',
    title: 'Spreadsheet Assistant',
    description: 'Design sheets, formulas, and data layouts for reporting, planning, and analysis.',
    placeholder: 'Build a monthly budget sheet with formulas for variance and savings rate.',
    actionLabel: 'Generate Sheet Plan',
    icon: Table2,
  },
  {
    id: 'voiceover',
    label: 'Voiceover',
    title: 'Voiceover Script Writer',
    description: 'Draft spoken scripts with pacing, emphasis, and delivery-ready formatting.',
    placeholder: 'Write a 90-second product launch voiceover script in a confident tone.',
    actionLabel: 'Generate Script',
    icon: Mic,
  },
];

const toolIds = TOOL_CONFIGS.map((tool) => tool.id);

const isToolMode = (value: string): value is CreateToolMode =>
  toolIds.includes(value as CreateToolMode);

const getModeFromPath = (): CreateToolMode => {
  const path = window.location.pathname.toLowerCase();
  const match = path.match(/^\/create\/([^/?#]+)/);
  const candidate = match?.[1] ?? 'chat';
  return isToolMode(candidate) ? candidate : 'chat';
};

const makeMessageId = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getStarterMessage = (mode: CreateToolMode): string => {
  if (mode === 'document') return 'Tell me what document you need. I can produce a clean first draft with sections.';
  if (mode === 'presentation') return 'Share your topic and audience. I will create a slide outline with speaker notes.';
  if (mode === 'spreadsheet') return 'Describe your data and goals. I will suggest columns, formulas, and table structure.';
  if (mode === 'voiceover') return 'Give me your topic, tone, and duration. I will draft a ready-to-record script.';
  return 'What do you want to create today? I can help with documents, slides, sheets, and scripts.';
};

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ onBack, onOpenAssignment }) => {
  const [activeMode, setActiveMode] = useState<CreateToolMode>(getModeFromPath);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('groq_api_key') || '');
  const [modelId, setModelId] = useState<string>(GROQ_MODELS[0]?.id || 'llama-3.1-8b-instant');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<UiMessage[]>(() => [
    { id: makeMessageId(), role: 'assistant', content: getStarterMessage(getModeFromPath()) },
  ]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef<number>(messages.length);

  const activeTool = useMemo(
    () => TOOL_CONFIGS.find((tool) => tool.id === activeMode) || TOOL_CONFIGS[0],
    [activeMode]
  );
  const ActiveToolIcon = activeTool.icon;

  useEffect(() => {
    const onPopState = () => {
      const mode = getModeFromPath();
      setActiveMode((current) => (current === mode ? current : mode));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const path = `/create/${activeMode}`;
    if (window.location.pathname.toLowerCase() !== path) {
      window.history.replaceState(null, '', path);
    }

    setMessages([{ id: makeMessageId(), role: 'assistant', content: getStarterMessage(activeMode) }]);
    setPrompt('');
    setError('');
    setTokenUsage(null);
  }, [activeMode]);

  useEffect(() => {
    const cleanKey = apiKey.trim();
    if (cleanKey) localStorage.setItem('groq_api_key', cleanKey);
    else localStorage.removeItem('groq_api_key');
  }, [apiKey]);

  useEffect(() => {
    const prev = prevMessagesLengthRef.current;
    const curr = messages.length;
    if (curr > prev) {
      const last = messages[messages.length - 1];
      if (last && last.role === 'assistant') {
        // Scroll instantly (no smooth animation) only when assistant adds content
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    }
    prevMessagesLengthRef.current = curr;
  }, [messages]);

  const changeMode = (mode: CreateToolMode) => {
    setActiveMode(mode);
  };

  const clearConversation = () => {
    setMessages([{ id: makeMessageId(), role: 'assistant', content: getStarterMessage(activeMode) }]);
    setPrompt('');
    setError('');
    setTokenUsage(null);
  };

  const submitPrompt = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;

    const userMessage: UiMessage = { id: makeMessageId(), role: 'user', content: cleanPrompt };
    const conversation: GroqChatMessage[] = [...messages, userMessage].map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((current) => [...current, userMessage]);
    setPrompt('');
    setError('');

    if (!apiKey.trim()) {
      setError('Enter your Groq API key to start generating responses.');
      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: 'assistant',
          content: 'Add your Groq API key in the top bar, then send your prompt again.',
        },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCreateResponse(apiKey.trim(), activeMode, conversation, modelId);
      setTokenUsage(result.usage);
      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: 'assistant',
          content: result.content || 'No response was generated. Try a more detailed prompt.',
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1c]">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-[#e9ecef] bg-[#f8f9fa] md:flex">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#984eff] to-violet-600 text-sm font-bold text-white">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1a1a1c]">create</span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
            {TOOL_CONFIGS.map((tool) => {
              const Icon = tool.icon;
              const isActive = tool.id === activeMode;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => changeMode(tool.id)}
                  className={`group flex w-full items-center rounded-r-lg px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? 'border-l-4 border-[#984eff] bg-white font-semibold text-[#984eff]'
                      : 'text-[#6c757d] hover:bg-[#f1f3f5]'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[#984eff]' : 'text-[#6c757d]'}`} />
                  {tool.label}
                </button>
              );
            })}

            <div className="px-4 pb-2 pt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#6c757d]">Workspace</div>

            <button
              type="button"
              onClick={clearConversation}
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5]"
            >
              <Plus className="mr-3 h-5 w-5" />
              New Chat
            </button>
            <button
              type="button"
              onClick={onOpenAssignment}
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5]"
            >
              <FileText className="mr-3 h-5 w-5" />
              Assignment Maker
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5]"
            >
              <Folder className="mr-3 h-5 w-5" />
              Files
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5]"
            >
              <Wrench className="mr-3 h-5 w-5" />
              Tools
            </button>
          </div>

          <div className="border-t border-[#e9ecef] p-6">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-[#6c757d]">Tokens used</span>
                  <span className="font-bold text-[#1a1a1c]">{tokenUsage ? tokenUsage.total_tokens : 0}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#e9ecef]">
                  <div
                    className="h-1.5 rounded-full bg-[#984eff]"
                    style={{ width: `${Math.min(100, ((tokenUsage?.total_tokens || 0) / 4000) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-[#6c757d]">Current path</span>
                  <span className="font-semibold text-[#1a1a1c]">/{activeMode}</span>
                </div>
                <p className="text-xs text-[#6c757d]">Link updates automatically as you switch tabs.</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-white">
          <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-[#e9ecef] bg-white/95 px-8 backdrop-blur md:flex">
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[#6c757d] transition-colors hover:bg-[#f1f3f5] hover:text-[#1a1a1c]"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </button>
              <span className="h-4 w-px bg-[#e9ecef]" />
              <span className="font-medium text-[#6c757d]">/create/{activeMode}</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Groq API key"
                className="h-10 w-[240px] rounded-lg border border-[#e9ecef] px-3 text-sm outline-none transition-colors focus:border-[#984eff]"
              />
              <select
                value={modelId}
                onChange={(event) => setModelId(event.target.value)}
                className="h-10 rounded-lg border border-[#e9ecef] bg-white px-3 text-sm outline-none transition-colors focus:border-[#984eff]"
              >
                {GROQ_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
              <button type="button" className="rounded-lg p-2 text-[#6c757d] transition-colors hover:bg-[#f1f3f5] hover:text-[#1a1a1c]">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </header>

          <header className="sticky top-0 z-20 border-b border-[#e9ecef] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#6c757d]"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </button>
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Groq API key"
                className="h-9 w-[180px] rounded-lg border border-[#e9ecef] px-2 text-xs outline-none transition-colors focus:border-[#984eff]"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {TOOL_CONFIGS.map((tool) => {
                const active = tool.id === activeMode;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => changeMode(tool.id)}
                    className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#984eff] bg-[#f4ebf9] text-[#984eff]'
                        : 'border-[#e9ecef] text-[#6c757d]'
                    }`}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </header>

          <section className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1000px] px-4 pb-24 pt-10 md:px-8">
              <div className="mb-10 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4ebf9] text-[#984eff]">
                  <ActiveToolIcon className="h-8 w-8" />
                </div>
                <h1 className="mb-3 text-3xl font-bold text-[#1a1a1c] md:text-4xl">{activeTool.title}</h1>
                <p className="mx-auto max-w-2xl text-sm text-[#6c757d] md:text-base">{activeTool.description}</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#e9ecef] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="max-h-[360px] space-y-4 overflow-y-auto p-4 md:p-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[82%] ${
                          message.role === 'assistant'
                            ? 'border border-[#ead9ff] bg-[#f8f2ff] text-[#2d2150]'
                            : 'bg-[#984eff] text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead9ff] bg-[#f8f2ff] px-3 py-2 text-sm text-[#4c3d73]">
                        <LoaderCircle className="h-4 w-4" />
                        Generating...
                      </div>
                    </div>
                  )}

                  <div ref={scrollAnchorRef} />
                </div>

                {error && (
                  <div className="mx-4 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 md:mx-5">
                    {error}
                  </div>
                )}

                <div className="border-t border-[#e9ecef] p-3 md:p-4">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void submitPrompt();
                      }
                    }}
                    className="h-36 w-full resize-none border-0 bg-transparent p-2 text-sm text-[#1a1a1c] outline-none placeholder:text-[#6c757d]"
                    placeholder={activeTool.placeholder}
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9ecef] px-2 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5] hover:text-[#1a1a1c]"
                      >
                        <Paperclip className="h-4 w-4" />
                        Attach
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrompt('')}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[#6c757d] transition-colors hover:bg-[#f1f3f5] hover:text-[#1a1a1c]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => void submitPrompt()}
                      disabled={isLoading || !prompt.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#984eff] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8540e5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activeTool.actionLabel}
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#e9ecef] bg-[#f1f3f5] p-4 md:flex-row md:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#984eff] text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1c]">Mode-aware generation</p>
                    <p className="text-xs text-[#6c757d]">Switch tabs to change output style and update the URL to match your current tool.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.history.replaceState(null, '', `/create/${activeMode}`)}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#984eff] transition-colors hover:bg-[#f8f2ff]"
                >
                  Open link
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#6c757d]">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e9ecef] bg-white px-3 py-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e9ecef] bg-white px-3 py-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  /{activeMode}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CreateWorkspace;
