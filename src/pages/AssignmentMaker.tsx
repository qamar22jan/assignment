import React, { useState, useCallback } from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import StepOneForm from '../components/StepOneForm';
import StepTwoForm from '../components/StepTwoForm';
import LoadingScreen from '../components/LoadingScreen';
import DocumentPreview from '../components/DocumentPreview';
import { generateAssignment, performOCR } from '../utils/groqApi';
import type { PersonalInfo, AssignmentInfo, AppStep, CoverPageStyle, TokenUsage } from '../types';

const defaults = {
  personal: { studentName: '', universityLogo: '', section: '', instructorName: '', subjectName: '', universityName: '', rollNumber: '', submissionDate: new Date().toISOString().split('T')[0] } as PersonalInfo,
  assignment: { assignmentTopic: '', requirements: '', subjectForAI: '', assignmentType: 'Essay', wordCount: '800-1200', referenceImage: '', modelId: 'llama-3.1-8b-instant' } as AssignmentInfo,
};

interface Props { onBack: () => void }

const AssignmentMaker: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<AppStep>('step1');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaults.personal);
  const [assignmentInfo, setAssignmentInfo] = useState<AssignmentInfo>(defaults.assignment);
  const [apiKey, setApiKey] = useState('');
  const [coverStyle, setCoverStyle] = useState<CoverPageStyle>('classic');
  const [aiContent, setAiContent] = useState('');
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [, setOcrText] = useState('');
  const [error, setError] = useState('');

  const goNext = useCallback(() => {
    setStep('step2');
    if (!assignmentInfo.subjectForAI && personalInfo.subjectName)
      setAssignmentInfo(p => ({ ...p, subjectForAI: personalInfo.subjectName }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [assignmentInfo.subjectForAI, personalInfo.subjectName]);

  const goBack = useCallback(() => { setStep('step1'); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const submit = useCallback(async () => {
    setStep('loading'); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      let ocr = '';
      if (assignmentInfo.referenceImage) {
        try { ocr = await performOCR(apiKey, assignmentInfo.referenceImage); setOcrText(ocr); }
        catch (e: any) { console.warn('OCR skipped:', e.message); }
      }
      const result = await generateAssignment(apiKey, assignmentInfo.assignmentTopic, assignmentInfo.requirements, assignmentInfo.subjectForAI, assignmentInfo.assignmentType, assignmentInfo.wordCount, assignmentInfo.modelId, ocr || undefined);
      setAiContent(result.content); setTokenUsage(result.usage); setStep('preview');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.'); setStep('step2');
    }
  }, [apiKey, assignmentInfo]);

  const reset = useCallback(() => {
    setStep('step1'); setPersonalInfo(defaults.personal); setAssignmentInfo(defaults.assignment);
    setCoverStyle('classic'); setAiContent(''); setTokenUsage(null); setOcrText(''); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const steps = ['Details', 'Topic', 'Generate'];
  const stepIdx = ['step1', 'step2', 'loading'].indexOf(step);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ─── Nav ─── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={step === 'preview' ? reset : onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{step === 'preview' ? 'New' : 'Back'}</span>
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-gray-900">Assignment Maker</span>
            </div>
          </div>
          {step !== 'preview' && (
            <div className="flex items-center gap-1.5">
              {steps.map((label, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div className={`w-5 h-px ${i <= stepIdx ? 'bg-brand-400' : 'bg-gray-200'}`} />}
                  <div className={`flex items-center gap-1.5 ${i <= stepIdx ? 'text-brand-600' : 'text-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === stepIdx ? 'bg-brand-500 text-white' : i < stepIdx ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                      {i < stepIdx ? '✓' : i + 1}
                    </div>
                    <span className="hidden md:inline text-xs font-medium">{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        {step !== 'preview' && (
          <div className="h-px bg-gray-100">
            <div className="h-px bg-brand-400 transition-all duration-500" style={{ width: `${[33, 66, 85][stepIdx]}%` }} />
          </div>
        )}
      </header>

      {/* ─── Content ─── */}
      {step === 'preview' ? (
        <DocumentPreview personalInfo={personalInfo} assignmentInfo={assignmentInfo} coverStyle={coverStyle} aiContent={aiContent}
          onCoverStyleChange={setCoverStyle} tokenUsage={tokenUsage} />
      ) : (
        <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 whitespace-pre-line"><strong>Error:</strong> {error}</p>
            </div>
          )}
          {step === 'step1' && <StepOneForm data={personalInfo} onChange={setPersonalInfo} onNext={goNext} />}
          {step === 'step2' && <StepTwoForm data={assignmentInfo} onChange={setAssignmentInfo} onSubmit={submit} onBack={goBack} apiKey={apiKey} onApiKeyChange={setApiKey} />}
          {step === 'loading' && <LoadingScreen hasImage={!!assignmentInfo.referenceImage} />}
        </main>
      )}
    </div>
  );
};

export default AssignmentMaker;
