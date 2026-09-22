import jsPDF from 'jspdf';
import { AnalysisResponse } from '../types/analysis';

export function exportAnalysisPDF(analysis: AnalysisResponse) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(30, 58, 138); // Academic navy
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Academic Performance Report', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Linear Algebra & Vector Calculus Report', 14, 18);
  doc.text(`Generated: ${new Date().toLocaleString()} | ID: #${analysis.id || 'DEMO'}`, 14, 23);

  y = 35;

  // Student Profile Card
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'F');

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Student: ${analysis.student_name || 'Academic Scholar'}`, 20, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Components: ${analysis.components.length} | Rank: ${analysis.rank}/${analysis.max_possible_rank} | Subspace Fidelity: ${analysis.percentage_representation}%`,
    20,
    y + 13
  );

  y += 24;

  // Section: Input Data Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('1. Academic Input Data', 14, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Component Name', 16, y);
  doc.text('Marks', 80, y);
  doc.text('Classification', 115, y);
  doc.text('Mathematical Significance', 150, y);
  y += 4;
  doc.line(14, y, pageWidth - 14, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);

  const indNames = new Set(analysis.independent_factors.map((f) => f.name));

  analysis.components.forEach((c) => {
    const isInd = indNames.has(c.name);
    doc.text(c.name, 16, y);
    doc.text(`${c.marks}`, 80, y);
    doc.setTextColor(isInd ? 22 : 180, isInd ? 101 : 83, isInd ? 52 : 9);
    doc.text(isInd ? 'Independent' : 'Dependent', 115, y);
    doc.setTextColor(31, 41, 55);
    doc.text(isInd ? 'Spans performance basis' : 'Synthesized factor', 150, y);
    y += 5;
  });

  y += 6;

  // Section: Feature Matrix & Rank
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('2. Feature Matrix & Rank Calculation', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  doc.text(
    `Constructed Feature Matrix A of size ${analysis.matrix_rows} × ${analysis.matrix_cols} across 5 foundational dimensions.`,
    14,
    y
  );
  y += 5;
  doc.text(
    `Calculated Rank r = ${analysis.rank} via Singular Value Decomposition (Rank Utilization: ${analysis.rank_utilization}%).`,
    14,
    y
  );
  y += 8;

  // Section: Linear Dependence Analysis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('3. Linear Dependence & Basis Extraction', 14, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);
  doc.text(
    `Extracted Basis Dimension: ${analysis.basis_dimension} | Independent Factors: [${analysis.basis_names.join(', ')}]`,
    14,
    y
  );
  y += 5;

  if (analysis.dependent_factors.length > 0) {
    doc.text('Synthesized Dependent Factors:', 14, y);
    y += 4;
    analysis.dependent_factors.forEach((df) => {
      doc.text(`• ${df.name}: ${df.linear_combination || 'Approximate combination'}`, 18, y);
      y += 4.5;
    });
  } else {
    doc.text('All academic factors are linearly independent.', 14, y);
    y += 5;
  }

  y += 6;

  // Section: Gram-Schmidt Orthogonalization
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('4. Gram-Schmidt Orthogonalization & Orthogonality Check', 14, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);

  analysis.gram_schmidt_steps.forEach((step) => {
    doc.text(
      `Step ${step.step_index} (${step.component_name}): ||u_${step.step_index}|| = ${step.norm.toFixed(3)} | e_${step.step_index} unit vector computed.`,
      14,
      y
    );
    y += 4.5;
  });

  y += 2;
  doc.text(
    `Orthogonality Verification Matrix E^T E ≈ I_${analysis.basis_dimension}: Status = ${analysis.orthogonality_verified ? 'VERIFIED (Strictly Orthogonal)' : 'Approximate'}`,
    14,
    y
  );
  y += 8;

  // Check page overflow
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Section: Vector Projection & Error
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('5. Vector Projection & Subspace Representation', 14, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);
  doc.text(`Performance Vector Projection: proj_B(p) = Σ (p · e_i) e_i`, 14, y);
  y += 5;
  doc.text(
    `Euclidean Projection Error ||r||_2 = ${analysis.projection_error.toFixed(4)} | Subspace Fidelity = ${analysis.percentage_representation}%`,
    14,
    y
  );
  y += 8;

  // Section: Academic Interpretation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text('6. Comprehensive Academic Interpretation', 14, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  const splitInterp = doc.splitTextToSize(analysis.interpretation, pageWidth - 28);
  doc.text(splitInterp, 14, y);
  y += splitInterp.length * 4.5 + 8;

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'Academic Disclaimer: This analysis reflects purely mathematical linear algebra relationships within the submitted marks. No psycho-evaluative assumptions are made.',
    14,
    pageWidth > 200 ? 285 : 280
  );

  // Save the PDF
  const filename = `Academic_Dependency_Analysis_${analysis.student_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function exportAnalysisJSON(analysis: AnalysisResponse) {
  const jsonStr = JSON.stringify(analysis, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `academic_analysis_${analysis.student_name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
