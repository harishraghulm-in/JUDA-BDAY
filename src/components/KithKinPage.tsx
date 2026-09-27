import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Trash2,
  Heart,
  Sparkles,
  Settings,
  PlusCircle,
  Link2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Wish } from '../types';
import { GOOGLE_FORM_URL } from '../config';
import { IndividualWishModal } from './IndividualWishModal';
import { DeleteWishModal } from './DeleteWishModal';
import { SettingsModal } from './SettingsModal';
import { AddWishModal } from './AddWishModal';
import { getStoredScriptUrl, extractDriveFileId } from '../services/wishesService';
import polaroidPlaceholder from '../assets/images/polaroid_placeholder_1790532097729.jpg';

interface KithKinPageProps {
  wishes: Wish[];
  onBackToLanding: () => void;
  onRefresh: () => void;
  onDeleteWish: (id: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  onAddWish?: (wish: Wish) => void;
  isLoading?: boolean;
  isLive?: boolean;
}

export const KithKinPage: React.FC<KithKinPageProps> = ({
  wishes,
  onBackToLanding,
  onRefresh,
  onDeleteWish,
  onAddWish,
  isLoading = false,
  isLive = false,
}) => {
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Trigger celebratory golden confetti on page enter
  useEffect(() => {
    const goldPalette = ['#ffd700', '#f6c343', '#df9f38', '#fce293', '#b8860b', '#fff2b2'];
    
    // Wave 1: Gentle center-burst
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.25, x: 0.5 },
      colors: goldPalette,
      scalar: 0.9,
      ticks: 250,
      gravity: 0.8,
      startVelocity: 25,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });

