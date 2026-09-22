export interface AcademicComponent {
  name: string;
  marks: number;
}

export interface FactorStatus {
  index: number;
  name: string;
  status: 'Independent' | 'Dependent';
  vector: number[];
  explanation: string;
  linear_combination?: string | null;
  coefficients?: Record<string, number> | null;
}

export interface ProjectionComponentDetail {
  onto_basis_index: number;
  onto_basis_name: string;
  proj_vector: number[];
  dot_prod_vu: number;
  dot_prod_uu: number;
  scalar_factor: number;
}

export interface GramSchmidtStep {
  step_index: number;
  component_name: string;
  original_vector: number[];
  projection_components: ProjectionComponentDetail[];
  orthogonal_vector: number[];
  norm: number;
  normalized_vector: number[];
  formula_latex: string;
}

export interface MathConceptExplanation {
  concept: string;
  formula: string;
  input_description: string;
  calculation: string;
  result: string;
  interpretation: string;
}

export interface AnalysisResponse {
  id?: number;
  created_at?: string;
  student_name: string;
  components: AcademicComponent[];
  dimension_names: string[];
  matrix: number[][];
  matrix_rows: number;
  matrix_cols: number;
  rank: number;
  max_possible_rank: number;
  rank_utilization: number;
  is_full_rank: boolean;
  independent_factors: FactorStatus[];
  dependent_factors: FactorStatus[];
  basis: number[][];
  basis_names: string[];
  basis_dimension: number;
  gram_schmidt_steps: GramSchmidtStep[];
  orthogonal_basis: number[][];
  normalized_basis: number[][];
  orthogonality_matrix: number[][];
  orthogonality_verified: boolean;
  performance_vector: number[];
  projection: number[];
  projection_coefficients: number[];
  residual: number[];
  projection_error: number;
  percentage_representation: number;
  interpretation: string;
  explanations: Record<string, MathConceptExplanation>;
}

export interface HistoryItem {
  id: number;
  created_at: string;
  student_name: string;
  components_count: number;
  matrix_rank: number;
  independent_count: number;
  dependent_count: number;
  projection_error: number;
  components_summary: string[];
}
