import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { ChatMessageItem, ConversationTurn } from '../../types/chat';
import { AnalysisResponse } from '../../types/analysis';
import { sendAIChatMessage } from '../../services/api';
import { isGeminiConfigured, chatWithGemini } from '../../services/gemini';
import { ChatWindow } from './ChatWindow';
import aiAvatar from '../../assets/ai-avatar.jpg';

interface AIAssistantProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentAnalysis?: AnalysisResponse | null;
}

const STORAGE_KEY = 'ai_assistant_conversation_v1';

const INITIAL_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'msg-welcome',
  role: 'assistant',
  content: "Hi! 👋 I'm your AI Assistant. How can I help you today? You can ask about linear algebra concepts, your analysis results, or site navigation.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentPage,
  onNavigate,
  currentAnalysis,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeminiActive, setIsGeminiActive] = useState<boolean>(() => isGeminiConfigured());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      //
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  // Save conversation in session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      //
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: userTimestamp,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Build conversation history for context (excluding errors & welcome)
    const conversationTurns: ConversationTurn[] = updatedMessages
      .filter((m) => !m.isError && m.id !== 'msg-welcome')
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      let reply: string;

      if (isGeminiActive) {
        // Send directly to Google Gemini API
        reply = await chatWithGemini(
          text.trim(),
          conversationTurns,
          currentPage,
          currentAnalysis
        );
      } else {
        // Attempt backend endpoint
        try {
          reply = await sendAIChatMessage(
            text.trim(),
            conversationTurns,
            currentPage
          );
        } catch (backendErr) {
          // If backend is unavailable and no Gemini key is set, give helpful advice
          reply = "I'm having trouble connecting to the backend. You can enable full AI capabilities by configuring a Google Gemini API key using the key icon (🔑) in the header.";
        }
      }

      const aiMessage: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.warn('AI chat error:', err);
      const isInvalidKey = err?.message?.includes('Invalid Gemini API Key');
      const errorContent = isInvalidKey
        ? 'Your Gemini API key appears to be invalid. Please click the 🔑 key icon in the header to update your API key.'
        : `Error: ${err?.message || "Sorry, I'm having trouble connecting right now. Please try again."}`;

      const errorMessage: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isError: true,
        retryPayload: text.trim(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (retryText: string) => {
    handleSendMessage(retryText);
  };

  const handleNewChat = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleOpenToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (bottom-right corner) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 group">
          <button
            type="button"
            onClick={handleOpenToggle}
            aria-label="Open AI Assistant"
            className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-cyan-500 text-white shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ring-4 ring-white/90 dark:ring-slate-900/90 focus:outline-none focus:ring-cyan-400 cursor-pointer"
          >
            {/* Pulsing ambient glow aura */}
            <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping duration-1000 -z-10" />

            {/* AI Avatar Image with glowing border */}
            <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 via-indigo-400 to-fuchsia-400">
              <img
                src={aiAvatar}
                alt="AI Assistant"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Sparkle badge in corner */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">
              <Sparkles className="w-3 h-3 text-slate-900" />
            </span>

            {/* Online status indicator */}
            <span className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
          </button>

          {/* Quick tooltip */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-medium whitespace-nowrap shadow-xl border border-slate-700/80 backdrop-blur-md pointer-events-none transition-opacity duration-200">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chat with AI Assistant</span>
          </div>
        </div>
      )}

      {/* Chat Window Modal / Bottom Sheet */}
      <ChatWindow
        isOpen={isOpen}
        isMinimized={isMinimized}
        onClose={() => setIsOpen(false)}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onNavigate={onNavigate}
        onRetry={handleRetry}
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        currentPage={currentPage}
        isGeminiActive={isGeminiActive}
        isKeyModalOpen={isKeyModalOpen}
        onOpenKeySettings={() => setIsKeyModalOpen(true)}
        onCloseKeyModal={() => setIsKeyModalOpen(false)}
        onKeyChange={(active) => setIsGeminiActive(active)}
      />
    </>
  );
};
