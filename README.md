# 🎓 Student Academic Analyser – Full 3D Vector Calculus

An interactive, NVIDIA CUDA-inspired academic analysis platform that uses **Linear Algebra, 3D Vector Visualization, and Mathematical Analysis** to explore student academic performance in a three-dimensional vector space.

The system represents student performance as vectors and applies mathematical techniques such as **matrix rank, Gram–Schmidt orthogonalization, orthonormal basis construction, subspace projections, and Singular Value Decomposition (SVD)** to demonstrate academic analysis visually.

## 🚀 Live Demo

🌐 **Live Application:** [Student Academic Analyser](https://devanemotron404-th-git-40d236-bhemannabhemanna86-3316s-projects.vercel.app/)

> Note: The application includes a demo mode. Verify which analysis features use actual calculations and which use sample data before presenting results as real academic assessments.

## ✨ Key Features

- **Interactive 3D Visualization:** Explore vectors and subspaces using a WebGL-powered 3D interface.
- **Student Performance Analysis:** Represent student academic metrics as mathematical vectors.
- **Linear Algebra Computations:** Demonstrate vector operations, matrix rank, and subspace relationships.
- **Gram–Schmidt Orthogonalization:** Construct orthogonal or orthonormal basis vectors.
- **Subspace Projection:** Project student performance vectors onto selected basis vectors or subspaces.
- **SVD Rank Analysis:** Explore matrix rank and dimensionality reduction concepts.
- **Mathematical Steps:** View the calculation steps used in supported analyses.
- **Analysis History:** Review previously saved or generated analyses.
- **Analysis Results:** Display calculated results and vector properties.
- **Interactive Controls:** Rotate, zoom, inspect, and reset the 3D visualization.
- **Demo Mode:** Explore the interface using demonstration data.
- **Responsive Dashboard:** Navigate academic analysis features through a dedicated dashboard.

## 🖥️ Application Overview

The dashboard provides the following sections:

| Section | Description |
|---|---|
| Dashboard | Main project interface and 3D overview |
| New Analysis | Start a new academic vector analysis |
| Analysis Results | Review analysis outputs |
| Mathematical Steps | Understand mathematical calculations |
| 3D Visualizations | Explore vectors and subspaces |
| Analysis History | Access previous analyses, if persistence is implemented |
| About Project | View project information |
| Help / Methodology | Understand the mathematical methods |

## 🧮 Mathematical Concepts

### 1. Student Performance Vector

A student's academic profile can be represented as:

\[
\mathbf{p} = [m_1,m_2,m_3,\ldots,m_n]
\]

Where each \(m_i\) represents a normalized academic metric, such as subject marks, assessment scores, or competency scores.

For a three-dimensional visualization:

\[
\mathbf{p} = [m_1,m_2,m_3]
\]

The dimensions must have clearly defined meanings and consistent scales.

### 2. Vector Projection

The projection of vector \(\mathbf{p}\) onto a nonzero vector \(\mathbf{b}\) is:

\[
\operatorname{proj}_{\mathbf{b}}(\mathbf{p})
=
\frac{\mathbf{p}\cdot\mathbf{b}}
{\mathbf{b}\cdot\mathbf{b}}\mathbf{b}
\]

This calculation demonstrates the component of a student's performance vector along a selected direction.

### 3. Gram–Schmidt Orthogonalization

The Gram–Schmidt process transforms linearly independent vectors into orthogonal vectors.

For two vectors:

\[
\mathbf{u}_1=\mathbf{v}_1
\]

\[
\mathbf{u}_2=
\mathbf{v}_2-
\frac{\mathbf{v}_2\cdot\mathbf{u}_1}
{\mathbf{u}_1\cdot\mathbf{u}_1}\mathbf{u}_1
\]

Normalize the vectors to obtain an orthonormal basis:

\[
\mathbf{e}_i=\frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}
\]

### 4. Matrix Rank

Matrix rank represents the number of linearly independent rows or columns in a matrix.

\[
\operatorname{rank}(A)
=
\text{dimension of the column space of }A
\]

It can help demonstrate redundancy among academic metrics.

### 5. Singular Value Decomposition (SVD)

A matrix \(A\) can be decomposed as:

\[
A=U\Sigma V^T
\]

Where:

- \(U\) contains left singular vectors.
- \(\Sigma\) contains singular values.
- \(V^T\) contains transposed right singular vectors.

SVD can be used to demonstrate dimensionality reduction and identify dominant patterns in a dataset.

## 🏗️ System Architecture

