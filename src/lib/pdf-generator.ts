import { jsPDF } from "jspdf";

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  const margin = 20;
  const contentWidth = 170;
  let cursorY = 20;

  // 1. Header: Contact Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("NITISH WARDHAN", margin, cursorY);
  cursorY += 8;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bengaluru, India | +91-9436781545 | nitish.wardhan987@gmail.com", margin, cursorY);
  cursorY += 10;

  // 2. Executive Summary
  doc.setFont("helvetica", "bold");
  doc.text("EXECUTIVE SUMMARY", margin, cursorY);
  cursorY += 5;
  doc.setFont("helvetica", "normal");
  const splitSummary = doc.splitTextToSize(data.summary, contentWidth);
  doc.text(splitSummary, margin, cursorY);
  cursorY += (splitSummary.length * 5) + 10;

  // 3. Professional Experience
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PROFESSIONAL EXPERIENCE", margin, cursorY);
  cursorY += 7;

  data.experience.forEach((job: any) => {
    // Avoid page overflow
    if (cursorY > 260) { doc.addPage(); cursorY = 20; }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${job.company}`, margin, cursorY);
    doc.setFont("helvetica", "italic");
    doc.text(`${job.role}`, margin + 60, cursorY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(job.duration || "", 190, cursorY, { align: "right" });
    cursorY += 6;

    job.bullets.forEach((bullet: string) => {
      const splitBullet = doc.splitTextToSize(`• ${bullet}`, contentWidth - 5);
      doc.text(splitBullet, margin + 5, cursorY);
      cursorY += (splitBullet.length * 5) + 2;
    });
    cursorY += 4;
  });

  // 4. Technical Skills
  if (cursorY > 270) { doc.addPage(); cursorY = 20; }
  cursorY += 5;
  doc.setFont("helvetica", "bold");
  doc.text("TECHNICAL SKILLS & COMPETENCIES", margin, cursorY);
  cursorY += 6;
  doc.setFont("helvetica", "normal");
  const skillsText = data.skills.join(" | ");
  const splitSkills = doc.splitTextToSize(skillsText, contentWidth);
  doc.text(splitSkills, margin, cursorY);

  doc.save(`Nitish_Wardhan_Complete_CV.pdf`);
};