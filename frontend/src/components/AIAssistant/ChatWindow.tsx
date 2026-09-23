import React, { useEffect, useRef } from 'react';
import { X, Minus, PlusCircle, Trash2, Sparkles, KeyRound } from 'lucide-react';
import { ChatMessageItem } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';
import { GeminiSettingsModal } from './GeminiSettingsModal';
import aiAvatar from '../../assets/ai-avatar.jpg';

interface ChatWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
  messages: ChatMessageItem[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onNavigate: (page: string) => void;
  onRetry: (payload: string) => void;
  onNewChat: () => void;
  onClearChat: () => void;
  currentPage: string;
  isGeminiActive: boolean;
  isKeyModalOpen: boolean;
  onOpenKeySettings: () => void;
  onCloseKeyModal: () => void;
  onKeyChange: (hasKey: boolean) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimize,
  messages,
  onSendMessage,
  isLoading,
  onNavigate,
  onRetry,
  onNewChat,
  onClearChat,
  currentPage,
  isGeminiActive,
  isKeyModalOpen,
  onOpenKeySettings,
  onCloseKeyModal,
  onKeyChange,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  if (!isOpen) return null;

  const getPageDisplayName = (page: string) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'new-analysis':
        return 'New Analysis';
      case 'results':
        return 'Results';
      case 'math-steps':
        return 'Math Steps';
      case 'visualization':
        return '3D Visualization';
      case 'history':
        return 'History';
      case 'about':
        return 'About';
      case 'help':
        return 'Help';
      default:
        return page.replace('-', ' ');
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-hidden ${
        isMinimized
          ? 'bottom-6 right-6 w-72 h-14 rounded-2xl shadow-xl'
          : 'bottom-2 sm:bottom-6 right-2 sm:right-6 left-2 sm:left-auto sm:w-[420px] h-[calc(100vh-80px)] sm:h-[580px] max-h-[92vh] rounded-2xl'
      }`}
      role="dialog"
      aria-label="AI Assistant Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white select-none border-b border-indigo-900/50">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-md">
              <img
                src={aiAvatar}
                alt="AI Assistant"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Pulsing online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs sm:text-sm tracking-wide text-white">AI Assistant</h3>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              <span>Page: <strong className="text-cyan-300 font-medium">{getPageDisplayName(currentPage)}</strong></span>
              {isGeminiActive && (
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-medium">
                  Gemini
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <>
              <button
                type="button"
                onClick={onOpenKeySettings}
                title={isGeminiActive ? 'Gemini API Key: Configured (Click to change)' : 'Configure Gemini API Key'}
                aria-label="Gemini API Key Settings"
                className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors group"
              >
                <KeyRound className="w-4 h-4 text-cyan-300" />
                <span
                  className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-1 ring-slate-900 ${
                    isGeminiActive ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={onNewChat}
                title="Start New Chat"
                aria-label="Start New Chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClearChat}
                title="Clear Conversation"
                aria-label="Clear Conversation"
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onToggleMinimize}
            title={isMinimized ? 'Expand' : 'Minimize'}
            aria-label={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Close Assistant"
            aria-label="Close AI Assistant"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main chat body (hidden when minimized) */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            {/* Banner when Gemini API Key is not configured */}
            {!isGeminiActive && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 text-xs text-slate-300 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-indigo-500/20 text-cyan-300 flex-shrink-0">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] text-slate-300">Add Gemini API key for AI math tutoring</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenKeySettings}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white text-[11px] font-medium transition-all shadow-sm flex-shrink-0"
                >
                  Set Key
                </button>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onNavigate={onNavigate}
                onRetry={onRetry}
              />
            ))}

            {/* If conversation only has the initial welcome message, show quick actions */}
            {messages.length <= 1 && (
              <div className="mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <QuickActions
                  onSelectAction={onSendMessage}
                  currentPage={currentPage}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Fixed at Bottom */}
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Gemini API Key Settings Modal */}
      <GeminiSettingsModal
        isOpen={isKeyModalOpen}
        onClose={onCloseKeyModal}
        onKeyChange={onKeyChange}
      />
    </div>
  );
};
