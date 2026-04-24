import React from 'react';
import { Loader2, BookOpen, FileText, Sparkles, ScanText } from 'lucide-react';

interface Props { hasImage?: boolean }

const LoadingScreen: React.FC<Props> = ({ hasImage = false }) => {
  const [step, setStep] = React.useState(0);
  const steps = hasImage
    ? [{ icon: <ScanText className="w-5 h-5" />, text: 'Extracting text from image...' }, { icon: <Sparkles className="w-5 h-5" />, text: 'AI is writing content...' }, { icon: <FileText className="w-5 h-5" />, text: 'Building document...' }]
    : [{ icon: <BookOpen className="w-5 h-5" />, text: 'Preparing cover page...' }, { icon: <Sparkles className="w-5 h-5" />, text: 'AI is writing content...' }, { icon: <FileText className="w-5 h-5" />, text: 'Building document...' }];

  React.useEffect(() => {
    const t = steps.slice(0, -1).map((_, i) => setTimeout(() => setStep(i + 1), 3000 * (i + 1)));
    return () => t.forEach(clearTimeout);
  }, [steps.length]);

  return (
    <div className="max-w-md mx-auto text-center py-20 animate-fade-in">
      <div className="relative w-20 h-20 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        <div className="absolute inset-2.5 rounded-full border-4 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Generating assignment</h2>
      <p className="text-sm text-gray-400 mb-10">This usually takes 5–15 seconds</p>
      <div className="space-y-3 text-left">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl transition-all duration-500 border ${i <= step ? 'bg-brand-50/50 border-brand-100' : 'bg-white border-gray-100 opacity-40'}`}>
            <div className={i < step ? 'w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center' : i === step ? 'text-brand-500' : 'text-gray-300'}>
              {i < step ? <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : i === step ? <Loader2 className="w-5 h-5 animate-spin" /> : s.icon}
            </div>
            <span className={`text-sm font-medium ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
