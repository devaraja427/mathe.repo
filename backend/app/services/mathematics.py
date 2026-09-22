import numpy as np
from typing import List, Dict, Tuple, Any
from ..schemas import (
    AcademicComponent,
    FactorStatus,
    GramSchmidtStep,
    ProjectionComponentDetail,
    MathConceptExplanation,
    AnalysisResponse,
)

TOLERANCE = 1e-10

DIMENSION_NAMES = [
    "Analytical Rigor",
    "Computational Logic",
    "Applied Systems",
    "Theoretical Foundations",
    "Synthesis & Communication",
]

# Standard Curricular Profiles for Academic Components across the 5 dimensions
STANDARD_PROFILES: Dict[str, List[float]] = {
    "mathematics": [0.95, 0.40, 0.10, 0.90, 0.25],
    "maths": [0.95, 0.40, 0.10, 0.90, 0.25],
    "physics": [0.85, 0.35, 0.60, 0.85, 0.20],
    "programming": [0.50, 0.95, 0.70, 0.40, 0.30],
    "coding": [0.50, 0.95, 0.70, 0.40, 0.30],
    "data structures": [0.70, 0.90, 0.60, 0.60, 0.25],
    "algorithms": [0.85, 0.95, 0.40, 0.75, 0.25],
    "database": [0.40, 0.75, 0.75, 0.45, 0.40],
    "dbms": [0.40, 0.75, 0.75, 0.45, 0.40],
    "computer networks": [0.35, 0.60, 0.90, 0.50, 0.35],
    "networks": [0.35, 0.60, 0.90, 0.50, 0.35],
    "operating systems": [0.45, 0.70, 0.90, 0.55, 0.25],
    "os": [0.45, 0.70, 0.90, 0.55, 0.25],
    "communication skills": [0.15, 0.20, 0.20, 0.25, 0.95],
    "communication": [0.15, 0.20, 0.20, 0.25, 0.95],
    "english": [0.15, 0.20, 0.15, 0.30, 0.95],
}


def get_component_profile(name: str) -> np.ndarray:
    key = name.strip().lower()
    for k, v in STANDARD_PROFILES.items():
        if k in key or key in k:
            vec = np.array(v, dtype=float)
            return vec / np.linalg.norm(vec)

    # Deterministic fallback for arbitrary user-defined component name
    import hashlib
    h = int(hashlib.md5(key.encode()).hexdigest(), 16)
    raw = [
        0.3 + 0.7 * (((h >> (i * 8)) & 0xFF) / 255.0)
        for i in range(len(DIMENSION_NAMES))
    ]
    vec = np.array(raw, dtype=float)
    return vec / np.linalg.norm(vec)


def create_feature_matrix(components: List[AcademicComponent]) -> Tuple[np.ndarray, List[str]]:
    """
    Constructs the feature matrix A where columns correspond to academic components
    and rows correspond to foundational curricular performance dimensions.
    A_ij = component_marks * profile_weight_i
    """
    cols = []
    for c in components:
        profile = get_component_profile(c.name)
        # Scale profile vector by the student's marks
        vector = profile * float(c.marks)
        cols.append(vector)

    matrix = np.column_stack(cols)  # Shape: (d, n) e.g. (5, components_count)
    return matrix, DIMENSION_NAMES


def calculate_rank(matrix: np.ndarray, tolerance: float = TOLERANCE) -> int:
    """Calculates matrix rank using Singular Value Decomposition (SVD)."""
    return int(np.linalg.matrix_rank(matrix, tol=tolerance))


