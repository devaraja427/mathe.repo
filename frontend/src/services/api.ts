import {
  AcademicComponent,
  AnalysisResponse,
  HistoryItem,
} from '../types/analysis';
import { analyzeAcademicPerformanceClient } from './clientMath';

const API_BASE = 'http://127.0.0.1:8000/api';

const LOCAL_STORAGE_KEY = 'academic_analyzer_history_v1';

function getLocalHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(item: HistoryItem) {
  try {
    const existing = getLocalHistory();
    const updated = [item, ...existing.filter((h) => h.id !== item.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function analyzePerformance(
  components: AcademicComponent[],
  studentName: string = 'Student'
): Promise<{ result: AnalysisResponse; isOffline: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_name: studentName, components }),
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data: AnalysisResponse = await res.json();
      return { result: data, isOffline: false };
    }
  } catch (err) {
    console.info('Backend unreachable, falling back to client-side linear algebra engine:', err);
  }

  // Graceful client fallback
  const clientResult = analyzeAcademicPerformanceClient(components, studentName);
  const localId = Date.now();
  clientResult.id = localId;
  clientResult.created_at = new Date().toISOString();

  // Save to client localStorage history
  saveLocalHistory({
    id: localId,
    created_at: clientResult.created_at,
    student_name: studentName,
    components_count: components.length,
    matrix_rank: clientResult.rank,
    independent_count: clientResult.independent_factors.length,
    dependent_count: clientResult.dependent_factors.length,
    projection_error: clientResult.projection_error,
    components_summary: components.map((c) => c.name),
  });

  return { result: clientResult, isOffline: true };
}

export async function getAnalysesHistory(): Promise<HistoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/analyses`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to local history
  }
  return getLocalHistory();
}

export async function deleteAnalysisRecord(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/analyses/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(3000) });
    if (res.ok) return true;
  } catch {
    // fallback local deletion
  }

  const existing = getLocalHistory();
  const filtered = existing.filter((h) => h.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export async function getAnalysisById(id: number): Promise<AnalysisResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/analyses/${id}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    //
  }
  return null;
}

export async function sendAIChatMessage(
  message: string,
  conversation: { role: 'user' | 'assistant'; content: string }[],
  page: string = 'dashboard'
): Promise<string> {
  const timeoutMs = 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation,
        page,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API request failed');
    }

    const data = await res.json();
    return data.reply;
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}
