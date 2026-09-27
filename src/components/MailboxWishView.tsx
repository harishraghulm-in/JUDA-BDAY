import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Mail, Heart, RefreshCw, Trash2 } from 'lucide-react';
import { Wish } from '../types';
import { IndividualWishModal } from './IndividualWishModal';
import { DeleteWishModal } from './DeleteWishModal';
import polaroidPlaceholder from '../assets/images/polaroid_placeholder_1790532097729.jpg';

interface MailboxWishViewProps {
  wishes: Wish[];
  onClose: () => void;
  onRefresh?: () => void;
  onDeleteWish?: (id: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  isLoading?: boolean;
}

export const MailboxWishView: React.FC<MailboxWishViewProps> = ({
  wishes,
  onClose,
  onRefresh,
  onDeleteWish,
  isLoading = false,
}) => {
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);

  return (
    <div className="fixed inset-0 z-40 bg-[#160d08]/95 backdrop-blur-md overflow-y-auto text-[#fbf8f0]">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(217,143,76,0.15)_0%,rgba(22,13,8,0.95)_70%)]"
      />

      <div className="relative min-h-screen flex flex-col max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#4d2d1b] pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#d49f67] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#e5b376]" />
              Judath's Special Delivery
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fcf6e8] tracking-tight">
              💌 Your Birthday Wishes
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2.5 rounded-full bg-[#2a170d] text-[#e3be8a] hover:bg-[#3d2214] border border-[#5a3620] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                title="Check for new wishes"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#2a170d] text-[#f4ecd8] hover:bg-[#422212] border border-[#5a3620] transition-colors cursor-pointer shadow-sm"
              title="Return to the map"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Subtitle count indicator */}
        <div className="mb-8 flex items-center justify-between text-sm text-[#c8a587]">
          <p className="font-sans">
            Showing <span className="font-serif text-base text-[#e5b376] font-semibold">{wishes.length}</span> loving letters delivered to your mailbox
          </p>
          <p className="font-handwriting text-xl text-[#dfb88c] hidden sm:block">
            tap any square to open the memory ✨
          </p>
        </div>

        {/* Wishes Grid */}
        {wishes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#25150d]/60 rounded-2xl border border-[#4a2b1a]">
            <Mail className="w-16 h-16 text-[#8b562a] mb-4 animate-float-gentle" />
            <h3 className="font-serif text-2xl text-[#faeed9] mb-2">The mailbox is resting quietly</h3>
            <p className="text-[#be9b7d] max-w-md text-sm font-sans">
              No letters have arrived yet. Invite your friends and family to visit Kith &amp; Kin to submit their birthday messages!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {wishes.map((w, index) => (
              <motion.div
                key={w.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedWish(w)}
                className="group relative cursor-pointer bg-[#fcf8ee] text-[#2c170d] rounded-xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.65)] border-2 border-[#e8d7bb] transition-all hover:border-[#d99f5e] hover:shadow-[0_14px_35px_rgba(217,143,76,0.3)] flex flex-col"
              >
                {/* Vintage tape / corner badge */}
                <div className="absolute -top-2 right-4 w-10 h-4 bg-[#e2c79b]/70 backdrop-blur-xs border-y border-[#be9a61]/40 rounded-xs shadow-xs rotate-2" />

                {/* TOP: Uploaded Image (Square) */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#ecdcc4] relative border border-[#dfc8a5]">
                  <img
                    src={w.image || polaroidPlaceholder}
                    alt={w.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = polaroidPlaceholder;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-xs font-sans font-medium flex items-center gap-1 drop-shadow">
                      <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                      Read wish
                    </span>
                  </div>
                </div>

                {/* BOTTOM: Wisher's Name */}
                <div className="pt-3 pb-1 text-center flex flex-col items-center">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2c170d] truncate max-w-full group-hover:text-[#944e1b] transition-colors">
                    {w.name}
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#845d3e]">
                    {w.relationship || 'Loved One'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Map button at bottom */}
        <div className="mt-12 text-center pb-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#2a170d] hover:bg-[#3d2214] border border-[#5a3620] text-[#eed8b3] font-serif text-sm tracking-wide transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            ← Return to Vintage Map
          </button>
        </div>
      </div>

      {/* Individual Wish Modal */}
      <IndividualWishModal
        wish={selectedWish}
        onClose={() => setSelectedWish(null)}
        onDeleteWish={
          onDeleteWish
            ? (wish) => {
                setSelectedWish(null);
                setWishToDelete(wish);
              }
            : undefined
        }
      />

      {/* Delete Wish Modal */}
      {onDeleteWish && (
        <DeleteWishModal
          wish={wishToDelete}
          onClose={() => setWishToDelete(null)}
          onConfirmDelete={onDeleteWish}
        />
      )}
    </div>
  );
};
