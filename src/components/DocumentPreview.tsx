import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Download, Loader2, X, Eye } from 'lucide-react';
import { DocxEditor } from '@eigenpal/docx-js-editor';
import type { DocxEditorRef } from '@eigenpal/docx-js-editor';
import type { PersonalInfo, CoverPageStyle, AssignmentInfo, TokenUsage } from '../types';
import { COVER_STYLES } from '../types';
import { buildAssignmentDocx } from '../utils/buildDocx';
import { CoverPageRenderer } from './CoverPageStyles';

interface Props {
  personalInfo: PersonalInfo;
  assignmentInfo: AssignmentInfo;
  coverStyle: CoverPageStyle;
  aiContent: string;
  onCoverStyleChange: (s: CoverPageStyle) => void;
  tokenUsage: TokenUsage | null;
}

const makeFileName = (t: string, n: string) =>
  `${t || 'Assignment'}_${n || 'Student'}.docx`.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');

function downloadBlob(buffer: ArrayBuffer, name: string) {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

const DocumentPreview: React.FC<Props> = ({
  personalInfo, assignmentInfo, coverStyle, aiContent,
  onCoverStyleChange, tokenUsage,
}) => {
  const editorRef = useRef<DocxEditorRef>(null);
  const [docBuffer, setDocBuffer] = useState<ArrayBuffer | null>(null);
  const [building, setBuilding] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [lastBuiltStyle, setLastBuiltStyle] = useState<CoverPageStyle>(coverStyle);

  // Build docx once on mount
  useEffect(() => {
    let c = false;
    (async () => {
      setBuilding(true);
      try {
        const buf = await buildAssignmentDocx(personalInfo, assignmentInfo.assignmentTopic, aiContent, coverStyle);
        if (!c) { setDocBuffer(buf); setLastBuiltStyle(coverStyle); }
      } catch (e) { console.error(e); }
      finally { if (!c) setBuilding(false); }
    })();
    return () => { c = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiContent, personalInfo, assignmentInfo.assignmentTopic]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      if (coverStyle !== lastBuiltStyle) {
        const freshBuf = await buildAssignmentDocx(personalInfo, assignmentInfo.assignmentTopic, aiContent, coverStyle);
        const name = makeFileName(assignmentInfo.assignmentTopic, personalInfo.studentName);
        if (freshBuf) downloadBlob(freshBuf, name);
        setDocBuffer(freshBuf);
        setLastBuiltStyle(coverStyle);
      } else {
        const buf = await editorRef.current?.save();
        const name = makeFileName(assignmentInfo.assignmentTopic, personalInfo.studentName);
        if (buf) downloadBlob(buf, name);
        else if (docBuffer) downloadBlob(docBuffer, name);
      }
    } catch {
      if (docBuffer) downloadBlob(docBuffer, makeFileName(assignmentInfo.assignmentTopic, personalInfo.studentName));
    }
    finally { setDownloading(false); }
  }, [docBuffer, coverStyle, lastBuiltStyle, personalInfo, assignmentInfo.assignmentTopic, aiContent]);

  const fname = makeFileName(assignmentInfo.assignmentTopic, personalInfo.studentName);

  return (
    <>
      {/* ─── FULL-SCREEN EDITOR AREA: fixed below the 56px nav ─── */}
      <div className="fixed inset-x-0 bottom-0" style={{ top: 56 }}>
        {building ? (
          <div className="flex flex-col items-center justify-center h-full bg-[#f0f0f0]">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-sm font-semibold text-gray-700">Building document…</p>
            <p className="text-xs text-gray-400 mt-1">Creating .docx with your cover page</p>
          </div>
        ) : docBuffer ? (
          <DocxEditor
            ref={editorRef}
            documentBuffer={docBuffer}
            documentName={fname}
            showToolbar={true}
            showRuler={true}
            rulerUnit="cm"
            showMarginGuides={true}
            mode="editing"
            author={personalInfo.studentName || 'Student'}
            renderLogo={() => (
              <div className="flex items-center gap-2 select-none">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-extrabold">SF</span>
                </div>
                <span className="text-[13px] font-bold text-gray-800 hidden md:inline">StudyForge</span>
              </div>
            )}
            toolbarExtra={
              /* Cover style pills live INSIDE the editor's formatting bar */
              <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-gray-200">
                {COVER_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onCoverStyleChange(s.id)}
                    title={s.label}
                    className={`px-1.5 py-0.5 text-[11px] rounded transition-all ${
                      coverStyle === s.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {s.emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowCoverModal(true)}
                  title="Preview cover page"
                  className="px-1.5 py-0.5 text-[11px] rounded text-indigo-500 hover:bg-indigo-50 transition-all ml-0.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            }
            renderTitleBarRight={() => (
              <div className="flex items-center gap-2">
                {coverStyle !== lastBuiltStyle && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded hidden lg:inline-block">
                    Cover updates on download
                  </span>
                )}
                {tokenUsage && (
                  <span className="text-[10px] text-gray-400 hidden lg:inline-flex items-center gap-0.5">
                    {tokenUsage.total_tokens} tok
                    {tokenUsage.cached_tokens > 0 && <span className="text-emerald-500">({tokenUsage.cached_tokens} cached)</span>}
                  </span>
                )}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Download .docx</span>
                </button>
              </div>
            )}
            onSave={(buffer: ArrayBuffer) => downloadBlob(buffer, fname)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-[#f0f0f0]">
            <p className="text-sm text-red-500">Failed to build document.</p>
          </div>
        )}
      </div>

      {/* ─── Cover preview modal ─── */}
      {showCoverModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-6 pb-6 overflow-auto"
          onClick={() => setShowCoverModal(false)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-h-[92vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b px-4 py-2.5 flex justify-between items-center z-10">
              <span className="text-sm font-bold text-gray-800">
                {COVER_STYLES.find(s => s.id === coverStyle)?.emoji}{' '}
                {COVER_STYLES.find(s => s.id === coverStyle)?.label} Cover
              </span>
              <button onClick={() => setShowCoverModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <CoverPageRenderer
              info={{ ...personalInfo, assignmentTopic: assignmentInfo.assignmentTopic }}
              style={coverStyle}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentPreview;
