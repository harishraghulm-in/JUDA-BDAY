import React, { useState } from 'react';
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
import { getStoredScriptUrl } from '../services/wishesService';
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

        {/* DATA SOURCE & LIVE STATUS BANNER */}
        <div className="mb-10 max-w-3xl mx-auto">
          {isLive ? (
            <div className="p-4 rounded-xl bg-[#26170e] border border-[#5a3822] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-emerald-300 font-serif font-medium">Live Responses Connected:</span>{' '}
                  <span className="text-[#e2cbb2]">Displaying real wishes synced from Google Sheet ({wishes.length} wishes)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="px-3 py-1 bg-[#3a2012] hover:bg-[#4f2c1a] text-[#eedcb8] rounded-lg border border-[#6b3e24] cursor-pointer"
                >
                  Sync Now
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1 bg-[#3a2012] hover:bg-[#4f2c1a] text-[#eedcb8] rounded-lg border border-[#6b3e24] cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#2c170d] border border-[#6b3e23] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-md">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#422111] flex items-center justify-center text-[#d99f5e] shrink-0 border border-[#64351d]">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif text-[#f2e1c3] font-medium text-sm">
                    {scriptUrl ? 'Loading or verifying Google responses...' : 'Displaying Sample Preview Wishes'}
                  </div>
                  <p className="text-[#bfa286] text-[11px] leading-relaxed mt-0.5">
                    Submissions from your Google Form (
                    <a
                      href={GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[#e2b07e]"
                    >
                      forms.gle/mtDTG3BV6nRyZW7L7
                    </a>
                    ) are stored in its linked Google Sheet. Connect the Sheet or Apps Script to display live responses automatically!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 bg-[#d99f5e] hover:bg-[#ebaf6c] text-[#2c170d] font-serif font-bold rounded-lg shadow-sm cursor-pointer whitespace-nowrap transition-colors"
                >
                  Connect Sheet
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-2 bg-[#3e2213] hover:bg-[#522d19] text-[#e8d2af] font-serif rounded-lg border border-[#693c21] cursor-pointer whitespace-nowrap"
                >
                  + Add Wish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wishes Section Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#3d2315] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-semibold text-[#f7eee1]">
              Shared Memories
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#351c10] text-xs font-mono text-[#d99f5e] border border-[#52301c]">
              {wishes.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#a9876c] font-sans hidden sm:inline">
              Click any card to read full wish
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-[#dfb88c] hover:underline font-serif cursor-pointer"
            >
              + Write a wish
            </button>
          </div>
        </div>

        {/* Polaroid Wish Cards Grid */}
        {wishes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#26150d]/60 rounded-2xl border border-[#442717] max-w-lg mx-auto">
            <p className="font-serif text-xl text-[#eedcb8] mb-2">No wishes to display yet</p>
            <p className="text-xs text-[#b89574] mb-6">
              Be the first to leave a wish for Judath by clicking "MAKE YOUR WISH" above!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#8b311e] hover:bg-[#a63c25] text-white font-serif text-xs uppercase tracking-wider cursor-pointer"
            >
              Write Wish Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishes.map((w, index) => {
              const rotationDeg = getRotation(index);
              return (
                <motion.div
                  key={w.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{ transform: `rotate(${rotationDeg}deg)` }}
                  className="group relative bg-[#fdf9ef] text-[#2c170d] p-4 pb-4 rounded-lg shadow-[0_12px_28px_rgba(0,0,0,0.65)] border border-[#e8dac2] transition-all hover:shadow-[0_18px_40px_rgba(217,143,76,0.35)] flex flex-col cursor-pointer"
                  onClick={() => setSelectedWish(w)}
                >
                  {/* Washi tape accent on top */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#e5cfab]/80 backdrop-blur-xs border-y border-[#cbb085]/60 shadow-xs rotate-[-1deg]" />

                  {/* Corner Delete quick button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishToDelete(w);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#f2e1c3] text-[#744726] hover:bg-[#8b311e] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer z-10"
                    title="Delete this wish (Admin PIN)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Polaroid Image Box */}
                  <div className="w-full aspect-square rounded overflow-hidden bg-[#faf3e7] relative mb-3 border border-[#ece0cc] flex items-center justify-center">
                    {w.image ? (
                      <img
                        src={w.image}
                        alt={`Memory with ${w.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = polaroidPlaceholder;
                        }}
                      />
                    ) : (
                      <img
                        src={polaroidPlaceholder}
                        alt="Vintage memory"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85"
                      />
                    )}
                  </div>

                  {/* Polaroid Label Section */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-baseline justify-between gap-1 mb-1">
                      <h3 className="font-handwriting text-2xl font-medium text-[#2c170d] truncate">
                        {w.name}
                      </h3>
                      <span className="font-serif italic text-xs text-[#8c674a] shrink-0">
                        {w.relationship || 'Friend'}
                      </span>
                    </div>

                    {w.wish && (
                      <p className="font-serif text-xs text-[#52331f] line-clamp-2 italic mb-3 opacity-90 leading-relaxed">
                        "{w.wish}"
                      </p>
                    )}

                    {/* ACTION BUTTONS ROW: Read Wish + Delete */}
                    <div className="mt-auto pt-2 border-t border-[#e8dbc6] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-serif text-[#844b20] group-hover:text-[#b35a1a] flex items-center gap-1 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Wish</span>
                      </span>

                      {/* CLEAR, ALWAYS VISIBLE DELETE OPTION */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWishToDelete(w);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#fae8e5] hover:bg-[#8b311e] text-[#9c2d1b] hover:text-white transition-colors text-[11px] font-serif font-medium cursor-pointer shadow-2xs"
                        title="Delete wish permanently (Admin PIN required)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Make Wish Reminder */}
        <div className="mt-16 text-center">
          <p className="font-handwriting text-2xl text-[#dfb88c] mb-3">
            Want to share a sweet memory with Judath?
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2a170d] hover:bg-[#3d2214] text-[#eedcb8] border border-[#5c3721] text-xs font-serif tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
          >
            <span>Open Google Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Individual Wish Modal */}
      <IndividualWishModal
        wish={selectedWish}
        onClose={() => setSelectedWish(null)}
        onDeleteWish={(wish) => setWishToDelete(wish)}
      />

      {/* Delete Wish Confirmation Modal */}
      <DeleteWishModal
        wish={wishToDelete}
        onClose={() => setWishToDelete(null)}
        onConfirmDelete={onDeleteWish}
      />

      {/* Data Source Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={onRefresh}
      />

      {/* Add Custom Wish Modal */}
      <AddWishModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onWishAdded={(newWish) => {
          if (onAddWish) {
            onAddWish(newWish);
          }
          onRefresh();
        }}
      />
    </div>
  );
};
