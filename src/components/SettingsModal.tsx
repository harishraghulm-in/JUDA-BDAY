import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link2, Check, AlertCircle, ExternalLink, Copy, Sparkles, FileSpreadsheet, Code2, RotateCcw } from 'lucide-react';
import { getStoredScriptUrl, setStoredScriptUrl } from '../services/wishesService';
import { GOOGLE_FORM_URL } from '../config';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [url, setUrl] = useState(getStoredScriptUrl());
  const [copied, setCopied] = useState(false);
  const [validationNote, setValidationNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUrlChange = (newVal: string) => {
    setUrl(newVal);
    const trimmed = newVal.trim();

    if (trimmed.includes('forms.gle') || trimmed.includes('docs.google.com/forms')) {
      setValidationNote(
        '💡 Notice: That is the Google Form link for people to SUBMIT wishes. To DISPLAY submitted responses here, open your Google Form, click the "Responses" tab, click "Link to Sheets" (or "View in Sheets"), and paste that Google Sheet URL or the Apps Script Web App URL from Code.gs.'
      );
    } else if (trimmed.includes('docs.google.com/spreadsheets')) {
      setValidationNote(
        '✅ Google Sheet detected! Make sure your sheet sharing is set to "Anyone with the link can view". For permanent row deletion with Admin PIN, deploy Code.gs as an Apps Script Web App.'
      );
    } else if (trimmed.includes('script.google.com/macros')) {
      setValidationNote(
        '🌟 Perfect! Google Apps Script Web App detected. Live responses & Admin PIN row deletion are enabled.'
      );
    } else if (trimmed === '') {
      setValidationNote(null);
    } else {
      setValidationNote(null);
    }
  };

  const handleSave = () => {
    setStoredScriptUrl(url.trim());
    onSaved();
    onClose();
  };

  const copyFormUrl = () => {
    navigator.clipboard.writeText(GOOGLE_FORM_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f0704]/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg bg-[#fcf8ee] text-[#2c170d] rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-2 border-[#e6d3b3] my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#725239] hover:text-[#2c170d] p-1.5 rounded-full hover:bg-[#eedfc4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#f3e5cb] flex items-center justify-center text-[#844b20]">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2c170d]">
                Connect Google Form Wishes
              </h3>
              <p className="text-xs text-[#7c5a41]">Live Responses from Google Sheet</p>
            </div>
          </div>

          <p className="text-xs text-[#52331f] mb-4 leading-relaxed font-sans">
            Wishes submitted to your Google Form are stored in its linked Google Sheet. Connect your data source below:
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1.5">
                Google Apps Script Web App or Sheet URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec or https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3.5 py-2.5 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-xs text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b] font-mono"
              />
            </div>

            {validationNote && (
              <div className="p-3 rounded-xl bg-[#faeed8] border border-[#d9ba8c] text-xs text-[#6e3e15] leading-relaxed">
                {validationNote}
              </div>
            )}

            {/* Guide Cards */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#f5ecda] rounded-xl border border-[#e4d3b6] space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-semibold text-[#3b2010]">
                  <Code2 className="w-3.5 h-3.5 text-[#9e541c]" />
                  <span>Method 1: Google Apps Script Web App (Recommended)</span>
                </div>
                <p className="text-[#65432a] text-[11px] leading-relaxed">
                  Open your linked Google Sheet &gt; <strong>Extensions &gt; Apps Script</strong>. Paste the code from <code className="bg-[#ebd4b1] px-1 py-0.5 rounded font-mono">Code.gs</code>. Set your <code className="font-mono">ADMIN_PIN</code> in Script Properties and deploy as Web App with access set to <strong>"Anyone"</strong>. Enables live syncing + permanent row deletion!
                </p>
              </div>

              <div className="p-3 bg-[#f5ecda] rounded-xl border border-[#e4d3b6] space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-semibold text-[#3b2010]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#3b7c4b]" />
                  <span>Method 2: Direct Google Sheet URL</span>
                </div>
                <p className="text-[#65432a] text-[11px] leading-relaxed">
                  Open your linked Google Sheet &gt; <strong>Share &gt; Anyone with link can view</strong>. Copy the browser URL and paste it here. Responses load automatically!
                </p>
              </div>
            </div>

            {/* Google Form Link reference */}
            <div className="p-3 bg-[#f0e4ce] rounded-xl border border-[#dbc6a4] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-[#3b2010]">Your Google Form for WISHES:</span>
                <button
                  type="button"
                  onClick={copyFormUrl}
                  className="inline-flex items-center gap-1 text-[11px] text-[#935222] hover:text-[#5a2e10] cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#84491c] hover:underline font-mono text-[11px] break-all flex items-center gap-1"
              >
                <span>{GOOGLE_FORM_URL}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setUrl('');
                  handleUrlChange('');
                }}
                className="inline-flex items-center gap-1 text-xs text-[#8c674b] hover:text-[#2c170d] cursor-pointer"
                title="Reset to sample preview wishes"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset URL</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-serif text-[#6c4a30] hover:text-[#2c170d] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-[#422212] hover:bg-[#5a311b] text-[#fbf8f0] rounded-xl font-serif text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
                >
                  Save &amp; Fetch
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
