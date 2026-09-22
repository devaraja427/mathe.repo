import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Loader2,
  User,
  RotateCcw,
} from 'lucide-react';
import { AnalysisResponse } from '../../types/analysis';

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  analysis: AnalysisResponse;
}

// ── Gemini call (browser-side, no SDK) ────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function askGemini(
  systemPrompt: string,
  history: Message[],
  userMessage: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "No Gemini API key found. Please set VITE_GEMINI_API_KEY in your .env file and restart the dev server.";
  }

  const contents: { role: string; parts: { text: string }[] }[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "Understood! I am MathBot, ready to help analyse this student's academic performance data." }] },
    ...history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json() as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response received.';
}

// ── System prompt ─────────────────────────────────────────────────────────
function buildSystemPrompt(a: AnalysisResponse): string {
  return `You are MathBot, a friendly expert AI tutor specializing in Linear Algebra and academic performance analysis.

Student: ${a.student_name}
Subjects & Marks: ${a.components.map((c) => `${c.name}: ${c.marks}`).join(', ')}
Matrix Rank: ${a.rank} / ${a.max_possible_rank} (Rank Utilization: ${a.rank_utilization}%)
Independent Factors (Basis): ${a.independent_factors.map((f) => f.name).join(', ') || 'None'}
Dependent Factors: ${a.dependent_factors.map((f) => f.name).join(', ') || 'None'}
Subspace Fidelity: ${a.percentage_representation}%
Projection Error: ${a.projection_error.toFixed(4)}
Orthogonality Verified: ${a.orthogonality_verified}
Interpretation: ${a.interpretation}

Your responsibilities:
1. Explain linear algebra concepts (rank, basis, projection, Gram-Schmidt, span) in simple intuitive terms.
2. Interpret the student's data — what does it mean that certain subjects are "dependent"?
3. Give actionable academic advice based on the numbers.
4. Answer general math questions with clarity and enthusiasm.
5. Keep responses concise (3-5 sentences max unless asked for detail).
6. Use emojis sparingly to keep the tone friendly but professional.`;
}

// ── Suggestions ────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What does matrix rank mean here?',
  'Why are some subjects dependent?',
  'Explain Gram-Schmidt simply',
  'How can this student improve?',
  'What is subspace fidelity?',
];

// ── Message bubble ─────────────────────────────────────────────────────────
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-cyan-500 to-indigo-600'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60'
        }`}
      >
        {msg.text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
        <div className={`text-[10px] mt-1.5 ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
export const AIAssistant: React.FC<AIAssistantProps> = ({ analysis }) => {
  const welcomeText = `Hi! I'm MathBot — your AI tutor for this analysis.\n\nI can explain the linear algebra behind ${analysis.student_name}'s results, clarify concepts like rank, basis, and Gram-Schmidt, or give academic insights. Ask me anything!`;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: welcomeText, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const systemPrompt = buildSystemPrompt(analysis);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg: Message = { role: 'user', text: userText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askGemini(systemPrompt, messages, userText);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${(err as Error).message}`, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{ role: 'assistant', text: welcomeText, timestamp: new Date() }]);
  };

  return (
    <>
      {/* FAB */}
      <button
        id="ai-assistant-fab"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-2xl shadow-cyan-500/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform duration-200 group"
        aria-label="Open AI Assistant"
        title="Open AI Math Tutor"
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6 group-hover:hidden" />
            <Sparkles className="w-6 h-6 hidden group-hover:block animate-pulse" />
          </>
        )}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-25 pointer-events-none" />
        )}
      </button>

      {/* Chat panel */}
      <div
        id="ai-assistant-panel"
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-h-[580px] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">MathBot</p>
              <p className="text-[10px] text-cyan-400 mt-0.5 font-mono">AI Linear Algebra Tutor</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Context pill */}
        <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-700/40 flex-shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            Analysing: <span className="text-cyan-400 font-semibold">{analysis.student_name}</span>
            {' · '}Rank <span className="text-emerald-400">{analysis.rank}/{analysis.max_possible_rank}</span>
            {' · '}<span className="text-amber-400">{analysis.percentage_representation}%</span> fidelity
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-indigo-600 flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-700/60 px-3.5 py-2.5 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-[12px] text-slate-400">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => void sendMessage(s)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-cyan-500/50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-2 border-t border-slate-700/60 flex-shrink-0">
          <div className="flex items-end gap-2 bg-slate-800 rounded-xl border border-slate-700 focus-within:border-cyan-500/60 transition-colors px-3 py-2">
            <textarea
              ref={inputRef}
              id="ai-assistant-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the math…"
              className="flex-1 bg-transparent text-[13px] text-slate-100 placeholder-slate-500 resize-none outline-none leading-relaxed max-h-28"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              id="ai-assistant-send"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            Powered by Gemini · Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
};