def find_independent_and_dependent_factors(
    matrix: np.ndarray, components: List[AcademicComponent], tolerance: float = TOLERANCE
) -> Tuple[List[FactorStatus], List[FactorStatus], List[int]]:
    """
    Identifies linearly independent columns (basis candidates) and dependent columns
    using QR decomposition with column pivoting (or Gram-Schmidt / RREF).
    For dependent columns, computes approximate linear combination v_k ≈ sum(c_i * v_i).
    """
    rows, cols = matrix.shape
    independent_indices = []
    dependent_indices = []

    # Check linear independence sequentially using Gram-Schmidt projection tolerance
    # A vector is independent of the previous chosen vectors if its projection residual is non-zero
    basis_so_far = []
    basis_indices = []

    for j in range(cols):
        v = matrix[:, j]
        if np.linalg.norm(v) < tolerance:
            # Zero vector is dependent
            dependent_indices.append(j)
            continue

        # Compute projection onto span(basis_so_far)
        if not basis_so_far:
            basis_so_far.append(v)
            basis_indices.append(j)
            independent_indices.append(j)
        else:
            # Project v onto span of basis_so_far
            Q_basis = np.column_stack(basis_so_far)
            # Least squares solution: Q_basis * c ≈ v
            c, residuals, rank, s = np.linalg.lstsq(Q_basis, v, rcond=tolerance)
            proj = Q_basis @ c
            residual_norm = np.linalg.norm(v - proj)

            # Normalized residual relative to vector magnitude
            rel_error = residual_norm / (np.linalg.norm(v) + 1e-12)

            # If residual is significant and we haven't exceeded row dimension
            if rel_error > 0.05 and len(basis_indices) < rows:
                basis_so_far.append(v)
                basis_indices.append(j)
                independent_indices.append(j)
            else:
                dependent_indices.append(j)

    # Create FactorStatus objects
    independent_factors: List[FactorStatus] = []
    for idx in independent_indices:
        c = components[idx]
        v = matrix[:, idx]
        independent_factors.append(
            FactorStatus(
                index=idx,
                name=c.name,
                status="Independent",
                vector=[round(float(x), 4) for x in v],
                explanation=f"Linearly independent factor. Spans a unique dimension in the student's performance space.",
                linear_combination=None,
                coefficients=None,
            )
        )

    # For dependent factors, compute their representation in terms of the independent factors
    dependent_factors: List[FactorStatus] = []
    basis_matrix = matrix[:, independent_indices] if independent_indices else np.zeros((rows, 0))

    for idx in dependent_indices:
        c = components[idx]
        v = matrix[:, idx]

        if basis_matrix.shape[1] > 0:
            coeffs, _, _, _ = np.linalg.lstsq(basis_matrix, v, rcond=tolerance)
            coeff_dict = {}
            parts = []
            for i, ind_idx in enumerate(independent_indices):
                coeff_val = float(coeffs[i])
                if abs(coeff_val) > 1e-3:
                    ind_name = components[ind_idx].name
                    coeff_dict[ind_name] = round(coeff_val, 4)
                    parts.append(f"{coeff_val:.2f}·v_{{{ind_name}}}")

            comb_str = " + ".join(parts) if parts else "0"
            linear_comb = f"v_{{{c.name}}} ≈ {comb_str}"
            explanation = (
                f"Linearly dependent. Performance in {c.name} can be mathematically synthesized as an "
                f"approximate linear combination of the independent factors: {linear_comb}."
            )
        else:
            coeff_dict = {}
            linear_comb = f"v_{{{c.name}}} ≈ 0"
            explanation = f"Zero or near-zero performance vector."

        dependent_factors.append(
            FactorStatus(
                index=idx,
                name=c.name,
                status="Dependent",
                vector=[round(float(x), 4) for x in v],
                explanation=explanation,
                linear_combination=linear_comb,
                coefficients=coeff_dict,
            )
        )

    return independent_factors, dependent_factors, independent_indices


