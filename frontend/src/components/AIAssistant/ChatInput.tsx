import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea up to 100px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const isInputEmpty = !input.trim();

  return (
    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3">
      {/* Loading state: AI Assistant is typing... */}
      {isLoading && (
        <div className="flex items-center gap-2 mb-2 px-1 text-xs text-indigo-600 dark:text-indigo-400 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="font-medium">AI Assistant is typing</span>
          <span className="inline-flex tracking-widest font-bold animate-bounce">...</span>
        </div>
      )}

      <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700/80 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask a question about this website..."
          aria-label="Ask AI Assistant a question"
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none resize-none px-2 py-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 max-h-24 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={isInputEmpty || isLoading}
          aria-label="Send message"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-1.5 px-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>Press <kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[9px]">Enter</kbd> to send</span>
        <span>Context-aware AI</span>
      </div>
    </div>
  );
};
