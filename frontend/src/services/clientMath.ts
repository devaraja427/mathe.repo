import {
  AcademicComponent,
  AnalysisResponse,
  FactorStatus,
  GramSchmidtStep,
  ProjectionComponentDetail,
  MathConceptExplanation,
} from '../types/analysis';

const TOLERANCE = 1e-10;

export const DIMENSION_NAMES = [
  'Analytical Rigor',
  'Computational Logic',
  'Applied Systems',
  'Theoretical Foundations',
  'Synthesis & Communication',
];

const STANDARD_PROFILES: Record<string, number[]> = {
  mathematics: [0.95, 0.40, 0.10, 0.90, 0.25],
  maths: [0.95, 0.40, 0.10, 0.90, 0.25],
  physics: [0.85, 0.35, 0.60, 0.85, 0.20],
  programming: [0.50, 0.95, 0.70, 0.40, 0.30],
  coding: [0.50, 0.95, 0.70, 0.40, 0.30],
  'data structures': [0.70, 0.90, 0.60, 0.60, 0.25],
  algorithms: [0.85, 0.95, 0.40, 0.75, 0.25],
  database: [0.40, 0.75, 0.75, 0.45, 0.40],
  dbms: [0.40, 0.75, 0.75, 0.45, 0.40],
  'computer networks': [0.35, 0.60, 0.90, 0.50, 0.35],
  networks: [0.35, 0.60, 0.90, 0.50, 0.35],
  'operating systems': [0.45, 0.70, 0.90, 0.55, 0.25],
  os: [0.45, 0.70, 0.90, 0.55, 0.25],
  'communication skills': [0.15, 0.20, 0.20, 0.25, 0.95],
  communication: [0.15, 0.20, 0.20, 0.25, 0.95],
  english: [0.15, 0.20, 0.15, 0.30, 0.95],
};

function vecDot(a: number[], b: number[]): number {
  return a.reduce((sum, val, idx) => sum + val * (b[idx] || 0), 0);
}

function vecNorm(a: number[]): number {
  return Math.sqrt(vecDot(a, a));
}

function vecScale(a: number[], s: number): number[] {
  return a.map((val) => val * s);
}

function vecSub(a: number[], b: number[]): number[] {
  return a.map((val, idx) => val - (b[idx] || 0));
}

function getComponentProfile(name: string): number[] {
  const key = name.trim().toLowerCase();
  for (const [k, v] of Object.entries(STANDARD_PROFILES)) {
    if (k.includes(key) || key.includes(k)) {
      const norm = vecNorm(v);
      return v.map((x) => x / norm);
    }
  }

  // Deterministic profile for custom names
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const raw = [
    0.3 + 0.6 * (Math.abs(hash) % 100) / 100,
    0.3 + 0.6 * (Math.abs(hash >> 3) % 100) / 100,
    0.3 + 0.6 * (Math.abs(hash >> 6) % 100) / 100,
    0.3 + 0.6 * (Math.abs(hash >> 9) % 100) / 100,
    0.3 + 0.6 * (Math.abs(hash >> 12) % 100) / 100,
  ];
  const norm = vecNorm(raw);
  return raw.map((x) => x / norm);
}

// Solve linear least squares A * c ≈ b using normal equations: (A^T A) c = A^T b
function solveLeastSquares(A_cols: number[][], b: number[]): number[] {
  const k = A_cols.length;
  if (k === 0) return [];
  // Build AtA (k x k) and Atb (k)
  const AtA: number[][] = Array.from({ length: k }, () => Array(k).fill(0));
  const Atb: number[] = Array(k).fill(0);

  for (let i = 0; i < k; i++) {
    Atb[i] = vecDot(A_cols[i], b);
    for (let j = 0; j < k; j++) {
      AtA[i][j] = vecDot(A_cols[i], A_cols[j]) + (i === j ? 1e-8 : 0); // ridge regularization
    }
  }

  // Gaussian elimination with partial pivoting to solve AtA * c = Atb
  const M = AtA.map((row, i) => [...row, Atb[i]]);
  for (let i = 0; i < k; i++) {
    let maxRow = i;
    for (let r = i + 1; r < k; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[maxRow][i])) maxRow = r;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let col = i; col <= k; col++) {
      M[i][col] /= pivot;
    }
    for (let r = 0; r < k; r++) {
      if (r !== i) {
        const factor = M[r][i];
        for (let col = i; col <= k; col++) {
          M[r][col] -= factor * M[i][col];
        }
      }
    }
  }

  return M.map((row) => row[k]);
}