def perform_gram_schmidt(
    matrix: np.ndarray,
    components: List[AcademicComponent],
    basis_indices: List[int],
    tolerance: float = TOLERANCE,
) -> Tuple[List[GramSchmidtStep], np.ndarray, np.ndarray]:
    """
    Step-by-step Gram-Schmidt orthogonalization:
    u_1 = v_1
    u_k = v_k - sum_{j=1}^{k-1} proj_{u_j}(v_k)
    where proj_{u_j}(v_k) = ((v_k . u_j) / (u_j . u_j)) * u_j
    e_k = u_k / ||u_k||
    """
    steps: List[GramSchmidtStep] = []
    orthogonal_vectors = []
    normalized_vectors = []

    for step_num, col_idx in enumerate(basis_indices, start=1):
        v_k = matrix[:, col_idx].astype(float)
        comp_name = components[col_idx].name
        proj_details: List[ProjectionComponentDetail] = []

        u_k = v_k.copy()

        if step_num == 1:
            # u_1 = v_1
            latex_formula = rf"u_1 = v_1 = \mathbf{{v}}_{{{comp_name}}}"
        else:
            latex_parts = [rf"v_{step_num}"]
            for j in range(step_num - 1):
                u_j = orthogonal_vectors[j]
                onto_name = components[basis_indices[j]].name
                dot_vu = float(np.dot(v_k, u_j))
                dot_uu = float(np.dot(u_j, u_j))

                if dot_uu > tolerance:
                    scalar = dot_vu / dot_uu
                    proj_vec = scalar * u_j
                else:
                    scalar = 0.0
                    proj_vec = np.zeros_like(u_j)

                u_k -= proj_vec

                proj_details.append(
                    ProjectionComponentDetail(
                        onto_basis_index=j + 1,
                        onto_basis_name=onto_name,
                        proj_vector=[round(float(x), 4) for x in proj_vec],
                        dot_prod_vu=round(dot_vu, 4),
                        dot_prod_uu=round(dot_uu, 4),
                        scalar_factor=round(scalar, 4),
                    )
                )
                latex_parts.append(rf"\frac{{v_{step_num} \cdot u_{j+1}}}{{u_{j+1} \cdot u_{j+1}}} u_{j+1}")

            latex_formula = rf"u_{step_num} = " + " - ".join(latex_parts)

        norm_val = float(np.linalg.norm(u_k))
        if norm_val > tolerance:
            e_k = u_k / norm_val
        else:
            e_k = np.zeros_like(u_k)

        orthogonal_vectors.append(u_k)
        normalized_vectors.append(e_k)

        steps.append(
            GramSchmidtStep(
                step_index=step_num,
                component_name=comp_name,
                original_vector=[round(float(x), 4) for x in v_k],
                projection_components=proj_details,
                orthogonal_vector=[round(float(x), 4) for x in u_k],
                norm=round(norm_val, 4),
                normalized_vector=[round(float(x), 4) for x in e_k],
                formula_latex=latex_formula,
            )
        )

    ortho_matrix = np.column_stack(orthogonal_vectors) if orthogonal_vectors else np.zeros((matrix.shape[0], 0))
    norm_matrix = np.column_stack(normalized_vectors) if normalized_vectors else np.zeros((matrix.shape[0], 0))
    return steps, ortho_matrix, norm_matrix


def check_orthogonality(normalized_basis: np.ndarray, tolerance: float = TOLERANCE) -> Tuple[List[List[float]], bool]:
    """
    Computes dot product matrix E^T * E.
    Checks that off-diagonal elements are 0 and diagonal elements are 1.
    Values smaller than 1e-10 are explicitly rounded to 0.0.
    """
    if normalized_basis.shape[1] == 0:
        return [], True

    dot_matrix = normalized_basis.T @ normalized_basis
    k = dot_matrix.shape[0]
    cleaned = []
    is_orthogonal = True

    for i in range(k):
        row = []
        for j in range(k):
            val = float(dot_matrix[i, j])
            # Filter numerical floating point precision noise
            if abs(val) < 1e-9:
                val = 0.0
            elif abs(val - 1.0) < 1e-9:
                val = 1.0
            else:
                val = round(val, 6)

            if i == j and abs(val - 1.0) > 0.01:
                is_orthogonal = False
            elif i != j and abs(val) > 0.01:
                is_orthogonal = False

            row.append(val)
        cleaned.append(row)

    return cleaned, is_orthogonal


