from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class AcademicComponent(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name of the academic subject/component")
    marks: float = Field(..., ge=0.0, le=100.0, description="Marks scored between 0 and 100")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Component name cannot be empty or whitespace only")
        return s


class AnalysisRequest(BaseModel):
    student_name: Optional[str] = Field("Student", max_length=100)
    components: List[AcademicComponent] = Field(..., min_length=5, max_length=8)

    @field_validator("components")
    @classmethod
    def validate_unique_names(cls, components: List[AcademicComponent]) -> List[AcademicComponent]:
        names = [c.name.lower() for c in components]
        if len(names) != len(set(names)):
            raise ValueError("Component names must be unique")
        return components


class FactorStatus(BaseModel):
    index: int
    name: str
    status: str  # "Independent" or "Dependent"
    vector: List[float]
    explanation: str
    linear_combination: Optional[str] = None
    coefficients: Optional[Dict[str, float]] = None


class ProjectionComponentDetail(BaseModel):
    onto_basis_index: int
    onto_basis_name: str
    proj_vector: List[float]
    dot_prod_vu: float
    dot_prod_uu: float
    scalar_factor: float


class GramSchmidtStep(BaseModel):
    step_index: int
    component_name: str
    original_vector: List[float]
    projection_components: List[ProjectionComponentDetail]
    orthogonal_vector: List[float]
    norm: float
    normalized_vector: List[float]
    formula_latex: str


class MathConceptExplanation(BaseModel):
    concept: str
    formula: str
    input_description: str
    calculation: str
    result: str
    interpretation: str


class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    created_at: Optional[str] = None
    student_name: str
    components: List[AcademicComponent]
    dimension_names: List[str]
    matrix: List[List[float]]
    matrix_rows: int
    matrix_cols: int
    rank: int
    max_possible_rank: int
    rank_utilization: float
    is_full_rank: bool
    independent_factors: List[FactorStatus]
    dependent_factors: List[FactorStatus]
    basis: List[List[float]]
    basis_names: List[str]
    basis_dimension: int
    gram_schmidt_steps: List[GramSchmidtStep]
    orthogonal_basis: List[List[float]]
    normalized_basis: List[List[float]]
    orthogonality_matrix: List[List[float]]
    orthogonality_verified: bool
    performance_vector: List[float]
    projection: List[float]
    projection_coefficients: List[float]
    residual: List[float]
    projection_error: float
    percentage_representation: float
    interpretation: str
    explanations: Dict[str, MathConceptExplanation]


class HistoryItem(BaseModel):
    id: int
    created_at: str
    student_name: str
    components_count: int
    matrix_rank: int
    independent_count: int
    dependent_count: int
    projection_error: float
    components_summary: List[str]


class HistoryDetailResponse(BaseModel):
    id: int
    created_at: str
    student_name: str
    components: List[AcademicComponent]
    analysis_result: Dict[str, Any]