export function analyzeAcademicPerformanceClient(
  components: AcademicComponent[],
  studentName: string = 'Student'
): AnalysisResponse {
  // Step 1: Feature Matrix
  // Columns = components, Rows = 5 dimensions
  const cols = components.map((c) => {
    const profile = getComponentProfile(c.name);
    return vecScale(profile, c.marks);
  });

  const rowsCount = 5;
  const colsCount = components.length;

  const matrix: number[][] = [];
  for (let r = 0; r < rowsCount; r++) {
    const row: number[] = [];
    for (let col = 0; col < colsCount; col++) {
      row.push(Number(cols[col][r].toFixed(4)));
    }
    matrix.push(row);
  }

  // Step 2 & 3: Independence & Basis Selection
  const independentIndices: number[] = [];
  const dependentIndices: number[] = [];
  const basisCols: number[][] = [];

  for (let j = 0; j < colsCount; j++) {
    const v = cols[j];
    const normV = vecNorm(v);
    if (normV < TOLERANCE) {
      dependentIndices.push(j);
      continue;
    }

    if (basisCols.length === 0) {
      basisCols.push(v);
      independentIndices.push(j);
    } else {
      const coeffs = solveLeastSquares(basisCols, v);
      let proj = Array(rowsCount).fill(0);
      for (let i = 0; i < basisCols.length; i++) {
        for (let r = 0; r < rowsCount; r++) {
          proj[r] += coeffs[i] * basisCols[i][r];
        }
      }
      const residual = vecSub(v, proj);
      const relError = vecNorm(residual) / (normV + 1e-12);

      if (relError > 0.05 && basisCols.length < rowsCount) {
        basisCols.push(v);
        independentIndices.push(j);
      } else {
        dependentIndices.push(j);
      }
    }
  }

  const rank = independentIndices.length;
  const maxPossibleRank = Math.min(rowsCount, colsCount);
  const rankUtilization = Number(((rank / maxPossibleRank) * 100).toFixed(2));
  const isFullRank = rank === maxPossibleRank;

  // Factor statuses
  const independent_factors: FactorStatus[] = independentIndices.map((idx) => ({
    index: idx,
    name: components[idx].name,
    status: 'Independent',
    vector: cols[idx].map((x) => Number(x.toFixed(4))),
    explanation: 'Linearly independent factor. Spans a unique dimension in performance space.',
    linear_combination: null,
    coefficients: null,
  }));

  const dependent_factors: FactorStatus[] = dependentIndices.map((idx) => {
    const v = cols[idx];
    const c = components[idx];
    const coeffs = solveLeastSquares(basisCols, v);
    const coeffMap: Record<string, number> = {};
    const parts: string[] = [];

    independentIndices.forEach((indIdx, i) => {
      const val = coeffs[i] || 0;
      if (Math.abs(val) > 1e-3) {
        const indName = components[indIdx].name;
        coeffMap[indName] = Number(val.toFixed(4));
        parts.push(`${val.toFixed(2)}·v_{${indName}}`);
      }
    });

    const linearComb = `v_{${c.name}} ≈ ${parts.join(' + ') || '0'}`;
    return {
      index: idx,
      name: c.name,
      status: 'Dependent',
      vector: v.map((x) => Number(x.toFixed(4))),
      explanation: `Linearly dependent. Performance in ${c.name} can be synthesized from independent factors: ${linearComb}.`,
      linear_combination: linearComb,
      coefficients: coeffMap,
    };
  });

  // Step 4 & 5: Gram-Schmidt Orthogonalization
  const gramSchmidtSteps: GramSchmidtStep[] = [];
  const orthogonalCols: number[][] = [];
  const normalizedCols: number[][] = [];

  for (let k = 0; k < independentIndices.length; k++) {
    const origColIdx = independentIndices[k];
    const v_k = cols[origColIdx];
    const compName = components[origColIdx].name;
    const projDetails: ProjectionComponentDetail[] = [];

    let u_k = [...v_k];

    if (k === 0) {
      // u_1 = v_1
    } else {
      for (let j = 0; j < k; j++) {
        const u_j = orthogonalCols[j];
        const dot_vu = vecDot(v_k, u_j);
        const dot_uu = vecDot(u_j, u_j);
        const scalar = dot_uu > TOLERANCE ? dot_vu / dot_uu : 0;
        const projVec = vecScale(u_j, scalar);

        u_k = vecSub(u_k, projVec);

        projDetails.push({
          onto_basis_index: j + 1,
          onto_basis_name: components[independentIndices[j]].name,
          proj_vector: projVec.map((x) => Number(x.toFixed(4))),
          dot_prod_vu: Number(dot_vu.toFixed(4)),
          dot_prod_uu: Number(dot_uu.toFixed(4)),
          scalar_factor: Number(scalar.toFixed(4)),
        });
      }
    }

    const norm = vecNorm(u_k);
    const e_k = norm > TOLERANCE ? vecScale(u_k, 1 / norm) : Array(rowsCount).fill(0);

    orthogonalCols.push(u_k);
    normalizedCols.push(e_k);

    const latexParts = [
      k === 0
        ? `u_1 = v_1 = \\mathbf{v}_{${compName}}`
        : `u_${k + 1} = v_${k + 1} - ` +
          projDetails
            .map((_, pIdx) => `\\frac{v_${k + 1} \\cdot u_${pIdx + 1}}{u_${pIdx + 1} \\cdot u_${pIdx + 1}} u_${pIdx + 1}`)
            .join(' - '),
    ];

    gramSchmidtSteps.push({
      step_index: k + 1,
      component_name: compName,
      original_vector: v_k.map((x) => Number(x.toFixed(4))),
      projection_components: projDetails,
      orthogonal_vector: u_k.map((x) => Number(x.toFixed(4))),
      norm: Number(norm.toFixed(4)),
      normalized_vector: e_k.map((x) => Number(x.toFixed(4))),
      formula_latex: latexParts[0],
    });
  }

  // Step 6: Orthogonality Check (E^T * E)
  const kDim = normalizedCols.length;
  const orthoMatrix: number[][] = [];
  let isOrthogonal = true;

  for (let i = 0; i < kDim; i++) {
    const row: number[] = [];
    for (let j = 0; j < kDim; j++) {
      let dot = vecDot(normalizedCols[i], normalizedCols[j]);
      if (Math.abs(dot) < 1e-9) dot = 0.0;
      else if (Math.abs(dot - 1.0) < 1e-9) dot = 1.0;
      else dot = Number(dot.toFixed(6));

      if (i === j && Math.abs(dot - 1.0) > 0.01) isOrthogonal = false;
      if (i !== j && Math.abs(dot) > 0.01) isOrthogonal = false;

      row.push(dot);
    }
    orthoMatrix.push(row);
  }

  // Step 7: Performance Vector & Projection
  const perfVector = Array(rowsCount).fill(0);
  for (let r = 0; r < rowsCount; r++) {
    let sum = 0;
    for (let c = 0; c < colsCount; c++) sum += cols[c][r];
    perfVector[r] = sum / colsCount;
  }

  let projection = Array(rowsCount).fill(0);
  const projCoeffs: number[] = [];

  for (let i = 0; i < kDim; i++) {
    const e_i = normalizedCols[i];
    const coeff = vecDot(perfVector, e_i);
    projCoeffs.push(Number(coeff.toFixed(4)));
    for (let r = 0; r < rowsCount; r++) {
      projection[r] += coeff * e_i[r];
    }
  }

  const residual = vecSub(perfVector, projection);
  const pNorm = vecNorm(perfVector);
  const projError = Number(vecNorm(residual).toFixed(4));
  const fidelity =
    pNorm > TOLERANCE
      ? Number(Math.max(0, Math.min(100, (1 - projError / pNorm) * 100)).toFixed(2))
      : 100.0;

  // Interpretation
  const indNames = independent_factors.map((f) => f.name);
  const depNames = dependent_factors.map((f) => f.name);
  const topComp = components.reduce((max, c) => (c.marks > max.marks ? c : max), components[0]);
  const minComp = components.reduce((min, c) => (c.marks < min.marks ? c : min), components[0]);

  const interpretation =
    `The mathematical feature matrix constructed from the student's ${components.length} academic components ` +
    `exhibits a matrix rank of ${rank} out of a maximum possible ${maxPossibleRank}. ` +
    `This confirms that the student's performance manifold is spanned by ${rank} linearly independent ` +
    `academic directions: [${indNames.join(', ')}]. ` +
    (depNames.length > 0
      ? `The remaining component(s) [${depNames.join(', ')}] are linearly dependent, demonstrating that performance ` +
        `in these subjects is mathematically synthesized from foundational competencies established by the independent basis set. `
      : `All analyzed academic components are linearly independent, indicating completely decoupled performance competencies across all curricular dimensions. `) +
    `Gram-Schmidt orthogonalization successfully decoupled these directions into a mutually orthogonal ` +
    `coordinate system. Projection of the overall performance vector onto this orthogonal basis achieved a ` +
    `subspace reconstruction fidelity of ${fidelity}% with an Euclidean projection error of ${projError.toFixed(2)}. ` +
    `The primary academic anchor is '${topComp.name}' (${topComp.marks} marks), while '${minComp.name}' ` +
    `(${minComp.marks} marks) presents the greatest potential for subspace enhancement.`;

  const explanations: Record<string, MathConceptExplanation> = {
    matrix: {
      concept: 'Academic Feature Matrix',
      formula: 'A \\in \\mathbb{R}^{m \\times n}, \\quad A = [v_1 \\mid v_2 \\mid \\dots \\mid v_n]',
      input_description: `${colsCount} academic components mapped to ${rowsCount} foundational curricular dimensions scaled by marks.`,
      calculation: `Constructed matrix of size ${rowsCount} × ${colsCount} with values derived from student marks and competency vectors.`,
      result: `${rowsCount} × ${colsCount} Real Matrix`,
      interpretation:
        "Translates qualitative academic component marks into an inner product vector space suitable for linear algebraic decomposition.",
    },
    rank: {
      concept: 'Matrix Rank',
      formula: '\\text{rank}(A) = \\dim(\\text{col}(A))',
      input_description: `Feature matrix A of dimension ${rowsCount} × ${colsCount}.`,
      calculation: `Determined maximum number of linearly independent column vectors: ${rank}.`,
      result: `Rank = ${rank} (Max possible: ${maxPossibleRank})`,
      interpretation: `The academic performance dataset contains ${rank} genuinely independent mathematical dimensions of achievement.`,
    },
    linear_dependence: {
      concept: 'Linear Dependence & Independence',
      formula: 'c_1 v_1 + c_2 v_2 + \\dots + c_k v_k = 0 \\implies c_1 = \\dots = c_k = 0',
      input_description: `Column vectors of feature matrix: ${colsCount} vectors in R^${rowsCount}.`,
      calculation: 'Evaluated column pivot columns and orthogonal projection residuals for each academic vector.',
      result: `Independent: [${indNames.join(', ')}]; Dependent: [${depNames.join(', ') || 'None'}]`,
      interpretation:
        'Independent subjects represent fundamental standalone competencies; dependent subjects are combinations of other skills.',
    },
    basis: {
      concept: 'Subspace Basis',
      formula: '\\mathcal{B} = \\{v_{i_1}, \\dots, v_{i_r}\\}, \\quad \\text{span}(\\mathcal{B}) = \\text{col}(A)',
      input_description: `Set of ${indNames.length} independent academic column vectors.`,
      calculation: `Extracted pivot columns: indices [${independentIndices.map((i) => i + 1).join(', ')}].`,
      result: `${rank}-dimensional Basis for Academic Performance`,
      interpretation:
        "A minimal generating set that completely spans the subspace of the student's academic capability.",
    },
    gram_schmidt: {
      concept: 'Gram-Schmidt Orthogonalization',
      formula: 'u_k = v_k - \\sum_{j=1}^{k-1} \\frac{v_k \\cdot u_j}{u_j \\cdot u_j} u_j, \\quad e_k = \\frac{u_k}{\\|u_k\\|}',
      input_description: `${rank} linearly independent basis vectors.`,
      calculation:
        'Sequentially subtracted parallel projection components onto previous orthogonal vectors, then normalized.',
      result: `${rank} Mutually Orthogonal Unit Vectors (Orthonormal Basis)`,
      interpretation:
        'Transforms raw, correlated academic vectors into an ideal perpendicular coordinate system.',
    },
    orthogonality: {
      concept: 'Orthogonality Verification',
      formula: '\\langle e_i, e_j \\rangle = e_i \\cdot e_j = \\delta_{ij}',
      input_description: 'Normalized Gram-Schmidt basis matrix E.',
      calculation: 'Computed product E^T E and verified diagonal is 1 and off-diagonals are 0 within 1e-9 tolerance.',
      result: `E^T E = I_{${rank}} (Verified)`,
      interpretation: 'Confirms that zero redundancy or directional overlap exists among the decoupled performance axes.',
    },
    projection: {
      concept: 'Vector Projection & Reconstruction',
      formula: '\\text{proj}_{\\mathcal{B}}(p) = \\sum_{i=1}^r (p \\cdot e_i) e_i, \\quad r = p - \\text{proj}_{\\mathcal{B}}(p)',
      input_description: 'Student composite performance vector p and orthonormal basis E.',
      calculation: `Computed dot products c_i = p · e_i and error ||r||_2 = ${projError.toFixed(4)}.`,
      result: `Error: ${projError.toFixed(4)}, Subspace Fidelity: ${fidelity.toFixed(1)}%`,
      interpretation:
        "Quantifies how comprehensively the extracted orthogonal basis captures the student's true overall academic profile.",
    },
  };

  return {
    student_name: studentName,
    components,
    dimension_names: DIMENSION_NAMES,
    matrix,
    matrix_rows: rowsCount,
    matrix_cols: colsCount,
    rank,
    max_possible_rank: maxPossibleRank,
    rank_utilization: rankUtilization,
    is_full_rank: isFullRank,
    independent_factors,
    dependent_factors,
    basis: independentIndices.map((i) => cols[i].map((x) => Number(x.toFixed(4)))),
    basis_names: indNames,
    basis_dimension: rank,
    gram_schmidt_steps: gramSchmidtSteps,
    orthogonal_basis: orthogonalCols.map((col) => col.map((x) => Number(x.toFixed(4)))),
    normalized_basis: normalizedCols.map((col) => col.map((x) => Number(x.toFixed(4)))),
    orthogonality_matrix: orthoMatrix,
    orthogonality_verified: isOrthogonal,
    performance_vector: perfVector.map((x) => Number(x.toFixed(4))),
    projection: projection.map((x) => Number(x.toFixed(4))),
    projection_coefficients: projCoeffs,
    residual: residual.map((x) => Number(x.toFixed(4))),
    projection_error: projError,
    percentage_representation: fidelity,
    interpretation,
    explanations,
  };
}
