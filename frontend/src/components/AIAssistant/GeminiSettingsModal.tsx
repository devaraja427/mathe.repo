import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  getStoredGeminiApiKey,
  setStoredGeminiApiKey,
  removeStoredGeminiApiKey,
  validateGeminiApiKey,
  getMaskedApiKey,
  isUsingEnvKey,
} from '../../services/gemini';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChange?: (hasKey: boolean) => void;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({
  isOpen,
  onClose,
  onKeyChange,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [currentKey, setCurrentKey] = useState('');
  const [fromEnv, setFromEnv] = useState(false);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      const activeKey = getStoredGeminiApiKey();
      setCurrentKey(activeKey);
      setFromEnv(isUsingEnvKey());
      setApiKeyInput('');
      setStatusMessage(null);
      setShowKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndValidate = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a Gemini API key before validating.',
      });
      return;
    }

    setIsValidating(true);
    setStatusMessage({ type: 'info', text: 'Validating key with Google Gemini API…' });

    try {
      const result = await validateGeminiApiKey(trimmed);
      if (result.valid) {
        setStoredGeminiApiKey(trimmed);
        setCurrentKey(trimmed);
        setFromEnv(false);
        setApiKeyInput('');
        setStatusMessage({
          type: 'success',
          text: '✓ Gemini API Key validated and saved successfully! MathBot is now powered by Gemini.',
        });
        if (onKeyChange) onKeyChange(true);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'Failed to validate API key. Please double check the key.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error connecting to Gemini API.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleQuickSave = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a Gemini API key to save.',
      });
      return;
    }
    setStoredGeminiApiKey(trimmed);
    setCurrentKey(trimmed);
    setFromEnv(false);
    setApiKeyInput('');
    setStatusMessage({
      type: 'success',
      text: 'API Key saved locally. MathBot will use this key for requests.',
    });
    if (onKeyChange) onKeyChange(true);
  };

  const handleRemoveKey = () => {
    removeStoredGeminiApiKey();
    const remainingKey = getStoredGeminiApiKey();
    setCurrentKey(remainingKey);
    setFromEnv(isUsingEnvKey());
    setApiKeyInput('');
    setStatusMessage({
      type: 'info',
      text: remainingKey ? 'Custom key removed. Reverted to .env key.' : 'API key removed.',
    });
    if (onKeyChange) onKeyChange(Boolean(remainingKey));
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-slate-900/98 backdrop-blur-md text-slate-100 p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-label="Gemini API Key Settings"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Gemini API Key
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-medium">
                Google AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Configure key for AI Math Tutoring</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 space-y-4 flex-1">
        {/* Status card */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-medium">Current Status:</span>
            {currentKey ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Check className="w-3 h-3" /> Configured & Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertCircle className="w-3 h-3" /> Not Configured
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700/50">
            <span className="text-slate-400">Active Key:</span>
            <span className="font-mono text-slate-200">
              {getMaskedApiKey(currentKey)} {fromEnv && <span className="text-cyan-400 text-[10px]">(from .env)</span>}
            </span>
          </div>

          {currentKey && !fromEnv && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={handleRemoveKey}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove Custom Key
              </button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-200">
            {currentKey ? 'Update API Key' : 'Enter Your Gemini API Key'}
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-3 pr-20 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              {apiKeyInput && (
                <button
                  type="button"
                  onClick={() => setApiKeyInput('')}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSaveAndValidate}
            disabled={isValidating || !apiKeyInput.trim()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-xs hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Validating…</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Validate & Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickSave}
            disabled={isValidating || !apiKeyInput.trim()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Directly</span>
          </button>
        </div>

        {/* Status Alert Message */}
        {statusMessage && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/70 border border-rose-700/60 text-rose-200'
                : 'bg-cyan-950/70 border border-cyan-700/60 text-cyan-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{statusMessage.text}</div>
          </div>
        )}

        {/* Free API Key Link Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-800/40 to-cyan-950/40 border border-indigo-500/20 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Need a Google Gemini API Key?
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            You can get a free API key from Google AI Studio. No credit card required for standard tier access.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-medium transition-colors"
          >
            <span>Get Free Key at Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Security & Privacy Notice */}
        <div className="text-[10px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold">Privacy & Security</span>
          </div>
          <p className="leading-normal">
            Your API key is securely saved in your browser's <code className="text-cyan-400">localStorage</code> and transmitted directly to Google's API endpoint over HTTPS. It is never stored on third-party backend servers.
          </p>
        </div>
      </div>

      {/* Done Button */}
      <div className="pt-2 border-t border-slate-700/80">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
