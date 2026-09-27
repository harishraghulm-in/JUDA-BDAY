import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Trash2 } from 'lucide-react';
import { Wish } from '../types';
import polaroidPlaceholder from '../assets/images/polaroid_placeholder_1790532097729.jpg';

interface IndividualWishModalProps {
  wish: Wish | null;
  onClose: () => void;
  onDeleteWish?: (wish: Wish) => void;
}

export const IndividualWishModal: React.FC<IndividualWishModalProps> = ({
  wish,
  onClose,
  onDeleteWish,
}) => {
  if (!wish) return null;

  // Format relationship and name: "Your Brother Victor wished you…"
  const relationshipLabel = wish.relationship ? wish.relationship.trim() : 'Friend';
  const nameLabel = wish.name ? wish.name.trim() : 'Someone special';

  // Clean up if relationship starts with "Your" already
  const greetingHeader = relationshipLabel.toLowerCase().startsWith('your ')
    ? `${relationshipLabel} ${nameLabel} wished you…`
    : `Your ${relationshipLabel} ${nameLabel} wished you…`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f0704]/80 backdrop-blur-sm"
        />

        {/* Modal Parchment Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl bg-[#fcf8ee] text-[#2c170d] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(210,163,109,0.4)] border-2 border-[#e6d3b3] my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2e2c4] text-[#4a2b16] hover:bg-[#dfc499] hover:text-[#2c170d] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Close wish modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#b0885a]/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#b0885a]/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#b0885a]/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#b0885a]/50" />

          {/* Wax seal / stamp decoration */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f4e6ce] rounded-full border border-[#d9ba8c]/60 text-xs font-serif tracking-widest text-[#844b20] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#c47b35]" />
              A Loving Birthday Memory
              <Sparkles className="w-3.5 h-3.5 text-[#c47b35]" />
            </div>
          </div>

          {/* Dynamic Header */}
          <h2 className="font-serif text-2xl sm:text-3xl text-center font-semibold text-[#30190c] mb-6 leading-tight">
            {greetingHeader}
          </h2>

          {/* Wish Message in elegant quotes / handwriting style */}
          <div className="relative bg-[#f8f1de] p-5 sm:p-6 rounded-xl border border-[#e5d4b5] shadow-inner mb-6">
            <span className="absolute top-1 left-2 font-serif text-4xl text-[#cba271]/50 leading-none select-none">
              “
            </span>
            <p className="font-serif text-lg sm:text-xl text-[#3b2112] italic leading-relaxed px-4 text-center">
              {wish.wish || 'Wishing you boundless joy, love, peace, and blessings on your birthday!'}
            </p>
            <span className="absolute bottom-1 right-3 font-serif text-4xl text-[#cba271]/50 leading-none select-none">
              ”
            </span>
          </div>

          {/* Memory Intro */}
          <div className="text-center mb-4">
            <p className="font-handwriting text-2xl sm:text-3xl text-[#925424] font-medium">
              And here is your memory with {nameLabel}… 💛
            </p>
          </div>

          {/* Memory Image Polaroid Frame */}
          <div className="relative mx-auto max-w-sm bg-white p-3.5 pb-5 rounded-lg shadow-[0_12px_28px_rgba(0,0,0,0.25)] border border-[#e8dbc6] transform rotate-[-0.8deg] transition-transform hover:rotate-0">
            {/* Washi tape accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#eed7ad]/80 backdrop-blur-xs border-y border-[#d2b581]/50 shadow-xs rotate-[-1.5deg]" />

            <div className="w-full aspect-square rounded overflow-hidden bg-[#faf3e7] relative flex items-center justify-center border border-[#ece0cc]">
              {wish.image ? (
                <img
                  src={wish.image}
                  alt={`Memory with ${nameLabel}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = polaroidPlaceholder;
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#fdfaf2]">
                  <img
                    src={polaroidPlaceholder}
                    alt="Vintage memory placeholder"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              )}
            </div>

            {/* Handwritten name on polaroid bottom */}
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-handwriting text-2xl text-[#2c170d]">{nameLabel}</span>
              <span className="font-serif italic text-xs text-[#8c674a]">{relationshipLabel}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#422212] hover:bg-[#5a311b] text-[#fbf7ee] rounded-xl font-serif text-sm tracking-wide shadow-md transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#d28f52] text-[#d28f52]" />
              Keep in My Heart
            </button>

            {onDeleteWish && (
              <button
                onClick={() => {
                  onClose();
                  onDeleteWish(wish);
                }}
                className="px-4 py-2.5 bg-[#fae8e5] hover:bg-[#f5d3cd] text-[#9c2d1b] border border-[#e5a89e] rounded-xl font-serif text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Delete this wish with Admin PIN"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Wish</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