The conceptual workflow is:

```text
                Student Academic Data
                         |
                         v
                Data Validation
                         |
                         v
               Vector Representation
                         |
                         v
                Linear Algebra Engine
               /         |          \
              v          v           v
        Matrix Rank   Projection   Gram-Schmidt
              \          |           /
               \         |          /
                         v
                Analysis Results
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Mathematical Steps      3D Visualization
             |                       |
             +-----------+-----------+
                         |
                         v
                  User Dashboard
```

This diagram describes the intended processing flow; the actual implementation depends on the project's source code and backend configuration.

## 🛠️ Technology Stack

The screenshot indicates a WebGL-based 3D visualization interface and NVIDIA/CUDA-inspired branding. The exact dependencies should be confirmed from the project's package files.

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript/TypeScript | Web interface and application logic |
| React (if used) | Component-based UI development |
| WebGL | Hardware-accelerated 3D rendering |
| Three.js (if used) | 3D scene, vector, and camera management |
| Linear Algebra algorithms | Vector and matrix computations |
| Vercel | Web application hosting |
| NVIDIA CUDA | Optional GPU-accelerated computation where supported |

**Important:** WebGL rendering does not automatically mean that calculations run on NVIDIA CUDA. CUDA is a separate GPU computing platform, and its use must be verified in the source code. Similarly, React and Three.js are listed as conditional technologies until confirmed from the repository.

## 📂 Suggested Project Structure

```text
student-academic-analyser/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── Dashboard
│   │   ├── Sidebar
│   │   ├── VectorVisualization
│   │   └── AnalysisResults
│   │
│   ├── pages/
│   │   ├── Dashboard
│   │   ├── NewAnalysis
│   │   ├── AnalysisHistory
│   │   └── AboutProject
│   │
│   ├── algorithms/
│   │   ├── vectorOperations
│   │   ├── matrixRank
│   │   ├── gramSchmidt
│   │   ├── projection
│   │   └── svd
│   │
│   ├── services/
│   ├── utils/
│   ├── App
│   └── main
│
├── package.json
├── README.md
└── .gitignore
```

*This is a suggested structure, not a verified listing of your current repository.*

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm, if the application uses a Node-based frontend.
- Git.
- A modern web browser with WebGL support.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd student-academic-analyser
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

If the project uses Vite, open the local URL printed in the terminal, commonly `http://localhost:5173`.

### 4. Create a production build

```bash
npm run build
```

Use the scripts defined in `package.json`; the commands above assume a compatible frontend setup.

## 📊 Example Academic Data

An illustrative student vector might look like this:

```javascript
const student = {
  studentId: "STU001",
  mathematics: 85,
  programming: 92,
  dataStructures: 78
};

const performanceVector = [
  student.mathematics,
  student.programming,
  student.dataStructures
];

console.log(performanceVector);
// [85, 92, 78]
```

These values are examples, not actual student records. For meaningful comparisons, normalize metrics when they use different scales.

## 🎯 Use Cases

- Learning linear algebra through interactive visualization.
- Demonstrating vector operations and matrix transformations.
- Exploring relationships between academic metrics.
- Understanding orthogonal projections and basis construction.
- Visualizing multidimensional data in three dimensions.
- Supporting educational demonstrations and mathematical projects.

**Limitation:** Mathematical vector analysis alone cannot reliably predict a student's academic future. Any predictive feature would require a validated model, suitable data, and appropriate evaluation.

## 🔒 Privacy and Data Security

- Use synthetic or anonymized data for demonstrations.
- Avoid publishing student names, registration numbers, marks, or other personal information in a public repository.
- Store API keys and secrets in environment variables rather than committing them to GitHub.
- Apply authentication and access controls if real academic records are stored.

## 🔮 Future Enhancements

- CSV upload for academic datasets.
- Automatic data validation and normalization.
- Interactive comparisons between student profiles.
- Additional matrix decomposition methods.
- Downloadable analysis reports.
- Persistent analysis history and database integration.
- Backend API for large-scale computations.
- Accessibility improvements and mobile-friendly visualization.
- Optional GPU acceleration for computationally intensive workloads.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Submit a pull request describing the changes.

## 📜 License

Choose a license appropriate for your project, such as the MIT License, before distributing the source code publicly.

## 👨‍💻 Author

**Devaraja**

Student Developer | Academic Analytics | Linear Algebra | 3D Visualization | AI and Machine Learning

---

⭐ If you find this project useful for learning mathematics and interactive visualization, consider starring the repository on GitHub.