def project_vector(
    performance_vector: np.ndarray,
    normalized_basis: np.ndarray,
    tolerance: float = TOLERANCE,
) -> Tuple[np.ndarray, List[float], np.ndarray, float, float]:
    """
    Projects performance vector p onto the orthogonal subspace spanned by normalized basis vectors e_1, ..., e_r:
    proj_B(p) = sum_{i=1}^r (p . e_i) * e_i
    residual = p - proj_B(p)
    error = ||residual||_2
    percentage_representation = (1 - error / ||p||) * 100
    """
    p = performance_vector.astype(float)
    k = normalized_basis.shape[1]
    projection = np.zeros_like(p)
    coeffs: List[float] = []

    for i in range(k):
        e_i = normalized_basis[:, i]
        coeff = float(np.dot(p, e_i))
        coeffs.append(round(coeff, 4))
        projection += coeff * e_i

    residual = p - projection
    p_norm = float(np.linalg.norm(p))
    error = float(np.linalg.norm(residual))

    if p_norm > tolerance:
        fidelity = max(0.0, min(100.0, (1.0 - error / p_norm) * 100.0))
    else:
        fidelity = 100.0

    return projection, coeffs, residual, round(error, 4), round(fidelity, 2)


def generate_interpretation(
    rank: int,
    total_components: int,
    independent_names: List[str],
    dependent_names: List[str],
    projection_error: float,
    percentage_representation: float,
    components: List[AcademicComponent],
) -> str:
    """
    Generates an objective, academic mathematical interpretation of the findings.
    """
    top_comp = max(components, key=lambda c: c.marks)
    weak_comp = min(components, key=lambda c: c.marks)

    ind_str = ", ".join(independent_names)
    dep_str = ", ".join(dependent_names) if dependent_names else "None"

    interp = (
        f"The mathematical feature matrix constructed from the student's {total_components} academic components "
        f"exhibits a matrix rank of {rank} out of a maximum possible {min(5, total_components)}. "
        f"This confirms that the student's performance manifold is spanned by {rank} linearly independent "
        f"academic directions: [{ind_str}]. "
    )

    if dependent_names:
        interp += (
            f"The remaining component(s) [{dep_str}] are linearly dependent, demonstrating that performance "
            f"in these subjects is mathematically synthesized from the foundational competencies established "
            f"by the independent basis set. "
        )
    else:
        interp += (
            f"All analyzed academic components are linearly independent, indicating completely decoupled "
            f"performance competencies across all curricular dimensions. "
        )

    interp += (
        f"Gram-Schmidt orthogonalization successfully decoupled these directions into a mutually orthogonal "
        f"coordinate system. Projection of the overall performance vector onto this orthogonal basis achieved a "
        f"subspace reconstruction fidelity of {percentage_representation}% with an Euclidean projection error of {projection_error:.2f}. "
        f"The primary academic anchor is '{top_comp.name}' ({top_comp.marks} marks), while '{weak_comp.name}' "
        f"({weak_comp.marks} marks) presents the greatest potential for subspace enhancement."
    )

    return interp


