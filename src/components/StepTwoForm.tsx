import React from 'react';
import { FileText, ListChecks, BookOpen, ArrowLeft, Sparkles, Type, AlignLeft, ImagePlus, X, Eye } from 'lucide-react';
import type { AssignmentInfo } from '../types';
import { GROQ_MODELS } from '../types';

interface Props { data: AssignmentInfo; onChange: (d: AssignmentInfo) => void; onSubmit: () => void; onBack: () => void; apiKey: string; onApiKeyChange: (k: string) => void }

const types = ['Essay', 'Research Paper', 'Report', 'Case Study', 'Literature Review', 'Lab Report', 'Term Paper', 'Homework', 'Project Report'];
const words = ['500-800', '800-1200', '1200-1500', '1500-2000', '2000-3000'];

const StepTwoForm: React.FC<Props> = ({ data, onChange, onSubmit, onBack, apiKey, onApiKeyChange }) => {
  const [errors, setErrors] = React.useState<Partial<Record<keyof AssignmentInfo | 'apiKey', string>>>({});
  const set = (f: keyof AssignmentInfo, v: string) => { onChange({ ...data, [f]: v }); if (errors[f]) setErrors({ ...errors, [f]: undefined }); };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setErrors({ ...errors, referenceImage: 'Max 10MB' }); return; }
    const r = new FileReader(); r.onloadend = () => onChange({ ...data, referenceImage: r.result as string }); r.readAsDataURL(f);
  };

  const validate = () => {
    const e: any = {};
    if (!data.assignmentTopic.trim()) e.assignmentTopic = 'Required';
    if (!data.subjectForAI.trim()) e.subjectForAI = 'Required';
    if (!apiKey.trim()) e.apiKey = 'Required';
    setErrors(e); return !Object.keys(e).length;
  };

  const inp = (err: boolean) => `w-full px-4 py-3 rounded-xl border ${err ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'} focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 mb-4">
          <Sparkles className="w-7 h-7 text-violet-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Assignment Details</h2>
        <p className="text-sm text-gray-400 mt-1.5">Step 2 of 2 — AI writes, React formats</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); if (validate()) onSubmit(); }} className="space-y-5">
        {/* API Key */}
        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Groq API Key <span className="text-red-400">*</span>
          </label>
          <input type="password" value={apiKey} onChange={e => { onApiKeyChange(e.target.value); if (errors.apiKey) setErrors({ ...errors, apiKey: undefined }); }} placeholder="gsk_xxxxxxxx" className={inp(!!errors.apiKey)} />
          {errors.apiKey && <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>}
          <p className="text-xs text-amber-600/70 mt-1.5">Free key at <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">console.groq.com</a></p>
        </div>

        {/* Model */}
        <div className="p-4 bg-brand-50/40 border border-brand-100 rounded-xl">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">🤖 Model</label>
          <div className="space-y-2">
            {GROQ_MODELS.map(m => (
              <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${data.modelId === m.id ? 'bg-white border-brand-300 ring-2 ring-brand-500/10' : 'bg-white/50 border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="model" value={m.id} checked={data.modelId === m.id} onChange={e => set('modelId', e.target.value)} className="text-brand-500" />
                <div className="flex-1"><span className="text-sm font-semibold text-gray-900">{m.label}</span><p className="text-xs text-gray-400 mt-0.5">{m.description}</p></div>
              </label>
            ))}
          </div>
        </div>

        {/* OCR */}
        <div className="p-4 bg-sky-50/40 border border-sky-100 rounded-xl">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-2">
            <ImagePlus className="w-3.5 h-3.5" /> Reference Image <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          {data.referenceImage ? (
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-sky-100">
              <img src={data.referenceImage} alt="" className="h-16 rounded-lg object-contain" />
              <div className="flex-1"><p className="text-sm font-medium text-gray-700">Uploaded</p><p className="text-xs text-gray-400">AI will extract text</p></div>
              <button type="button" onClick={() => onChange({ ...data, referenceImage: '' })} className="p-1 hover:bg-red-50 rounded-lg"><X className="w-4 h-4 text-red-400" /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-sky-200 rounded-xl cursor-pointer hover:border-sky-300 hover:bg-sky-50/30 transition-all">
              <Eye className="w-5 h-5 text-sky-300 mb-1" />
              <span className="text-xs text-sky-500 font-medium">Upload image</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImg} className="hidden" />
            </label>
          )}
        </div>

        {/* Topic */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><FileText className="w-3.5 h-3.5" /> Topic <span className="text-red-400">*</span></label>
          <input type="text" value={data.assignmentTopic} onChange={e => set('assignmentTopic', e.target.value)} placeholder="e.g., Impact of AI on Modern Education" className={inp(!!errors.assignmentTopic)} />
          {errors.assignmentTopic && <p className="text-red-500 text-xs mt-1">{errors.assignmentTopic}</p>}
        </div>

        {/* Subject */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><BookOpen className="w-3.5 h-3.5" /> Subject <span className="text-red-400">*</span></label>
          <input type="text" value={data.subjectForAI} onChange={e => set('subjectForAI', e.target.value)} placeholder="e.g., Computer Science" className={inp(!!errors.subjectForAI)} />
          {errors.subjectForAI && <p className="text-red-500 text-xs mt-1">{errors.subjectForAI}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><Type className="w-3.5 h-3.5" /> Type</label>
            <select value={data.assignmentType} onChange={e => set('assignmentType', e.target.value)} className={inp(false)}>{types.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><AlignLeft className="w-3.5 h-3.5" /> Words</label>
            <select value={data.wordCount} onChange={e => set('wordCount', e.target.value)} className={inp(false)}>{words.map(w => <option key={w}>{w} words</option>)}</select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"><ListChecks className="w-3.5 h-3.5" /> Requirements</label>
          <textarea value={data.requirements} onChange={e => set('requirements', e.target.value)} placeholder="Any specific instructions..." rows={3} className={`${inp(false)} resize-none`} />
        </div>

        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
          <p className="text-xs text-emerald-700">✅ Only text content goes to AI. Cover pages, formatting, editing & PDF — all run locally in your browser.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex items-center gap-1.5 px-5 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button type="submit" className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Generate
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepTwoForm;
