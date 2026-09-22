import React from 'react';
import { Award, BookOpen, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

const VIVA_QUESTIONS = [
  {
    q: 'Q1. Why is the Gram-Schmidt process necessary when we already have a basis?',
    a: 'While any basis spans the performance subspace, raw academic basis vectors are generally correlated and non-perpendicular. Gram-Schmidt decouples mutual dependencies, producing an orthonormal basis where each axis represents an isolated, non-overlapping performance dimension. This eliminates directional bias when projecting student profiles.',
  },
  {
    q: 'Q2. What does a rank-deficient feature matrix imply academically?',
    a: 'If rank(A) < min(m, n), the student’s marks exhibit linear dependency. Academically, this implies that some subjects do not introduce new, unique competencies; rather, mastery in those subjects is fully predicted by a linear combination of other foundational subjects.',
  },
  {
    q: 'Q3. How is the residual error vector interpreted in academic counseling?',
    a: 'The residual vector r = p - proj_B(p) represents the component of student capability that cannot be explained or spanned by the identified basis. A small ||r|| indicates high subspace fidelity (>90%), meaning the basis models the student’s academic aptitude almost perfectly.',
  },
  {
    q: 'Q4. How does this system avoid trivial solutions in Gram-Schmidt?',
    a: 'Vectors with near-zero Euclidean norm (||v|| < 10^{-10}) or vectors identified as linearly dependent during column rank elimination are filtered beforehand. This guarantees that only genuine basis vectors are supplied to Gram-Schmidt, preventing division-by-zero during normalization.',
  },
];

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          Academic Project Specification
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          About The Student Academic Project
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Linear Algebra & Vector Calculus: Mathematical modeling of student academic performance.
        </p>
      </div>

      {/* Project Overview */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Project Objective & Engineering Significance
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Traditional academic grading produces scalar marks that mask underlying dependencies among
          courses. For example, excellence in <em>Data Structures</em> is strongly correlated with both
          <em>Programming Logic</em> and <em>Discrete Mathematics</em>.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The <strong>Student Academic System</strong> treats each academic subject as a vector in
          a 5-dimensional curricular competency space (R^5). Using rigorous linear algebra
          techniques—Matrix Construction, Singular Value Decomposition (SVD) Rank Analysis, Linear
          Independence Verification, Subspace Basis Extraction, Gram-Schmidt Orthogonalization, and
          Subspace Vector Projection—the application isolates independent achievement directions and models
          subject interdependencies.
        </p>
      </section>

      {/* Curriculum Mapping */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Linear Algebra Curriculum Mapping
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              1. Matrix Formulation (A in R^(5×n))
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Columns correspond to student marks scaled along 5 fundamental curricular vectors (Analytical, Algorithmic, Applied, Theoretical, Communication).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              2. Matrix Rank & Nullity
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Calculates genuine dimensions of competency rank(A) = dim(col(A)) using SVD tolerance sigma_i &gt; eps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              3. Linear Independence & Basis
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Isolates minimal spanning vectors B and computes linear combination coefficients for dependent subjects via least squares.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              4. Gram-Schmidt & Orthogonal Projection
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Decouples basis into orthonormal coordinate vectors e_i, verifies E^T E = I, and calculates projection proj_B(p) with residual error.
            </p>
          </div>
        </div>
      </section>

      {/* Viva Voce Guide */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          Viva Voce Defense & Examiner Questions
        </h3>

        <div className="space-y-3">
          {VIVA_QUESTIONS.map((v, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{v.q}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-blue-500">
                {v.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