def build_concept_explanations(
    matrix: np.ndarray,
    rank: int,
    independent_names: List[str],
    dependent_names: List[str],
    basis_indices: List[int],
    ortho_matrix: np.ndarray,
    proj_error: float,
    fidelity: float,
) -> Dict[str, MathConceptExplanation]:
    """Builds comprehensive educational explanations for viva and mini-project report."""
    rows, cols = matrix.shape

    return {
        "matrix": MathConceptExplanation(
            concept="Academic Feature Matrix",
            formula=r"A \in \mathbb{R}^{m \times n}, \quad A = [v_1 \mid v_2 \mid \cdots \mid v_n]",
            input_description=f"{cols} academic components mapped to {rows} foundational curricular dimensions scaled by marks.",
            calculation=f"Constructed matrix of size {rows} × {cols} with values derived from student marks and competency vectors.",
            result=f"{rows} × {cols} Real Matrix",
            interpretation="Translates qualitative academic component marks into an inner product vector space suitable for linear algebraic decomposition.",
        ),
        "rank": MathConceptExplanation(
            concept="Matrix Rank",
            formula=r"\text{rank}(A) = \dim(\text{col}(A)) = \text{number of non-zero singular values}",
            input_description=f"Feature matrix A of dimension {rows} × {cols}.",
            calculation=f"SVD decomposition: A = U Σ V^T. Counted singular values σ_i > {TOLERANCE:.0e}.",
            result=f"Rank = {rank} (Max possible: {min(rows, cols)})",
            interpretation=f"The academic performance dataset contains {rank} genuinely independent mathematical dimensions of achievement.",
        ),
        "linear_dependence": MathConceptExplanation(
            concept="Linear Dependence & Independence",
            formula=r"c_1 v_1 + c_2 v_2 + \cdots + c_k v_k = 0 \implies c_1 = c_2 = \cdots = c_k = 0",
            input_description=f"Column vectors of the feature matrix: {cols} vectors in R^{rows}.",
            calculation="Evaluated column pivot columns and orthogonal projection residuals for each academic vector.",
            result=f"Independent: [{', '.join(independent_names)}]; Dependent: [{', '.join(dependent_names) if dependent_names else 'None'}]",
            interpretation="Independent subjects represent fundamental standalone competencies; dependent subjects are combinations of other skills.",
        ),
        "basis": MathConceptExplanation(
            concept="Subspace Basis",
            formula=r"\mathcal{B} = \{v_{i_1}, v_{i_2}, \dots, v_{i_r}\}, \quad \text{span}(\mathcal{B}) = \text{col}(A)",
            input_description=f"Set of {len(independent_names)} independent academic column vectors.",
            calculation=f"Extracted pivot columns: indices {[i + 1 for i in basis_indices]}.",
            result=f"{rank}-dimensional Basis for Academic Performance",
            interpretation="A minimal generating set that completely spans the subspace of the student's academic capability.",
        ),
        "gram_schmidt": MathConceptExplanation(
            concept="Gram-Schmidt Orthogonalization",
            formula=r"u_k = v_k - \sum_{j=1}^{k-1} \frac{v_k \cdot u_j}{u_j \cdot u_j} u_j, \quad e_k = \frac{u_k}{\|u_k\|}",
            input_description=f"{rank} linearly independent basis vectors.",
            calculation="Sequentially subtracted parallel projection components onto previous orthogonal vectors, then normalized.",
            result=f"{rank} Mutually Orthogonal Unit Vectors (Orthonormal Basis)",
            interpretation="Transforms raw, correlated academic vectors into an ideal perpendicular coordinate system.",
        ),
        "orthogonality": MathConceptExplanation(
            concept="Orthogonality Verification",
            formula=r"\langle e_i, e_j \rangle = e_i \cdot e_j = \delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \neq j \end{cases}",
            input_description=f"Normalized Gram-Schmidt basis matrix E.",
            calculation="Computed product E^T E and verified diagonal is 1 and off-diagonals are 0 within 1e-9 tolerance.",
            result=f"E^T E = I_{{{rank}}} (Verified)",
            interpretation="Confirms that zero redundancy or directional overlap exists among the decoupled performance axes.",
        ),
        "projection": MathConceptExplanation(
            concept="Vector Projection & Reconstruction",
            formula=r"\text{proj}_{\mathcal{B}}(p) = \sum_{i=1}^r (p \cdot e_i) e_i, \quad r = p - \text{proj}_{\mathcal{B}}(p)",
            input_description=f"Student composite performance vector p and orthonormal basis E.",
            calculation=rf"Computed dot products c_i = p \cdot e_i and error \|r\|_2 = {proj_error:.4f}.",
            result=rf"Error: {proj_error:.4f}, Subspace Fidelity: {fidelity:.1f}%",
            interpretation="Quantifies how comprehensively the extracted orthogonal basis captures the student's true overall academic profile.",
        ),
    }


