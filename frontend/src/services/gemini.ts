import { AnalysisResponse } from '../types/analysis';
import { ConversationTurn } from '../types/chat';

const STORAGE_KEY = 'gemini_api_key';

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

/**
 * Retrieve the Gemini API key.
 * Checks localStorage first, then falls back to VITE_GEMINI_API_KEY environment variable.
 */
export function getStoredGeminiApiKey(): string {
  try {
    const customKey = localStorage.getItem(STORAGE_KEY)?.trim();
    if (customKey) {
      return customKey;
    }
  } catch {
    // localStorage might be unavailable in some sandboxes
  }

  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
  if (envKey && envKey !== 'your_gemini_api_key_here') {
    return envKey;
  }

  return '';
}

/**
 * Check if the active key is loaded from .env rather than localStorage
 */
export function isUsingEnvKey(): boolean {
  try {
    const customKey = localStorage.getItem(STORAGE_KEY)?.trim();
    if (customKey) return false;
  } catch {
    //
  }
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
  return Boolean(envKey && envKey !== 'your_gemini_api_key_here');
}

/**
 * Save user-entered Gemini API key into localStorage
 */
export function setStoredGeminiApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch (err) {
    console.error('Failed to save Gemini API key to localStorage', err);
  }
}

/**
 * Remove user-entered Gemini API key from localStorage
 */
export function removeStoredGeminiApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove Gemini API key from localStorage', err);
  }
}

/**
 * Checks whether any valid Gemini key is configured
 */
export function isGeminiConfigured(): boolean {
  return getStoredGeminiApiKey().length > 0;
}

/**
 * Returns a masked representation of the key for safe UI display (e.g. AIzaSy...9aBc)
 */
export function getMaskedApiKey(key?: string): string {
  const target = key ?? getStoredGeminiApiKey();
  if (!target) return 'Not configured';
  if (target.length <= 10) return '••••••••';
  return `${target.slice(0, 6)}...${target.slice(-4)}`;
}

/**
 * Validate an API key by making a minimal test call to Gemini API
 */
export async function validateGeminiApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { valid: false, error: 'API key cannot be empty' };
  }

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with OK' }] }],
          generationConfig: { maxOutputTokens: 5, temperature: 0.1 },
        }),
      });

      if (res.ok) {
        return { valid: true };
      }

      const errData = await res.json().catch(() => ({})) as { error?: { message?: string; status?: string } };
      const message = errData.error?.message || `HTTP error ${res.status}`;

      // If model not found (404), try the next model in list
      if (res.status === 404) {
        continue;
      }

      return { valid: false, error: message };
    } catch (err: any) {
      return { valid: false, error: err?.message || 'Network request failed. Check internet connection.' };
    }
  }

  return { valid: false, error: 'Could not connect to Gemini models.' };
}

/**
 * Build domain-rich system prompt for Gemini
 */
function buildSystemPrompt(currentPage: string, analysis?: AnalysisResponse | null): string {
  const pageGuides: Record<string, string> = {
    dashboard: 'The user is on the Dashboard viewing high-level metrics, charts, and summary of academic dependencies.',
    'new-analysis': 'The user is on the New Analysis page configuring student subjects and marks (0-100) to compute linear dependency.',
    results: 'The user is on the Results page reviewing Matrix Rank, Nullity, Independent Basis, and Dependent factors.',
    'math-steps': 'The user is on the Mathematical Steps page studying step-by-step Gram-Schmidt, QR decomposition, SVD, and Nullspace proofs.',
    visualization: 'The user is on the 3D Visualization page exploring vectors in 3D WebGL space with projections onto the basis plane.',
    history: 'The user is on the History page browsing and managing previous student analysis records.',
    about: 'The user is on the About page learning the linear algebra concepts behind grading vectors.',
    help: 'The user is on the Help page looking for definitions, FAQs, and support.',
  };

  const pageContext = pageGuides[currentPage] || `The user is on the ${currentPage} page.`;

  let studentContext = 'No student analysis is currently loaded.';
  if (analysis) {
    studentContext = `
ACTIVE STUDENT ANALYSIS:
- Student Name: ${analysis.student_name}
- Subjects & Marks: ${analysis.components.map((c) => `${c.name}: ${c.marks}`).join(', ')}
- Matrix Rank: ${analysis.rank} / ${analysis.max_possible_rank} (Utilization: ${analysis.rank_utilization}%)
- Nullity: ${analysis.max_possible_rank - analysis.rank}
- Independent Factors (Basis Vectors): ${analysis.independent_factors.map((f) => f.name).join(', ') || 'None'}
- Dependent Factors: ${analysis.dependent_factors.map((f) => f.name).join(', ') || 'None'}
- Subspace Fidelity: ${analysis.percentage_representation}%
- Projection Error: ${analysis.projection_error.toFixed(4)}
- Orthogonality Verified: ${analysis.orthogonality_verified ? 'Yes' : 'No'}
- Interpretation: ${analysis.interpretation}
`;
  }

  return `You are MathBot, an intelligent and friendly AI Tutor built into the Academic Dependency Analyzer.
You specialize in Linear Algebra, Vector Calculus, and Academic Performance Analysis.

ROLE & RESPONSIBILITIES:
1. Explain linear algebra concepts (Gram-Schmidt orthogonalization, Matrix Rank, Nullity, Basis, Span, Orthogonal Projections, QR Factorization, SVD) clearly and intuitively.
2. If mathematical formulas or derivations are helpful, format them nicely with Markdown and LaTeX notation (e.g. $v_k = u_k - \\sum \\text{proj}_{u_i}(v_k)$).
3. If an active student analysis is present, interpret their results: why certain subjects are dependent, how rank utilization impacts academic breadth, and provide actionable academic advice.
4. If the user asks about the website or how to do something, guide them step-by-step using the current page context.
5. Keep your tone encouraging, clear, and professional.

CURRENT CONTEXT:
${pageContext}

${studentContext}
`;
}

/**
 * Send chat message to Google Gemini API
 */
export async function chatWithGemini(
  message: string,
  conversation: ConversationTurn[],
  currentPage: string,
  analysis?: AnalysisResponse | null
): Promise<string> {
  const apiKey = getStoredGeminiApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API key found. Please configure your API key in the AI Assistant settings.');
  }

  const systemPrompt = buildSystemPrompt(currentPage, analysis);

  // Build Gemini contents payload
  const contents: { role: string; parts: { text: string }[] }[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am MathBot, your expert AI tutor for Academic Dependency Analysis and Linear Algebra. How can I help you today?' }] },
  ];

  // Include recent conversation turns (last 10)
  for (const turn of conversation.slice(-10)) {
    contents.push({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: turn.content }],
    });
  }

  // Append user's current message
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  // Try Gemini models in order of preference
  let lastError: Error | null = null;
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})) as { error?: { message?: string; status?: string } };
        const errMsg = errorData.error?.message || `HTTP ${res.status}`;

        if (res.status === 404) {
          // Model not found, try fallback model
          continue;
        }

        if (res.status === 400 && errMsg.includes('API_KEY_INVALID')) {
          throw new Error('Invalid Gemini API Key. Please verify or update your key in the AI Assistant settings.');
        }

        throw new Error(errMsg);
      }

      const data = await res.json() as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply.trim();
      }
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes('Invalid Gemini API Key')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('Failed to get a response from Gemini.');
}
