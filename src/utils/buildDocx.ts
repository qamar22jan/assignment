import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, BorderStyle, NumberFormat, ImageRun,
} from 'docx';
import type { PersonalInfo, CoverPageStyle } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function base64ToBuffer(b64: string): { data: Uint8Array; ext: string } {
  const m = b64.match(/data:image\/(\w+);base64,/);
  const ext = m ? (m[1] === 'jpeg' ? 'jpg' : m[1]) : 'png';
  const raw = atob(b64.split(',')[1]);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return { data: buf, ext: ext as any };
}

function tr(text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; color?: string; font?: string }) {
  return new TextRun({ text, bold: opts?.bold, italics: opts?.italic, size: opts?.size ?? 24, font: opts?.font ?? 'Times New Roman', color: opts?.color });
}

const center = AlignmentType.CENTER;
const sp = (before = 0, after = 0) => ({ before, after });
const pBreak = new Paragraph({ children: [new PageBreak()] });

// ─── Markdown parser ─────────────────────────────────────────────────────────

interface Run { text: string; bold?: boolean; italic?: boolean }

function inline(text: string): Run[] {
  const runs: Run[] = [];
  const re = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index) });
    if (m[2]) runs.push({ text: m[2], bold: true, italic: true });
    else if (m[3]) runs.push({ text: m[3], bold: true });
    else if (m[4]) runs.push({ text: m[4], italic: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last) });
  return runs.filter(r => r.text);
}

function toRuns(runs: Run[], size = 24, font = 'Times New Roman') {
  return runs.map(r => new TextRun({ text: r.text, bold: r.bold, italics: r.italic, size, font }));
}

function contentBlocks(md: string): Paragraph[] {
  const out: Paragraph[] = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (/^---+$|^\*\*\*+$|^___+$/.test(line)) { out.push(new Paragraph({ spacing: sp(200, 200), border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'd4d4d8' } }, children: [] })); continue; }
    if (line.startsWith('### ')) { out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: sp(300, 120), children: toRuns(inline(line.slice(4)), 26) })); continue; }
    if (line.startsWith('## ')) { out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: sp(360, 160), children: toRuns(inline(line.slice(3)), 28) })); continue; }
    if (line.startsWith('# ')) { out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: sp(400, 200), children: toRuns(inline(line.slice(2)), 32) })); continue; }
    if (/^[-*] /.test(line)) { out.push(new Paragraph({ bullet: { level: 0 }, spacing: sp(60, 60), children: toRuns(inline(line.slice(2))) })); continue; }
    if (/^\d+\.\s/.test(line)) { out.push(new Paragraph({ numbering: { reference: 'n', level: 0 }, spacing: sp(60, 60), children: toRuns(inline(line.replace(/^\d+\.\s/, ''))) })); continue; }
    out.push(new Paragraph({ spacing: sp(80, 120), children: toRuns(inline(line)) }));
  }
  return out;
}

// ─── Cover page generators per style ────────────────────────────────────────

function logoPara(logo?: string) {
  if (!logo) return null;
  try {
    const { data, ext } = base64ToBuffer(logo);
    return new Paragraph({ alignment: center, spacing: sp(0, 200), children: [new ImageRun({ data, type: ext === 'jpg' ? 'jpg' : 'png', transformation: { width: 180, height: 90 } })] });
  } catch { return null; }
}

