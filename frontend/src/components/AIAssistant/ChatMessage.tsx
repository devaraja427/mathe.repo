import React from 'react';
import { User, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ChatMessageItem } from '../../types/chat';
import aiAvatar from '../../assets/ai-avatar.jpg';

interface ChatMessageProps {
  message: ChatMessageItem;
  onNavigate?: (page: string) => void;
  onRetry?: (payload: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onNavigate,
  onRetry,
}) => {
  const isUser = message.role === 'user';

  // Safe formatting parser for AI markdown responses
  const renderFormattedContent = (content: string) => {
    // Process code blocks first
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const code = lines.join('\n');
        return (
          <pre
            key={index}
            className="my-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Process normal text line by line
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();

            if (!trimmed) {
              return <div key={lIdx} className="h-1.5" />;
            }

            // Headers: ### or ##
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lIdx} className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-2 mb-1">
                  {renderInlineStyles(trimmed.replace(/^###\s+/, ''))}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lIdx} className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2.5 mb-1">
                  {renderInlineStyles(trimmed.replace(/^##\s+/, ''))}
                </h3>
              );
            }

            // Unordered list
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const itemText = trimmed.replace(/^[-*]\s+/, '');
              return (
                <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                  <span className="text-indigo-500 font-bold leading-none mt-1">•</span>
                  <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                    {renderInlineStyles(itemText)}
                  </span>
                </div>
              );
            }

            // Numbered list: e.g. 1. 2.
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
            if (numMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {numMatch[1]}.
                  </span>
                  <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                    {renderInlineStyles(numMatch[2])}
                  </span>
                </div>
              );
            }

            // Regular paragraph
            return (
              <p key={lIdx} className="text-xs leading-relaxed">
                {renderInlineStyles(trimmed)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Inline formatting helper for links, bold, code
  const renderInlineStyles = (text: string) => {
    // Regex matches markdown links: [Title](url), bold: **bold**, and code: `code`
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const segments = text.split(regex);

    return segments.map((seg, i) => {
      // Link [text](/route)
      const linkMatch = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const linkTitle = linkMatch[1];
        const linkHref = linkMatch[2];
        const isInternal = linkHref.startsWith('/');

        if (isInternal && onNavigate) {
          const pageTarget = linkHref.replace(/^\//, '');
          return (
            <button
              key={i}
              type="button"
              onClick={() => onNavigate(pageTarget)}
              className="inline-flex items-center gap-0.5 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-indigo-400 underline-offset-2 transition-colors cursor-pointer"
            >
              <span>{linkTitle}</span>
              <ArrowRight className="w-2.5 h-2.5 shrink-0 inline-block" />
            </button>
          );
        }

        return (
          <a
            key={i}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {linkTitle}
          </a>
        );
      }

      // Bold **text**
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
            {seg.slice(2, -2)}
          </strong>
        );
      }

      // Inline `code`
      if (seg.startsWith('`') && seg.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-700/80 font-mono text-[11px] text-indigo-600 dark:text-indigo-300"
          >
            {seg.slice(1, -1)}
          </code>
        );
      }

      return seg;
    });
  };

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } group`}
    >
      {/* Avatar Icon */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-indigo-600 text-white ring-2 ring-indigo-300 dark:ring-indigo-700">
          <User className="w-4 h-4" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-cyan-300 dark:ring-cyan-700">
          <img
            src={aiAvatar}
            alt="AI Assistant"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl shadow-sm text-xs ${
            isUser
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none'
              : message.isError
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-none'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Connection Issue</span>
            </div>
          )}

          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            renderFormattedContent(message.content)
          )}

          {/* Retry button for error states */}
          {message.isError && message.retryPayload && onRetry && (
            <div className="mt-2.5 pt-2 border-t border-rose-200 dark:border-rose-800/60 flex items-center">
              <button
                type="button"
                onClick={() => onRetry(message.retryPayload!)}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};