    // Wave 2: Left corner soft shower
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.35 },
        colors: goldPalette,
        scalar: 0.85,
        ticks: 220,
        gravity: 0.7,
        startVelocity: 30,
      });
    }, 350);

    // Wave 3: Right corner soft shower
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.35 },
        colors: goldPalette,
        scalar: 0.85,
        ticks: 220,
        gravity: 0.7,
        startVelocity: 30,
      });
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scriptUrl = getStoredScriptUrl();

  // Organic slight rotation for polaroid effect
  const getRotation = (index: number) => {
    const rotations = [-1.5, 1.2, -0.8, 1.6, -1.2, 0.9, -1.8, 1.4];
    return rotations[index % rotations.length];
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1e110a] text-[#fbf8f0] pb-28">
      {/* Background vintage texture & subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,143,76,0.12)_0%,rgba(30,17,10,0.98)_65%)]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between py-4 border-b border-[#442717] mb-8">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a170d] hover:bg-[#3d2214] text-[#eedcb8] border border-[#5c3721] transition-all text-xs font-serif tracking-wide cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#d99f5e]" />
            <span>Return to Doors</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#341b10] hover:bg-[#462617] text-[#eedcb8] border border-[#643a22] transition-colors text-xs font-serif cursor-pointer shadow-sm"
              title="Add a wish directly"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#d99f5e]" />
              <span>Add Wish</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full bg-[#2a170d] hover:bg-[#3d2214] text-[#e3be8a] border border-[#5c3721] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh wishes from Google Sheet"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a170d] hover:bg-[#3d2214] text-[#be9b7d] hover:text-[#eedcb8] border border-[#5c3721] transition-colors text-xs cursor-pointer shadow-sm"
              title="Configure Google Sheet / Apps Script"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-serif">Data Source</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2d190f] border border-[#59341d] text-xs font-serif tracking-widest text-[#d99f5e] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Friends &amp; Family Scrapbook
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fcf6e8] tracking-tight mb-4 drop-shadow">
            💌 Wishes for Judath
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#c9a78a] leading-relaxed mb-8">
            Share your heartfelt birthday message, memories, and photos with Judath. Every wish you submit is delivered straight into her private birthday mailbox!
          </p>

          {/* LARGE "MAKE YOUR WISH" BUTTON */}
          <div className="flex flex-col items-center">
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-[#e8d2af] to-[#cba676] hover:from-[#f3e0c0] hover:to-[#d6b282] text-[#2c170d] font-serif text-lg sm:text-xl font-bold tracking-wide shadow-[0_12px_35px_rgba(217,143,76,0.35),0_0_0_2px_#eed7b5] hover:shadow-[0_16px_45px_rgba(235,175,60,0.5),0_0_0_3px_#f4e3c8] transition-all duration-300 hover:scale-103 active:scale-98 cursor-pointer"
            >
              <Heart className="w-6 h-6 fill-[#8f471b] text-[#8f471b] group-hover:scale-110 transition-transform" />
              <span>MAKE YOUR WISH</span>
              <ExternalLink className="w-5 h-5 text-[#8f471b] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <span className="font-handwriting text-xl text-[#dfb88c] mt-3">
              opens the private wish form 🌻
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center justify-between text-xs text-[#a88262] font-serif border-t border-[#381f12] pt-4 mb-8">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>
              {isLive
                ? 'Connected directly to Google Sheets'
                : 'Using cached wishes (click refresh or configure)'}
            </span>
          </div>
          <div>
            <span>{wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} collected</span>
          </div>
        </div>

        {/* Wishes Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#be9b7d]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#d99f5e] mb-3" />
            <p className="font-serif">Opening letters from mailbox...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#28150c]/60 border border-[#4d2c18]">
            <p className="font-serif text-lg text-[#ecd7b7] mb-2">No wishes in the mailbox yet!</p>
            <p className="text-xs text-[#a6805f] mb-4">Be the first to leave a message using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {wishes.map((wish, index) => {
              const rotation = getRotation(index);
              return (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="group relative bg-[#fdfbf6] text-[#2c170d] p-4 sm:p-5 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.8)] hover:scale-102 transition-all duration-300 border border-[#e2d5c3] cursor-pointer"
                  onClick={() => setSelectedWish(wish)}
                >
                  {/* Pushpin / Tape effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#eed7b5]/75 border border-[#c9aa7f]/50 backdrop-blur-xs transform -rotate-2 pointer-events-none shadow-xs" />

                  {/* Photo area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#24130a] mb-4 rounded-xs border border-[#ddd0bc]">
                    <img
                      src={wish.photoUrl || polaroidPlaceholder}
                      alt={wish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const currentSrc = img.src;
                        const fileId = extractDriveFileId(wish.photoUrl || '');
                        if (fileId && !currentSrc.includes('drive.google.com/thumbnail')) {
                          img.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
                        } else if (fileId && !currentSrc.includes('drive.google.com/uc')) {
                          img.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
                        } else {
                          img.src = polaroidPlaceholder;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-white text-xs font-serif flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Read letter
                      </span>
                    </div>
                  </div>

                  {/* Wish Message Excerpt */}
                  <p className="font-handwriting text-xl sm:text-2xl text-[#361e12] leading-snug line-clamp-3 mb-4 min-h-[4rem]">
                    "{wish.wish}"
                  </p>

                  {/* Sender Details */}
                  <div className="border-t border-[#eedfc9] pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-sm text-[#231209]">
                        {wish.name}
                      </p>
                      <p className="font-sans text-[11px] text-[#855737]">
                        {wish.relationship || 'Loved One'}
                      </p>
                    </div>

                    {/* Admin Delete Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWishToDelete(wish);
                      }}
                      className="p-1.5 rounded-full hover:bg-[#ecd7ba] text-[#936442] hover:text-[#88211b] transition-colors cursor-pointer"
                      title="Delete this wish (Admin PIN required)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedWish && (
        <IndividualWishModal
          wish={selectedWish}
          onClose={() => setSelectedWish(null)}
          onDelete={(id, pin) => onDeleteWish(id, pin)}
        />
      )}

      {wishToDelete && (
        <DeleteWishModal
          wishName={wishToDelete.name}
          onClose={() => setWishToDelete(null)}
          onConfirm={async (pin) => {
            const res = await onDeleteWish(wishToDelete.id, pin);
            if (res.success) {
              setWishToDelete(null);
            }
            return res;
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSave={() => {
            setIsSettingsOpen(false);
            onRefresh();
          }}
        />
      )}

      {isAddModalOpen && (
        <AddWishModal
          onClose={() => setIsAddModalOpen(false)}
          onAddWish={(wish) => {
            if (onAddWish) onAddWish(wish);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default KithKinPage;
