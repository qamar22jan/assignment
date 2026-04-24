import React from 'react';
import type { PersonalInfo, CoverPageStyle } from '../types';

interface CoverPageProps {
  info: PersonalInfo & { assignmentTopic?: string };
  style: CoverPageStyle;
}

/* ══════════════════════════════════════════════════════════════════════════════
   1. CLASSIC — Navy & Gold, traditional academic
   ══════════════════════════════════════════════════════════════════════════════ */
const ClassicCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Times New Roman", Georgia, serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg,#1a365d,#2c5282,#1a365d)' }} />
    <div style={{ position: 'absolute', top: 6, left: 0, right: 0, height: 2, background: '#c6a04a' }} />
    {info.universityLogo && <div style={{ marginBottom: 24 }}><img src={info.universityLogo} alt="Logo" style={{ height: 100, objectFit: 'contain' }} /></div>}
    <h1 style={{ fontSize: 26, fontWeight: 'bold', color: '#1a365d', textAlign: 'center', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>{info.universityName || 'University Name'}</h1>
    <div style={{ width: 120, height: 2, backgroundColor: '#c6a04a', margin: '16px 0' }} />
    <h2 style={{ fontSize: 18, color: '#2c5282', textAlign: 'center', marginBottom: 40, letterSpacing: .5 }}>Department of {info.subjectName || 'Subject'}</h2>
    <div style={{ border: '2px solid #1a365d', padding: '20px 50px', marginBottom: 50, textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Assignment On</p>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1a365d', lineHeight: 1.4 }}>{info.assignmentTopic || 'Assignment Title'}</h2>
    </div>
    <div style={{ textAlign: 'center', lineHeight: 2.2, fontSize: 16 }}>
      <p><strong style={{ color: '#1a365d' }}>Submitted By:</strong> {info.studentName || 'Student Name'}</p>
      <p><strong style={{ color: '#1a365d' }}>Roll Number:</strong> {info.rollNumber || 'N/A'}</p>
      <p><strong style={{ color: '#1a365d' }}>Section:</strong> {info.section || 'N/A'}</p>
      <p><strong style={{ color: '#1a365d' }}>Instructor:</strong> {info.instructorName || 'N/A'}</p>
      <p><strong style={{ color: '#1a365d' }}>Date:</strong> {info.submissionDate || new Date().toLocaleDateString()}</p>
    </div>
    <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, height: 2, background: '#c6a04a' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg,#1a365d,#2c5282,#1a365d)' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   2. MODERN — Purple gradient header
   ══════════════════════════════════════════════════════════════════════════════ */
const ModernCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', fontFamily: '"Helvetica Neue", Arial, sans-serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: 'linear-gradient(180deg,#6366f1,#8b5cf6,#a78bfa)' }} />
    <div style={{ padding: '50px 60px 30px 60px', background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', color: 'white', position: 'relative' }}>
      {info.universityLogo && <div style={{ marginBottom: 16 }}><img src={info.universityLogo} alt="Logo" style={{ height: 70, objectFit: 'contain', filter: 'brightness(10)' }} /></div>}
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: .5, textTransform: 'uppercase', opacity: .9 }}>{info.universityName || 'University Name'}</h1>
      <p style={{ fontSize: 14, opacity: .8, letterSpacing: 1, textTransform: 'uppercase' }}>{info.subjectName || 'Subject Name'}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 60px' }}>
      <p style={{ fontSize: 13, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12, fontWeight: 600 }}>Assignment</p>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1e1b4b', lineHeight: 1.3, marginBottom: 40, borderLeft: '4px solid #6366f1', paddingLeft: 20 }}>{info.assignmentTopic || 'Assignment Title'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14, color: '#374151', background: '#f8fafc', padding: 24, borderRadius: 8 }}>
        <div><span style={{ color: '#6366f1', fontWeight: 600 }}>Student:</span> {info.studentName || 'N/A'}</div>
        <div><span style={{ color: '#6366f1', fontWeight: 600 }}>Roll No:</span> {info.rollNumber || 'N/A'}</div>
        <div><span style={{ color: '#6366f1', fontWeight: 600 }}>Section:</span> {info.section || 'N/A'}</div>
        <div><span style={{ color: '#6366f1', fontWeight: 600 }}>Instructor:</span> {info.instructorName || 'N/A'}</div>
      </div>
      <p style={{ marginTop: 30, fontSize: 13, color: '#9ca3af' }}>Date of Submission: {info.submissionDate || new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   3. ELEGANT — Gold serif with ornamental corners
   ══════════════════════════════════════════════════════════════════════════════ */
const ElegantCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, "Times New Roman", serif', backgroundColor: '#faf9f6', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', top: 30, left: 30, right: 30, bottom: 30, border: '1px solid #d4af37', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: 35, left: 35, right: 35, bottom: 35, border: '1px solid #d4af37', pointerEvents: 'none' }} />
    <div style={{ fontSize: 30, color: '#d4af37', marginBottom: 20 }}>❧</div>
    {info.universityLogo && <div style={{ marginBottom: 20 }}><img src={info.universityLogo} alt="Logo" style={{ height: 90, objectFit: 'contain' }} /></div>}
    <h1 style={{ fontSize: 24, fontWeight: 'normal', color: '#2d2d2d', textAlign: 'center', marginBottom: 4, letterSpacing: 3, textTransform: 'uppercase' }}>{info.universityName || 'University Name'}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 8px' }}>
      <div style={{ width: 60, height: 1, backgroundColor: '#d4af37' }} />
      <div style={{ fontSize: 10, color: '#d4af37' }}>◆</div>
      <div style={{ width: 60, height: 1, backgroundColor: '#d4af37' }} />
    </div>
    <p style={{ fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 40 }}>{info.subjectName || 'Subject Name'}</p>
    <h2 style={{ fontSize: 28, fontWeight: 'normal', color: '#1a1a1a', textAlign: 'center', lineHeight: 1.4, marginBottom: 50, fontStyle: 'italic', maxWidth: '80%' }}>"{info.assignmentTopic || 'Assignment Title'}"</h2>
    <div style={{ textAlign: 'center', lineHeight: 2.5, fontSize: 15, color: '#444' }}>
      <p style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: 12, color: '#999', marginBottom: 8 }}>Submitted by</p>
      <p style={{ fontSize: 18, fontWeight: 'bold', color: '#2d2d2d' }}>{info.studentName || 'Student Name'}</p>
      <p>Roll No: {info.rollNumber || 'N/A'} | Section: {info.section || 'N/A'}</p>
      <p style={{ marginTop: 12 }}>Instructor: <strong>{info.instructorName || 'N/A'}</strong></p>
      <p style={{ color: '#999', fontSize: 13, marginTop: 8 }}>{info.submissionDate || new Date().toLocaleDateString()}</p>
    </div>
    <div style={{ fontSize: 30, color: '#d4af37', marginTop: 40 }}>❧</div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   4. PROFESSIONAL — Dark header, yellow accent
   ══════════════════════════════════════════════════════════════════════════════ */
const ProfessionalCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, Helvetica, sans-serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ background: '#0f172a', color: 'white', padding: '40px 50px', display: 'flex', alignItems: 'center', gap: 24 }}>
      {info.universityLogo && <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid #f59e0b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}><img src={info.universityLogo} alt="Logo" style={{ height: 70, width: 70, objectFit: 'contain' }} /></div>}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' }}>{info.universityName || 'University Name'}</h1>
        <p style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 1, textTransform: 'uppercase' }}>{info.subjectName || 'Subject Name'}</p>
      </div>
    </div>
    <div style={{ height: 4, background: '#f59e0b' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 50 }}>
      <div style={{ background: '#f8fafc', borderLeft: '6px solid #0f172a', padding: '30px 40px', marginBottom: 50 }}>
        <p style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>Assignment Topic</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{info.assignmentTopic || 'Assignment Title'}</h2>
      </div>
      <div style={{ fontSize: 15, lineHeight: 2.5 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><td style={{ padding: '6px 0', color: '#64748b', width: 160, fontWeight: 600 }}>Student Name</td><td style={{ padding: '6px 0', color: '#0f172a' }}>: {info.studentName || 'N/A'}</td></tr>
          <tr><td style={{ padding: '6px 0', color: '#64748b', fontWeight: 600 }}>Roll Number</td><td style={{ padding: '6px 0', color: '#0f172a' }}>: {info.rollNumber || 'N/A'}</td></tr>
          <tr><td style={{ padding: '6px 0', color: '#64748b', fontWeight: 600 }}>Section</td><td style={{ padding: '6px 0', color: '#0f172a' }}>: {info.section || 'N/A'}</td></tr>
          <tr><td style={{ padding: '6px 0', color: '#64748b', fontWeight: 600 }}>Instructor</td><td style={{ padding: '6px 0', color: '#0f172a' }}>: {info.instructorName || 'N/A'}</td></tr>
          <tr><td style={{ padding: '6px 0', color: '#64748b', fontWeight: 600 }}>Submission Date</td><td style={{ padding: '6px 0', color: '#0f172a' }}>: {info.submissionDate || new Date().toLocaleDateString()}</td></tr>
        </tbody></table>
      </div>
    </div>
    <div style={{ background: '#0f172a', padding: '12px 50px', color: '#64748b', fontSize: 11, textAlign: 'center' }}>{info.universityName || 'University'} — Academic Assignment Submission</div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   5. MINIMALIST — Ultra clean, thin line, tons of whitespace
   ══════════════════════════════════════════════════════════════════════════════ */
const MinimalistCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', top: '35%', left: '15%', right: '15%', height: 1, background: '#e5e7eb' }} />
    {info.universityLogo && <div style={{ marginBottom: 40 }}><img src={info.universityLogo} alt="Logo" style={{ height: 60, objectFit: 'contain', opacity: .7 }} /></div>}
    <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16, fontWeight: 500 }}>{info.universityName || 'University'}</p>
    <h1 style={{ fontSize: 30, fontWeight: 300, color: '#111827', textAlign: 'center', lineHeight: 1.3, marginBottom: 60, maxWidth: '75%' }}>{info.assignmentTopic || 'Assignment Title'}</h1>
    <div style={{ width: 40, height: 1, background: '#111827', marginBottom: 60 }} />
    <div style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', lineHeight: 2.2 }}>
      <p>{info.studentName || 'Student Name'}</p>
      <p>{info.subjectName} · Section {info.section || 'N/A'}</p>
      <p>{info.instructorName || ''}</p>
      <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 8 }}>{info.submissionDate || new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   6. CORPORATE — Dark left sidebar, light right
   ══════════════════════════════════════════════════════════════════════════════ */
const CorporateCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', fontFamily: '"Segoe UI", Arial, sans-serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    {/* Left sidebar */}
    <div style={{ width: '30%', background: '#1e293b', color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', boxSizing: 'border-box' }}>
      {info.universityLogo && <div style={{ marginBottom: 30, padding: 8, background: 'white', borderRadius: 8 }}><img src={info.universityLogo} alt="Logo" style={{ height: 60, objectFit: 'contain' }} /></div>}
      <div style={{ textAlign: 'center', fontSize: 12, lineHeight: 2.4, width: '100%' }}>
        <p style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, marginBottom: 12 }}>Student Details</p>
        <p style={{ fontWeight: 600, color: '#f8fafc' }}>{info.studentName || 'Name'}</p>
        <p style={{ color: '#94a3b8' }}>{info.rollNumber || 'Roll No'}</p>
        <p style={{ color: '#94a3b8' }}>Section {info.section || 'N/A'}</p>
        <div style={{ width: 30, height: 1, background: '#475569', margin: '20px auto' }} />
        <p style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, marginBottom: 12 }}>Instructor</p>
        <p style={{ fontWeight: 500, color: '#f8fafc' }}>{info.instructorName || 'N/A'}</p>
        <p style={{ color: '#64748b', fontSize: 11, marginTop: 20 }}>{info.submissionDate || new Date().toLocaleDateString()}</p>
      </div>
    </div>
    {/* Right content */}
    <div style={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', boxSizing: 'border-box' }}>
      <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>{info.universityName || 'University'}</p>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 40 }}>{info.subjectName || 'Subject'}</p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 20 }}>{info.assignmentTopic || 'Assignment Title'}</h1>
      <div style={{ width: 50, height: 3, background: '#3b82f6', marginTop: 20 }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   7. GRADIENT — Teal-to-blue gradient header band
   ══════════════════════════════════════════════════════════════════════════════ */
const GradientCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', fontFamily: '"Helvetica Neue", Arial, sans-serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2, #2563eb)', padding: '50px 50px 70px 50px', color: 'white', position: 'relative' }}>
      {info.universityLogo && <div style={{ marginBottom: 16 }}><img src={info.universityLogo} alt="Logo" style={{ height: 60, objectFit: 'contain', filter: 'brightness(10)' }} /></div>}
      <h1 style={{ fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: .95 }}>{info.universityName || 'University Name'}</h1>
      <p style={{ fontSize: 14, opacity: .75, marginTop: 4 }}>{info.subjectName || 'Subject Name'}</p>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 50px', position: 'relative', marginTop: -40 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '30px 40px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#0d9488', fontWeight: 600, marginBottom: 8 }}>Assignment Topic</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 20 }}>{info.assignmentTopic || 'Assignment Title'}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: 13, color: '#475569' }}>
          <span><strong>Student:</strong> {info.studentName || 'N/A'}</span>
          <span><strong>Roll:</strong> {info.rollNumber || 'N/A'}</span>
          <span><strong>Section:</strong> {info.section || 'N/A'}</span>
          <span><strong>Instructor:</strong> {info.instructorName || 'N/A'}</span>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: 30, fontSize: 12, color: '#94a3b8' }}>{info.submissionDate || new Date().toLocaleDateString()}</p>
    </div>
    <div style={{ height: 4, background: 'linear-gradient(90deg, #0d9488, #2563eb)' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   8. GEOMETRIC — Orange shapes, clean white
   ══════════════════════════════════════════════════════════════════════════════ */
const GeometricCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Helvetica Neue", Arial, sans-serif', backgroundColor: '#fff', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
    {/* Top-right circle */}
    <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'linear-gradient(135deg,#fb923c,#f97316)', opacity: .15 }} />
    <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg,#fb923c,#f97316)', opacity: .1 }} />
    {/* Bottom-left triangle */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: 0, height: 0, borderRight: '180px solid transparent', borderBottom: '180px solid #fff7ed' }} />
    {/* Content */}
    <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '75%' }}>
      {info.universityLogo && <div style={{ marginBottom: 24 }}><img src={info.universityLogo} alt="Logo" style={{ height: 70, objectFit: 'contain' }} /></div>}
      <p style={{ fontSize: 12, color: '#f97316', textTransform: 'uppercase', letterSpacing: 4, fontWeight: 700, marginBottom: 16 }}>{info.universityName || 'University'}</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1c1917', lineHeight: 1.3, marginBottom: 12 }}>{info.assignmentTopic || 'Assignment Title'}</h1>
      <p style={{ fontSize: 14, color: '#78716c', marginBottom: 40 }}>{info.subjectName || 'Subject'}</p>
      <div style={{ width: 60, height: 3, background: '#f97316', margin: '0 auto 40px' }} />
      <div style={{ fontSize: 13, color: '#57534e', lineHeight: 2.2 }}>
        <p><strong>{info.studentName || 'Student'}</strong></p>
        <p>Section {info.section || 'N/A'} · Roll {info.rollNumber || 'N/A'}</p>
        <p>Instructor: {info.instructorName || 'N/A'}</p>
        <p style={{ color: '#a8a29e', fontSize: 11, marginTop: 4 }}>{info.submissionDate || new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   9. TYPOGRAPHY — Huge bold text, red accent
   ══════════════════════════════════════════════════════════════════════════════ */
const TypographyCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', fontFamily: '"Georgia", serif', backgroundColor: '#fff', position: 'relative', boxSizing: 'border-box' }}>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '50px 60px' }}>
      {info.universityLogo && <div style={{ marginBottom: 30 }}><img src={info.universityLogo} alt="Logo" style={{ height: 50, objectFit: 'contain', opacity: .6 }} /></div>}
      <p style={{ fontSize: 11, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 6, fontWeight: 700, marginBottom: 20 }}>{info.universityName || 'University'}</p>
      <h1 style={{ fontSize: 42, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.15, marginBottom: 30, textTransform: 'uppercase', letterSpacing: -1 }}>{info.assignmentTopic || 'Assignment Title'}</h1>
      <div style={{ width: 80, height: 4, background: '#dc2626', marginBottom: 40 }} />
      <div style={{ fontSize: 14, color: '#525252', lineHeight: 2 }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 10, color: '#a3a3a3', marginBottom: 8 }}>Prepared by</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#171717' }}>{info.studentName || 'Student Name'}</p>
        <p style={{ fontSize: 12, color: '#737373' }}>{info.subjectName || 'Subject'} · Section {info.section || 'N/A'}</p>
        <p style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>Instructor: {info.instructorName || 'N/A'} · {info.submissionDate || new Date().toLocaleDateString()}</p>
      </div>
    </div>
    <div style={{ height: 8, background: '#0a0a0a' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   10. ACADEMIC — Burgundy, two-column boxed layout
   ══════════════════════════════════════════════════════════════════════════════ */
const AcademicCover: React.FC<CoverPageProps> = ({ info }) => (
  <div style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Times New Roman", Georgia, serif', backgroundColor: '#fdf8f6', position: 'relative', boxSizing: 'border-box' }}>
    {/* Top bar */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#7f1d1d' }} />
    <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 1, background: '#d4a574' }} />

    {info.universityLogo && <div style={{ marginBottom: 16 }}><img src={info.universityLogo} alt="Logo" style={{ height: 80, objectFit: 'contain' }} /></div>}
    <h1 style={{ fontSize: 22, fontWeight: 'bold', color: '#7f1d1d', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>{info.universityName || 'University Name'}</h1>
    <p style={{ fontSize: 14, color: '#92400e', marginBottom: 30, fontStyle: 'italic' }}>{info.subjectName || 'Subject Name'}</p>

    {/* Assignment box */}
    <div style={{ border: '2px solid #7f1d1d', padding: '16px 40px', marginBottom: 30, textAlign: 'center', backgroundColor: '#fff' }}>
      <p style={{ fontSize: 10, color: '#991b1b', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4 }}>Assignment</p>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#1c1917', lineHeight: 1.4 }}>{info.assignmentTopic || 'Assignment Title'}</h2>
    </div>

    {/* Two-column info */}
    <div style={{ display: 'flex', gap: 30, fontSize: 13, color: '#44403c' }}>
      <div style={{ textAlign: 'right', lineHeight: 2.2, borderRight: '1px solid #d6d3d1', paddingRight: 30 }}>
        <p style={{ fontWeight: 'bold', color: '#7f1d1d' }}>Student</p>
        <p>{info.studentName || 'N/A'}</p>
        <p style={{ fontWeight: 'bold', color: '#7f1d1d', marginTop: 8 }}>Roll Number</p>
        <p>{info.rollNumber || 'N/A'}</p>
      </div>
      <div style={{ textAlign: 'left', lineHeight: 2.2, paddingLeft: 30 }}>
        <p style={{ fontWeight: 'bold', color: '#7f1d1d' }}>Instructor</p>
        <p>{info.instructorName || 'N/A'}</p>
        <p style={{ fontWeight: 'bold', color: '#7f1d1d', marginTop: 8 }}>Section</p>
        <p>{info.section || 'N/A'}</p>
      </div>
    </div>
    <p style={{ fontSize: 12, color: '#a8a29e', marginTop: 20 }}>{info.submissionDate || new Date().toLocaleDateString()}</p>

    <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, height: 1, background: '#d4a574' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, background: '#7f1d1d' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   Registry & exports
   ══════════════════════════════════════════════════════════════════════════════ */
import { COVER_STYLES } from '../types';

const coverComponents: Record<CoverPageStyle, React.FC<CoverPageProps>> = {
  classic: ClassicCover,
  modern: ModernCover,
  elegant: ElegantCover,
  professional: ProfessionalCover,
  minimalist: MinimalistCover,
  corporate: CorporateCover,
  gradient: GradientCover,
  geometric: GeometricCover,
  typography: TypographyCover,
  academic: AcademicCover,
};

export const getRandomStyle = (): CoverPageStyle => {
  const ids = COVER_STYLES.map(s => s.id);
  return ids[Math.floor(Math.random() * ids.length)];
};

interface CoverPageRendererProps {
  info: PersonalInfo & { assignmentTopic?: string };
  style: CoverPageStyle;
}

export const CoverPageRenderer: React.FC<CoverPageRendererProps> = ({ info, style }) => {
  const Component = coverComponents[style] || ClassicCover;
  return <Component info={info} style={style} />;
};

export default coverComponents;
