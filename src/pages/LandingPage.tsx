import React from 'react';
import { FileText, Sparkles, ArrowRight, Zap, Shield, Globe, ChevronRight, ShieldCheck } from 'lucide-react';
import type { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const tools = [
  {
    id: 'admin' as const,
    title: 'Admin Console',
    description: 'Manage API handling, logs, and user activity from a single operational panel.',
    icon: <ShieldCheck className="w-6 h-6" />,
    status: 'live' as const,
    gradient: 'from-slate-700 to-zinc-900',
    bg: 'bg-slate-100',
    features: ['API settings', 'System logs', 'Users activity', 'Security overview'],
  },
  {
    id: 'create' as const,
    title: 'Create Workspace',
    description: 'One workspace for chat, document drafting, presentation planning, spreadsheet layout, and voiceover scripts.',
    icon: <Sparkles className="w-6 h-6" />,
    status: 'live' as const,
    gradient: 'from-violet-500 to-fuchsia-500',
    bg: 'bg-violet-50',
    features: ['Mode switching', 'Prompt memory', 'Tool-based outputs', 'Shareable links'],
  },
  {
    id: 'assignment-maker' as const,
    title: 'Assignment Maker',
    description: 'Generate complete academic assignments with auto-generated cover pages, built-in editing, and PDF export.',
    icon: <FileText className="w-6 h-6" />,
    status: 'live' as const,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    features: ['Auto cover pages', 'Content generation', 'Built-in editor', 'PDF export'],
  },
  {
    id: 'coming-soon' as const,
    title: 'Quiz Generator',
    description: 'Create MCQs, short answers, and essay questions from any topic with answer keys.',
    icon: <Sparkles className="w-6 h-6" />,
    status: 'coming-soon' as const,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    features: ['Multiple formats', 'Answer keys', 'Difficulty levels'],
  },
  {
    id: 'coming-soon' as const,
    title: 'Paper Summarizer',
    description: 'Upload research papers and get concise, structured summaries with key findings.',
    icon: <Globe className="w-6 h-6" />,
    status: 'coming-soon' as const,
    gradient: 'from-orange-500 to-rose-500',
    bg: 'bg-orange-50',
    features: ['Key extraction', 'Citation analysis', 'Structure map'],
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">StudyForge</span>
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('create')} className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Create
            </button>
            <button onClick={() => onNavigate('admin')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Admin
            </button>
            <button onClick={() => onNavigate('assignment-maker')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Assignment Maker
            </button>
            <a href="#tools" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Tools</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_72%)]" />
          <div className="absolute inset-x-[-14%] top-10 h-[150%] origin-top [transform:perspective(1200px)_rotateX(62deg)]">
            <div className="h-full w-full rounded-[2rem] border border-brand-100/70 bg-[linear-gradient(to_right,rgba(99,102,241,0.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.13)_1px,transparent_1px)] [background-size:34px_34px] shadow-[0_48px_90px_-70px_rgba(79,70,229,0.9)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <h1 className="animate-fade-up delay-100 text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Academic tools that<br />
            <span className="bg-gradient-to-r from-brand-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              write themselves
            </span>
          </h1>

          <p className="animate-fade-up delay-200 text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate assignments, cover pages, and academic documents in seconds, then review, edit, and export as PDF.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('create')}
              className="group flex items-center gap-2.5 px-7 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:shadow-xl active:scale-[0.98]"
            >
              Open Create Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('assignment-maker')}
              className="flex items-center gap-2 px-7 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
            >
              Start Assignment Maker
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-400 mt-16 flex items-center justify-center gap-12 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-400 mt-1">Cover Styles</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-gray-900">~3s</p>
              <p className="text-sm text-gray-400 mt-1">Generation Time</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-gray-900">PDF</p>
              <p className="text-sm text-gray-400 mt-1">Instant Export</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tools</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Purpose-built academic tools. More coming soon.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className={`group relative bg-white rounded-2xl border border-gray-100 p-7 transition-all hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5 ${tool.status === 'coming-soon' ? 'opacity-70' : 'cursor-pointer'}`}
                onClick={() => tool.status === 'live' && onNavigate(tool.id)}
              >
                {tool.status === 'coming-soon' && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Soon</span>
                )}
                <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-5`}>
                  <div className={`bg-gradient-to-br ${tool.gradient} bg-clip-text text-transparent`}>
                    {React.cloneElement(tool.icon, { className: 'w-6 h-6', style: { color: 'inherit' } })}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tool.features.map(f => (
                    <span key={f} className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">{f}</span>
                  ))}
                </div>
                {tool.status === 'live' && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                    Try now <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Three steps to a complete assignment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fill in your details', desc: 'Enter your name, university, subject, instructor — everything the cover page needs.' },
              { step: '02', title: 'Set your topic', desc: 'Provide the assignment topic and any special requirements. The generator prepares a complete first draft.' },
              { step: '03', title: 'Edit & export', desc: 'Review the generated content, pick a cover style, make edits if needed, and download as PDF.' },
            ].map(item => (
              <div key={item.step} className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-600 font-bold text-sm mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 px-6 border-y border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
          <Shield className="w-5 h-5 text-gray-400" />
          <p className="text-sm text-gray-400 text-center">
            Your API key stays in your browser. No data is sent to our servers. Cover pages, editing, and PDF generation all run locally.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to try it?</h2>
          <p className="text-gray-500 mb-8">Generate your first assignment in under a minute.</p>
          <button
            onClick={() => onNavigate('assignment-maker')}
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
          >
            Open Assignment Maker
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">StudyForge</span>
          </div>
          <p className="text-xs text-gray-400">Academic tools for students. Privacy-first.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
