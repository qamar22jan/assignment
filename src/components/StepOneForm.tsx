import React from 'react';
import { User, Building2, Hash, GraduationCap, BookOpen, Upload, Building, Calendar, CreditCard } from 'lucide-react';
import type { PersonalInfo } from '../types';

interface Props { data: PersonalInfo; onChange: (d: PersonalInfo) => void; onNext: () => void }

const StepOneForm: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = React.useState<Partial<Record<keyof PersonalInfo, string>>>({});

  const set = (f: keyof PersonalInfo, v: string) => { onChange({ ...data, [f]: v }); if (errors[f]) setErrors({ ...errors, [f]: undefined }); };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => onChange({ ...data, universityLogo: r.result as string });
    r.readAsDataURL(file);
  };

  const validate = () => {
    const e: Partial<Record<keyof PersonalInfo, string>> = {};
    if (!data.studentName.trim()) e.studentName = 'Required';
    if (!data.section.trim()) e.section = 'Required';
    if (!data.instructorName.trim()) e.instructorName = 'Required';
    if (!data.subjectName.trim()) e.subjectName = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const input = (hasErr: boolean) =>
    `w-full px-4 py-3 rounded-xl border ${hasErr ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'} focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 mb-4">
          <GraduationCap className="w-7 h-7 text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Personal & University Details</h2>
        <p className="text-sm text-gray-400 mt-1.5">Step 1 of 2 — this info goes on your cover page</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); if (validate()) onNext(); }} className="space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" /> Student Name <span className="text-red-400">*</span>
          </label>
          <input type="text" value={data.studentName} onChange={e => set('studentName', e.target.value)} placeholder="Your full name" className={input(!!errors.studentName)} />
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" /> University / Institute
          </label>
          <input type="text" value={data.universityName} onChange={e => set('universityName', e.target.value)} placeholder="University name" className={input(false)} />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" /> University Logo <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          {data.universityLogo ? (
            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-white">
              <img src={data.universityLogo} alt="Logo" className="h-12 object-contain" />
              <button type="button" onClick={() => onChange({ ...data, universityLogo: '' })} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all">
              <Upload className="w-6 h-6 text-gray-300 mb-1.5" />
              <span className="text-xs text-gray-400">Click to upload</span>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          )}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" /> Roll Number
          </label>
          <input type="text" value={data.rollNumber} onChange={e => set('rollNumber', e.target.value)} placeholder="e.g., 2024-CS-042" className={input(false)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Hash className="w-3.5 h-3.5" /> Section <span className="text-red-400">*</span>
            </label>
            <input type="text" value={data.section} onChange={e => set('section', e.target.value)} placeholder="e.g., A" className={input(!!errors.section)} />
            {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input type="date" value={data.submissionDate} onChange={e => set('submissionDate', e.target.value)} className={input(false)} />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" /> Instructor <span className="text-red-400">*</span>
          </label>
          <input type="text" value={data.instructorName} onChange={e => set('instructorName', e.target.value)} placeholder="Instructor's name" className={input(!!errors.instructorName)} />
          {errors.instructorName && <p className="text-red-500 text-xs mt-1">{errors.instructorName}</p>}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Subject <span className="text-red-400">*</span>
          </label>
          <input type="text" value={data.subjectName} onChange={e => set('subjectName', e.target.value)} placeholder="e.g., Data Structures" className={input(!!errors.subjectName)} />
          {errors.subjectName && <p className="text-red-500 text-xs mt-1">{errors.subjectName}</p>}
        </div>

        <div className="pt-3">
          <button type="submit" className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]">
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOneForm;
