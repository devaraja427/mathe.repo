import React, { useEffect, useRef } from 'react';
import { X, Minus, PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { ChatMessageItem } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';
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
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              <span>Page: <strong className="text-cyan-300 font-medium">{getPageDisplayName(currentPage)}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <>
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
    </div>
  );
};
