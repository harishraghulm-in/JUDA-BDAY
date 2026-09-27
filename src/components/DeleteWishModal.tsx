import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Wish } from '../types';

interface DeleteWishModalProps {
  wish: Wish | null;
  onClose: () => void;
  onConfirmDelete: (id: string, pin: string) => Promise<{ success: boolean; message?: string }>;
}

export const DeleteWishModal: React.FC<DeleteWishModalProps> = ({
  wish,
  onClose,
  onConfirmDelete,
}) => {
  const [pin, setPin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!wish) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Please enter your private Admin PIN');
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);

    const result = await onConfirmDelete(wish.id, pin.trim());
    setIsDeleting(false);

    if (result.success) {
      setSuccessMsg(result.message || 'Wish permanently deleted from Google Sheet.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg(result.message || 'Incorrect Admin PIN or deletion failed.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f0704]/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          className="relative z-10 w-full max-w-md bg-[#fdf9ef] text-[#2c170d] rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-2 border-[#e6d3b3]"
        >
          {/* Close */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-[#725239] hover:text-[#2c170d] p-1.5 rounded-full hover:bg-[#eedfc4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 text-[#943f21] mb-4">
            <div className="w-10 h-10 rounded-full bg-[#fcedea] flex items-center justify-center border border-[#e8bbb0]">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2c170d]">
                Delete Wish Row
              </h3>
              <p className="text-xs text-[#7c5a41]">Permanent Google Sheet Removal</p>
            </div>
          </div>

          <p className="text-sm text-[#50311c] mb-4 leading-relaxed font-sans">
            You are about to permanently remove the wish from{' '}
            <strong className="font-semibold text-[#2c170d]">{wish.name}</strong> ({wish.relationship}).
            This action cannot be undone.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#fae8e5] border border-[#e5a89e] text-xs text-[#9c2d1b] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#e8f7ee] border border-[#a2dfb8] text-xs text-[#1e6e3c] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#a86532]" />
                Enter Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter secret PIN"
                autoFocus
                disabled={isDeleting}
                className="w-full px-4 py-2.5 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b] font-mono text-sm tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-[#a89078]"
              />
              <p className="text-[11px] text-[#8c6b50] mt-1 italic">
                Validated against your Google Apps Script ADMIN_PIN (or test PIN: 2026).
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-serif text-[#6c4a30] hover:text-[#2c170d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting}
                className="px-5 py-2.5 bg-[#8b311e] hover:bg-[#a63c25] disabled:opacity-50 text-white rounded-xl font-serif text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting Row...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Permanently Delete
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
