import pytest
import numpy as np
from app.schemas import AcademicComponent
from app.services.mathematics import (
    create_feature_matrix,
    calculate_rank,
    find_independent_and_dependent_factors,
    perform_gram_schmidt,
    check_orthogonality,
    project_vector,
    analyze_academic_performance,
)


@pytest.fixture
def sample_components():
    return [
        AcademicComponent(name="Mathematics", marks=85),
        AcademicComponent(name="Physics", marks=78),
        AcademicComponent(name="Programming", marks=92),
        AcademicComponent(name="Data Structures", marks=88),
        AcademicComponent(name="Database", marks=81),
        AcademicComponent(name="Computer Networks", marks=76),
        AcademicComponent(name="Operating Systems", marks=84),
        AcademicComponent(name="Communication Skills", marks=90),
    ]


def test_feature_matrix_dimensions(sample_components):
    matrix, dim_names = create_feature_matrix(sample_components)
    assert matrix.shape == (5, 8)
    assert len(dim_names) == 5
    assert not np.isnan(matrix).any()


def test_rank_calculation(sample_components):
    matrix, _ = create_feature_matrix(sample_components)
    rank = calculate_rank(matrix)
    assert 1 <= rank <= 5
    assert rank <= matrix.shape[1]


def test_linear_dependence_detection(sample_components):
    matrix, _ = create_feature_matrix(sample_components)
    ind, dep, basis_indices = find_independent_and_dependent_factors(matrix, sample_components)
    assert len(ind) + len(dep) == len(sample_components)
    assert len(basis_indices) == len(ind)
    assert len(ind) > 0


def test_gram_schmidt_orthogonality(sample_components):
    matrix, _ = create_feature_matrix(sample_components)
    ind, dep, basis_indices = find_independent_and_dependent_factors(matrix, sample_components)
    steps, ortho_mat, norm_mat = perform_gram_schmidt(matrix, sample_components, basis_indices)

    assert len(steps) == len(basis_indices)

    # Verify unit lengths
    for i in range(norm_mat.shape[1]):
        norm_i = np.linalg.norm(norm_mat[:, i])
        assert abs(norm_i - 1.0) < 1e-6

    # Verify orthogonality
    for i in range(norm_mat.shape[1]):
        for j in range(i + 1, norm_mat.shape[1]):
            dot_val = np.dot(norm_mat[:, i], norm_mat[:, j])
            assert abs(dot_val) < 1e-6, f"Vectors {i} and {j} are not orthogonal: dot={dot_val}"


def test_orthogonality_matrix_verification(sample_components):
    matrix, _ = create_feature_matrix(sample_components)
    ind, dep, basis_indices = find_independent_and_dependent_factors(matrix, sample_components)
    _, _, norm_mat = perform_gram_schmidt(matrix, sample_components, basis_indices)
    dot_mat, verified = check_orthogonality(norm_mat)

    assert verified is True
    k = len(dot_mat)
    for i in range(k):
        for j in range(k):
            if i == j:
                assert dot_mat[i][j] == 1.0
            else:
                assert dot_mat[i][j] == 0.0


def test_vector_projection(sample_components):
    matrix, _ = create_feature_matrix(sample_components)
    ind, dep, basis_indices = find_independent_and_dependent_factors(matrix, sample_components)
    _, _, norm_mat = perform_gram_schmidt(matrix, sample_components, basis_indices)

    p = np.mean(matrix, axis=1)
    projection, coeffs, residual, error, fidelity = project_vector(p, norm_mat)

    # Pythagorean theorem in inner product space: ||p||^2 ≈ ||projection||^2 + ||residual||^2
    norm_p_sq = np.linalg.norm(p) ** 2
    norm_proj_sq = np.linalg.norm(projection) ** 2
    norm_res_sq = np.linalg.norm(residual) ** 2
    assert abs(norm_p_sq - (norm_proj_sq + norm_res_sq)) < 1e-4
    assert 0 <= fidelity <= 100


def test_full_pipeline(sample_components):
    response = analyze_academic_performance(sample_components, student_name="Alice Smith")
    assert response.rank > 0
    assert response.basis_dimension == len(response.basis)
    assert response.orthogonality_verified is True
    assert len(response.gram_schmidt_steps) == response.basis_dimension
    assert "Analytical Rigor" in response.dimension_names
    assert len(response.interpretation) > 50
