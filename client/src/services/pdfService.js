import { jsPDF } from 'jspdf';

/**
 * Generates and triggers download of a Play2Protect Anti-Doping Awareness Certificate
 * @param {Object} data
 * @param {string} data.userName
 * @param {string} data.certificateId
 * @param {string} data.date
 */
export function generateCertificatePDF({ userName, certificateId, date }) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background warm ivory/cream
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border in Navy (#0f2942)
  doc.setDrawColor(15, 41, 66);
  doc.setLineWidth(3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Inner Thin Accent Border in Turf Green (#15803d)
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(0.8);
  doc.rect(16, 16, pageWidth - 32, pageHeight - 32);

  // Corner sports accents
  const corners = [
    [16, 16],
    [pageWidth - 16, 16],
    [16, pageHeight - 16],
    [pageWidth - 16, pageHeight - 16]
  ];
  doc.setFillColor(15, 41, 66);
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 2.5, 'F');
  });

  // Header: Organization Title
  doc.setTextColor(15, 41, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('PLAY2PROTECT', pageWidth / 2, 36, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('SPORTS INTEGRITY & ANTI-DOPING EDUCATION INITIATIVE', pageWidth / 2, 43, { align: 'center' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(60, 48, pageWidth - 60, 48);

  // Certificate Title
  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ANTI-DOPING AWARENESS CERTIFICATE', pageWidth / 2, 62, { align: 'center' });

  // Body Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to certify that', pageWidth / 2, 75, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 41, 66);
  doc.text(userName || 'Valued Athlete', pageWidth / 2, 90, { align: 'center' });

  // Recipient underline
  const nameWidth = doc.getTextWidth(userName || 'Valued Athlete');
  doc.setDrawColor(15, 41, 66);
  doc.setLineWidth(1);
  doc.line((pageWidth / 2) - (nameWidth / 2) - 10, 94, (pageWidth / 2) + (nameWidth / 2) + 10, 94);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  const desc = 'has successfully completed the foundational curriculum in Clean Sport Ethics, Strict Liability,';
  const desc2 = 'the WADA Prohibited List, Therapeutic Use Exemptions (TUEs), and Supplement Risk Verification.';
  doc.text(desc, pageWidth / 2, 105, { align: 'center' });
  doc.text(desc2, pageWidth / 2, 112, { align: 'center' });

  // Core Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(21, 128, 61);
  doc.text('Learn • Play • Protect', pageWidth / 2, 124, { align: 'center' });

  // Bottom Section: Signatures & Details
  const bottomY = 152;

  // Left side: Date & ID
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issue Date: ${date || new Date().toLocaleDateString()}`, 35, bottomY);
  doc.text(`Certificate ID: ${certificateId || 'P2P-CERT-2026-001'}`, 35, bottomY + 6);
  doc.text('Verification: play2protect.edu/verify', 35, bottomY + 12);

  // Right side: Program Director Sign
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 41, 66);
  doc.text('Dr. A. Sharma', pageWidth - 75, bottomY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Director of Sports Education', pageWidth - 75, bottomY + 5);
  doc.text('Play2Protect Academic Committee', pageWidth - 75, bottomY + 10);

  // Signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 85, bottomY - 3, pageWidth - 35, bottomY - 3);

  // Save the document
  const safeFilename = `Play2Protect-Certificate-${(userName || 'Athlete').replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename);
}
