// Runs entirely in the browser — zero server cost for PDF generation

export interface CVData {
  header: { name: string; email: string; phone: string; linkedin?: string; location: string }
  summary: string
  experience: Array<{ company: string; title: string; duration: string; bullets: string[] }>
  skills: { matched: string[]; bridged: string[]; tools: string[] }
  education: Array<{ institution: string; degree: string; year: string }>
  projects: Array<{ name: string; outcome: string; stack: string[] }>
  email_draft: { subject: string; body: string }
  meta: { ats_score_estimate: number; tone_detected: string; gaps_bridged: string[] }
}

export async function generatePDF(cv: CVData): Promise<{ base64: string; blob: Blob }> {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  const PAGE_W = 210
  const MARGIN = 18
  const CONTENT_W = PAGE_W - MARGIN * 2
  let y = 20

  const ink = [14, 14, 14] as [number, number, number]
  const muted = [100, 95, 90] as [number, number, number]
  const accent = [80, 100, 20] as [number, number, number]

  function checkPage(needed = 8) {
    if (y + needed > 275) { doc.addPage(); y = 20 }
  }

  function sectionLine(title: string) {
    checkPage(12)
    y += 5
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...accent)
    doc.text(title.toUpperCase(), MARGIN, y)
    doc.setDrawColor(...accent)
    doc.setLineWidth(0.3)
    doc.line(MARGIN + doc.getTextWidth(title.toUpperCase()) + 2, y - 0.5, MARGIN + CONTENT_W, y - 0.5)
    doc.setTextColor(...ink)
    y += 4
  }

  function wrappedText(text: string, fontSize: number, style: "normal" | "bold" | "italic" = "normal", color = ink) {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", style)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, CONTENT_W)
    lines.forEach((line: string) => {
      checkPage(5)
      doc.text(line, MARGIN, y)
      y += fontSize * 0.42
    })
  }

  // ── HEADER ────────────────────────────────────────────────
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...ink)
  doc.text(cv.header.name, MARGIN, y)
  y += 8

  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...muted)
  const contacts = [cv.header.email, cv.header.phone, cv.header.location, cv.header.linkedin]
    .filter(Boolean).join("   |   ")
  doc.text(contacts, MARGIN, y)
  y += 5

  doc.setDrawColor(...accent)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 5

  // ── SUMMARY ───────────────────────────────────────────────
  wrappedText(cv.summary, 9.5, "normal")
  y += 2

  // ── EXPERIENCE ────────────────────────────────────────────
  sectionLine("Experience")
  cv.experience.forEach((role) => {
    checkPage(16)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...ink)
    doc.text(role.company, MARGIN, y)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...muted)
    doc.setFontSize(8.5)
    doc.text(role.duration, MARGIN + CONTENT_W, y, { align: "right" })
    y += 4.5
    doc.setFontSize(9)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(...muted)
    doc.text(role.title, MARGIN, y)
    y += 4

    doc.setFont("helvetica", "normal")
    doc.setTextColor(...ink)
    doc.setFontSize(9)
    role.bullets.forEach((bullet) => {
      checkPage(5)
      const lines = doc.splitTextToSize(`• ${bullet}`, CONTENT_W - 2)
      lines.forEach((line: string, i: number) => {
        doc.text(i === 0 ? line : `  ${line}`, MARGIN + 1, y)
        y += 4
      })
    })
    y += 2
  })

  // ── SKILLS ────────────────────────────────────────────────
  sectionLine("Skills")
  const allSkills = [
    ...cv.skills.matched,
    ...cv.skills.tools,
    ...cv.skills.bridged,
  ].filter(Boolean)
  const skillLine = allSkills.join("  ·  ")
  wrappedText(skillLine, 9, "normal")
  y += 2

  // ── EDUCATION ─────────────────────────────────────────────
  if (cv.education?.length) {
    sectionLine("Education")
    cv.education.forEach((ed) => {
      checkPage(8)
      doc.setFontSize(9.5)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...ink)
      doc.text(ed.institution, MARGIN, y)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(...muted)
      doc.text(ed.year, MARGIN + CONTENT_W, y, { align: "right" })
      y += 4.5
      doc.setFont("helvetica", "italic")
      doc.text(ed.degree, MARGIN, y)
      y += 5
    })
  }

  // ── PROJECTS ─────────────────────────────────────────────
  if (cv.projects?.length) {
    sectionLine("Projects")
    cv.projects.forEach((proj) => {
      checkPage(10)
      doc.setFontSize(9.5)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...ink)
      doc.text(proj.name, MARGIN, y)
      y += 4.5
      wrappedText(proj.outcome, 9, "normal")
      if (proj.stack?.length) {
        doc.setFontSize(8)
        doc.setTextColor(...muted)
        doc.text(proj.stack.join(" · "), MARGIN, y)
        y += 5
      }
    })
  }

  // ATS score watermark in footer
  doc.setFontSize(7)
  doc.setTextColor(200, 200, 195)
  doc.text(`ATS match score: ${cv.meta.ats_score_estimate}%  ·  Generated by Jobr`, MARGIN, 287)

  const pdfOutput = doc.output("datauristring")
  const base64 = pdfOutput.split(",")[1]
  const blob = doc.output("blob")

  return { base64, blob }
}
