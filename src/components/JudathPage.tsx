import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Sparkles, Volume2, VolumeX, Eye } from 'lucide-react';
import { Wish } from '../types';
import { MailboxWishView } from './MailboxWishView';
import judathBg from '../assets/images/judath_background_1790532062287.jpg';

interface JudathPageProps {
  wishes: Wish[];
  onBackToLanding: () => void;
  onRefreshWishes: () => void;
  onDeleteWish?: (id: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  isLoadingWishes?: boolean;
}

export const JudathPage: React.FC<JudathPageProps> = ({
  wishes,
  onBackToLanding,
  onRefreshWishes,
  onDeleteWish,
  isLoadingWishes = false,
}) => {
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [isHoveringMailbox, setIsHoveringMailbox] = useState(false);

  // Four distinct realistic curved flight paths over the map
  // Route 1: North America to Europe
  const flightRoute1 = 'M 260 360 C 440 240, 680 230, 930 330';
  // Route 2: Europe across Mediterranean down into Africa
  const flightRoute2 = 'M 960 340 C 920 480, 840 600, 1040 850';
  // Route 3: West Coast downward into South America
  const flightRoute3 = 'M 240 440 C 340 540, 420 660, 560 840';
  // Route 4: South America diagonal across Atlantic towards Europe/Near East
  const flightRoute4 = 'M 590 820 C 740 640, 860 480, 1150 480';

  return (
    <div className="relative min-h-screen w-full bg-[#120a06] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Top Floating Controls */}
      <header className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#20110a]/85 hover:bg-[#341b10] text-[#f4ecd8] border border-[#6b4226]/60 backdrop-blur-md shadow-lg transition-all hover:scale-102 cursor-pointer font-serif text-xs sm:text-sm tracking-wide"
        >
          <ArrowLeft className="w-4 h-4 text-[#d99f5e]" />
          <span>Doors</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick mailbox trigger on top bar */}
          <button
            onClick={() => setIsMailboxOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8d7bb] hover:bg-[#f5ebd8] text-[#2c170d] shadow-lg border border-[#cba271] transition-all hover:scale-103 cursor-pointer font-serif text-xs sm:text-sm font-semibold"
          >
            <Mail className="w-4 h-4 text-[#8f471b]" />
            <span>Open Mailbox ({wishes.length})</span>
          </button>
        </div>
      </header>

      {/* 16:9 Artwork Canvas Container */}
      <main className="relative w-full max-w-[1720px] aspect-[16/9] shadow-[0_20px_70px_rgba(0,0,0,0.95)] rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border sm:border-[#4d2f1d]/50 bg-[#1e1008] my-auto">
        {/* The Exact Supplied Background Artwork */}
        <img
          src={judathBg}
          alt="Judath Birthday Vintage Map and Painting"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Dynamic Flight Routes & Airplanes SVG Layer */}
        <svg
          viewBox="0 0 1920 1080"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        >
          <defs>
            {/* Soft glow for contrails */}
            <filter id="contrailGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Faint animated dashed flight path lines */}
          <path
            d={flightRoute1}
            fill="none"
            stroke="#9f764a"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.35"
          />
          <path
            d={flightRoute2}
            fill="none"
            stroke="#9f764a"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.3"
          />
          <path
            d={flightRoute3}
            fill="none"
            stroke="#9f764a"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.3"
          />
          <path
            d={flightRoute4}
            fill="none"
            stroke="#9f764a"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.3"
          />

          {/* Airplane 1 (Transatlantic route) */}
          <g>
            <animateMotion
              path={flightRoute1}
              dur="22s"
              repeatCount="indefinite"
              rotate="auto"
            />
            {/* Vintage Airplane Silhouette */}
            <g transform="scale(0.85) translate(-15, -12)">
              {/* Airplane body and wings */}
              <path
                d="M 28 12 L 18 10 L 14 3 L 11 3 L 13 10 L 4 10 L 2 7 L 0 7 L 1 12 L 0 17 L 2 17 L 4 14 L 13 14 L 11 21 L 14 21 L 18 14 L 28 12 Z"
                fill="#3d281a"
                opacity="0.8"
                filter="url(#contrailGlow)"
              />
              <circle cx="28" cy="12" r="1.5" fill="#d99f5e" opacity="0.9" />
            </g>
          </g>

          {/* Airplane 2 (European-African route) */}
          <g>
            <animateMotion
              path={flightRoute2}
              dur="28s"
              begin="-8s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <g transform="scale(0.75) translate(-15, -12)">
              <path
                d="M 28 12 L 18 10 L 14 3 L 11 3 L 13 10 L 4 10 L 2 7 L 0 7 L 1 12 L 0 17 L 2 17 L 4 14 L 13 14 L 11 21 L 14 21 L 18 14 L 28 12 Z"
                fill="#4a3120"
                opacity="0.75"
              />
            </g>
          </g>

          {/* Airplane 3 (Americas southward route) */}
          <g>
            <animateMotion
              path={flightRoute3}
              dur="24s"
              begin="-14s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <g transform="scale(0.7) translate(-15, -12)">
              <path
                d="M 28 12 L 18 10 L 14 3 L 11 3 L 13 10 L 4 10 L 2 7 L 0 7 L 1 12 L 0 17 L 2 17 L 4 14 L 13 14 L 11 21 L 14 21 L 18 14 L 28 12 Z"
                fill="#4a3120"
                opacity="0.75"
              />
            </g>
          </g>

          {/* Airplane 4 (South America to East route) */}
          <g>
            <animateMotion
              path={flightRoute4}
              dur="26s"
              begin="-5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <g transform="scale(0.8) translate(-15, -12)">
              <path
                d="M 28 12 L 18 10 L 14 3 L 11 3 L 13 10 L 4 10 L 2 7 L 0 7 L 1 12 L 0 17 L 2 17 L 4 14 L 13 14 L 11 21 L 14 21 L 18 14 L 28 12 Z"
                fill="#362215"
                opacity="0.8"
              />
            </g>
          </g>
        </svg>

        {/* INTERACTIVE MAILBOX HOTSPOT (Precisely over the artwork's mailbox at bottom-left) */}
        <div
          className="absolute z-20 cursor-pointer group"
          style={{
            top: '51%',
            left: '5%',
            width: '18%',
            height: '44%',
          }}
          onMouseEnter={() => setIsHoveringMailbox(true)}
          onMouseLeave={() => setIsHoveringMailbox(false)}
          onClick={() => setIsMailboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Open Birthday Mailbox"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsMailboxOpen(true)}
        >
          {/* Glowing Aura when approached/hovered */}
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
              isHoveringMailbox
                ? 'opacity-100 animate-pulse-glow shadow-[0_0_50px_rgba(235,175,60,0.7)]'
                : 'opacity-40 hover:opacity-80'
            }`}
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(245,200,90,0.28) 0%, rgba(212,143,56,0.12) 60%, transparent 80%)',
            }}
          />

          {/* Mailbox Floating Tooltip / Hint */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none flex flex-col items-center whitespace-nowrap ${
              isHoveringMailbox ? 'opacity-100 -translate-y-2' : 'opacity-85 sm:opacity-0 group-hover:opacity-100'
            }`}
          >
            <div className="px-3.5 py-1.5 rounded-full bg-[#fdfaf1] text-[#2c170d] text-xs font-serif font-semibold tracking-wide shadow-[0_6px_20px_rgba(0,0,0,0.5)] border border-[#d9ba8c] flex items-center gap-1.5">
              <span>💌 Open your wishes</span>
              {wishes.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#9f4e1f] text-white text-[10px] font-sans flex items-center justify-center font-bold">
                  {wishes.length}
                </span>
              )}
            </div>
            {/* Tooltip triangle */}
            <div className="w-2.5 h-2.5 bg-[#fdfaf1] border-r border-b border-[#d9ba8c] rotate-45 -mt-1.5" />
          </div>

          {/* Tactile indicator for mobile touch devices */}
          <div className="absolute top-4 right-4 sm:hidden bg-[#24130a]/80 text-[#eed9b6] p-1.5 rounded-full backdrop-blur-xs">
            <Mail className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </main>

      {/* Bottom Hint Banner for Judath */}
      <footer className="mt-3 text-center pointer-events-none text-xs text-[#b89574] font-serif">
        ✨ Hover or tap the rustic mailbox at the bottom left to open your letters
      </footer>

      {/* Mailbox Wishes Gallery Modal */}
      {isMailboxOpen && (
        <MailboxWishView
          wishes={wishes}
          onClose={() => setIsMailboxOpen(false)}
          onRefresh={onRefreshWishes}
          onDeleteWish={onDeleteWish}
          isLoading={isLoadingWishes}
        />
      )}
    </div>
  );
};