function classicCover(i: PersonalInfo & { assignmentTopic?: string }) {
  const c: Paragraph[] = [
    new Paragraph({ spacing: sp(3000) }),
  ];
  const lp = logoPara(i.universityLogo); if (lp) c.push(lp);
  if (i.universityName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 100), children: [tr(i.universityName.toUpperCase(), { bold: true, size: 36, color: '1a365d' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(200, 200), children: [tr('━━━━━━━━━━━━━━━━━━', { color: 'c6a04a', size: 20 })] }));
  if (i.subjectName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 400), children: [tr(`Department of ${i.subjectName}`, { size: 26, color: '2c5282' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(0, 100), children: [tr('ASSIGNMENT ON', { size: 22, color: '666666' })] }));
  if (i.assignmentTopic) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(i.assignmentTopic, { bold: true, size: 32, color: '1a365d' })] }));
  for (const [l, v] of [['Submitted By', i.studentName], ['Roll Number', i.rollNumber], ['Section', i.section], ['Instructor', i.instructorName], ['Date', i.submissionDate || new Date().toLocaleDateString()]] as const) {
    if (v) c.push(new Paragraph({ alignment: center, spacing: sp(60, 60), children: [tr(`${l}: `, { bold: true, size: 22, color: '1a365d' }), tr(v, { size: 22 })] }));
  }
  c.push(pBreak);
  return { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: c };
}

function modernCover(i: PersonalInfo & { assignmentTopic?: string }) {
  const c: Paragraph[] = [];
  const lp = logoPara(i.universityLogo); if (lp) c.push(lp);
  if (i.universityName) c.push(new Paragraph({ alignment: center, spacing: sp(400, 100), children: [tr(i.universityName.toUpperCase(), { bold: true, size: 34, color: '4338ca' })] }));
  if (i.subjectName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(i.subjectName, { size: 26, color: '6366f1' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(0, 100), children: [tr('Assignment', { size: 20, color: '6366f1', bold: true })] }));
  if (i.assignmentTopic) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(i.assignmentTopic, { bold: true, size: 32, color: '1e1b4b' })] }));
  for (const [l, v] of [['Student', i.studentName], ['Roll No', i.rollNumber], ['Section', i.section], ['Instructor', i.instructorName], ['Date', i.submissionDate || new Date().toLocaleDateString()]] as const) {
    if (v) c.push(new Paragraph({ alignment: center, spacing: sp(60, 60), children: [tr(`${l}: `, { bold: true, size: 22, color: '6366f1' }), tr(v, { size: 22 })] }));
  }
  c.push(pBreak);
  return { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: c };
}

function elegantCover(i: PersonalInfo & { assignmentTopic?: string }) {
  const c: Paragraph[] = [];
  const lp = logoPara(i.universityLogo); if (lp) c.push(lp);
  if (i.universityName) c.push(new Paragraph({ alignment: center, spacing: sp(200, 100), children: [tr(i.universityName.toUpperCase(), { size: 30, color: '2d2d2d' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(100, 100), children: [tr('◆', { size: 16, color: 'd4af37' })] }));
  if (i.subjectName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 400), children: [tr(i.subjectName, { italic: true, size: 24, color: '666666' })] }));
  if (i.assignmentTopic) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(`"${i.assignmentTopic}"`, { italic: true, size: 30, color: '1a1a1a' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(0, 80), children: [tr('Submitted by', { size: 12, color: '999999' })] }));
  if (i.studentName) c.push(new Paragraph({ alignment: center, children: [tr(i.studentName, { bold: true, size: 22, color: '2d2d2d' })] }));
  for (const v of [i.rollNumber ? `Roll No: ${i.rollNumber}` : '', i.section ? `Section: ${i.section}` : '']) {
    if (v) c.push(new Paragraph({ alignment: center, spacing: sp(40, 40), children: [tr(v, { size: 20, color: '444444' })] }));
  }
  if (i.instructorName) c.push(new Paragraph({ alignment: center, spacing: sp(120, 40), children: [tr(`Instructor: `, { size: 20, color: '444444' }), tr(i.instructorName, { bold: true, size: 20, color: '444444' })] }));
  if (i.submissionDate) c.push(new Paragraph({ alignment: center, spacing: sp(80), children: [tr(i.submissionDate, { size: 18, color: '999999' })] }));
  c.push(pBreak);
  return { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: c };
}