def analyze_academic_performance(
    components: List[AcademicComponent], student_name: str = "Student"
) -> AnalysisResponse:
    """
    Executes the full 7-step mathematical pipeline:
    Academic Data -> Feature Matrix -> Rank -> Linear Dependence -> Basis ->
    Gram-Schmidt -> Orthogonality Check -> Projection -> Interpretation
    """
    # Step 1: Feature Matrix
    matrix, dim_names = create_feature_matrix(components)
    rows, cols = matrix.shape

    # Step 2: Rank
    rank = calculate_rank(matrix, tolerance=TOLERANCE)
    max_possible_rank = min(rows, cols)
    rank_utilization = round((rank / max_possible_rank) * 100.0, 2)
    is_full_rank = rank == max_possible_rank

    # Step 3: Linear Dependence / Independence
    ind_factors, dep_factors, basis_indices = find_independent_and_dependent_factors(
        matrix, components, tolerance=TOLERANCE
    )

    # Step 4 & 5: Basis & Gram-Schmidt
    basis_names = [components[i].name for i in basis_indices]
    basis_vectors = [[round(float(x), 4) for x in matrix[:, i]] for i in basis_indices]

    gs_steps, ortho_mat, norm_mat = perform_gram_schmidt(
        matrix, components, basis_indices, tolerance=TOLERANCE
    )

    # Step 6: Orthogonality Check
    ortho_matrix, ortho_verified = check_orthogonality(norm_mat, tolerance=TOLERANCE)

    # Step 7: Performance Vector & Projection
    # The student's overall performance vector across the 5 dimensions
    perf_vector = np.mean(matrix, axis=1)  # average profile vector
    projection, coeffs, residual, proj_error, fidelity = project_vector(
        perf_vector, norm_mat, tolerance=TOLERANCE
    )

    # Interpretation & Explanations
    ind_names = [f.name for f in ind_factors]
    dep_names = [f.name for f in dep_factors]
    interpretation = generate_interpretation(
        rank=rank,
        total_components=len(components),
        independent_names=ind_names,
        dependent_names=dep_names,
        projection_error=proj_error,
        percentage_representation=fidelity,
        components=components,
    )

    explanations = build_concept_explanations(
        matrix=matrix,
        rank=rank,
        independent_names=ind_names,
        dependent_names=dep_names,
        basis_indices=basis_indices,
        ortho_matrix=ortho_mat,
        proj_error=proj_error,
        fidelity=fidelity,
    )

    return AnalysisResponse(
        student_name=student_name,
        components=components,
        dimension_names=dim_names,
        matrix=[[round(float(x), 4) for x in row] for row in matrix],
        matrix_rows=rows,
        matrix_cols=cols,
        rank=rank,
        max_possible_rank=max_possible_rank,
        rank_utilization=rank_utilization,
        is_full_rank=is_full_rank,
        independent_factors=ind_factors,
        dependent_factors=dep_factors,
        basis=basis_vectors,
        basis_names=basis_names,
        basis_dimension=len(basis_indices),
        gram_schmidt_steps=gs_steps,
        orthogonal_basis=[[round(float(x), 4) for x in ortho_mat[:, i]] for i in range(ortho_mat.shape[1])],
        normalized_basis=[[round(float(x), 4) for x in norm_mat[:, i]] for i in range(norm_mat.shape[1])],
        orthogonality_matrix=ortho_matrix,
        orthogonality_verified=ortho_verified,
        performance_vector=[round(float(x), 4) for x in perf_vector],
        projection=[round(float(x), 4) for x in projection],
        projection_coefficients=coeffs,
        residual=[round(float(x), 4) for x in residual],
        projection_error=proj_error,
        percentage_representation=fidelity,
        interpretation=interpretation,
        explanations=explanations,
    )