function professionalCover(i: PersonalInfo & { assignmentTopic?: string }) {
  const c: Paragraph[] = [];
  const lp = logoPara(i.universityLogo); if (lp) c.push(lp);
  if (i.universityName) c.push(new Paragraph({ alignment: center, spacing: sp(200, 60), children: [tr(i.universityName.toUpperCase(), { bold: true, size: 32, color: '0f172a' })] }));
  if (i.subjectName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(i.subjectName, { size: 24, color: 'f59e0b' })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(0, 100), children: [tr('ASSIGNMENT TOPIC', { size: 16, color: '94a3b8' })] }));
  if (i.assignmentTopic) c.push(new Paragraph({ alignment: center, spacing: sp(0, 600), children: [tr(i.assignmentTopic, { bold: true, size: 30, color: '0f172a' })] }));
  for (const [l, v] of [['Student Name', i.studentName], ['Roll Number', i.rollNumber], ['Section', i.section], ['Instructor', i.instructorName], ['Submission Date', i.submissionDate || new Date().toLocaleDateString()]] as const) {
    if (v) c.push(new Paragraph({ alignment: center, spacing: sp(50, 50), children: [tr(`${l}: `, { bold: true, size: 20, color: '64748b' }), tr(v, { size: 20, color: '0f172a' })] }));
  }
  c.push(pBreak);
  return { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: c };
}

function genericCover(i: PersonalInfo & { assignmentTopic?: string }, accent: string) {
  const c: Paragraph[] = [];
  const lp = logoPara(i.universityLogo); if (lp) c.push(lp);
  if (i.universityName) c.push(new Paragraph({ alignment: center, spacing: sp(200, 60), children: [tr(i.universityName.toUpperCase(), { bold: true, size: 30, color: accent })] }));
  if (i.subjectName) c.push(new Paragraph({ alignment: center, spacing: sp(0, 300), children: [tr(i.subjectName, { size: 24, color: accent })] }));
  c.push(new Paragraph({ alignment: center, spacing: sp(100, 400), children: [tr('━━━━━━━━━━━━━━', { size: 18, color: accent })] }));
  if (i.assignmentTopic) c.push(new Paragraph({ alignment: center, spacing: sp(0, 500), children: [tr(i.assignmentTopic, { bold: true, size: 30 })] }));
  for (const [l, v] of [['Student', i.studentName], ['Roll No', i.rollNumber], ['Section', i.section], ['Instructor', i.instructorName], ['Date', i.submissionDate || new Date().toLocaleDateString()]] as const) {
    if (v) c.push(new Paragraph({ alignment: center, spacing: sp(50, 50), children: [tr(`${l}: `, { bold: true, size: 20, color: accent }), tr(v, { size: 20 })] }));
  }
  c.push(pBreak);
  return { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: c };
}

const coverFn: Record<CoverPageStyle, (i: PersonalInfo & { assignmentTopic?: string }) => any> = {
  classic: classicCover,
  modern: modernCover,
  elegant: elegantCover,
  professional: professionalCover,
  minimalist: (i) => genericCover(i, '374151'),
  corporate: (i) => genericCover(i, '1e293b'),
  gradient: (i) => genericCover(i, '0d9488'),
  geometric: (i) => genericCover(i, 'ea580c'),
  typography: (i) => genericCover(i, 'dc2626'),
  academic: (i) => genericCover(i, '7f1d1d'),
};

// ─── Main export ────────────────────────────────────────────────────────────

export async function buildAssignmentDocx(
  personalInfo: PersonalInfo,
  assignmentTopic: string,
  markdownContent: string,
  coverStyle: CoverPageStyle = 'classic',
): Promise<ArrayBuffer> {
  const blocks = contentBlocks(markdownContent);

  const doc = new Document({
    numbering: { config: [{ reference: 'n', levels: [{ level: 0, format: NumberFormat.DECIMAL, text: '%1.', alignment: AlignmentType.START }] }] },
    sections: [
      coverFn[coverStyle]({ ...personalInfo, assignmentTopic }),
      {
        properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
        children: blocks,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return await blob.arrayBuffer();
}
