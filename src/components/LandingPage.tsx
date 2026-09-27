import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Compass, Mail } from 'lucide-react';
import teddyJudath from '../assets/images/teddy_bear_judath_1790532074650.jpg';
import teddyKith from '../assets/images/teddy_bear_kith_1790532086458.jpg';

interface LandingPageProps {
  onSelectDoor: (door: 'judath' | 'kith_kin') => void;
  wishesCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectDoor, wishesCount }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-[#1c100a] text-[#fbf8f0]">
      {/* Subtle warm ambient lighting and vignette */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,143,76,0.18)_0%,rgba(44,22,12,0.85)_65%,rgba(20,10,6,0.98)_100%)]" 
      />

      {/* Subtle floating particles / stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-1/6 left-1/5 w-1.5 h-1.5 rounded-full bg-[#f4ecd8] animate-ping" />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-[#e3be75] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-[#d79450]/60 animate-bounce" />
        <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 rounded-full bg-[#f4ecd8] animate-pulse" />
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
      >
        {/* Decorative flourish */}
        <div className="flex items-center gap-3 text-[#d2a36d] text-sm tracking-widest uppercase mb-3 font-sans opacity-90">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#d2a36d]" />
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e5b376]" />
            A Special Celebration
            <Sparkles className="w-3.5 h-3.5 text-[#e5b376]" />
          </span>
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#d2a36d]" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#faeed9] tracking-tight mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-balance">
          🎂 A Birthday, Just for You 🎂
        </h1>

        {/* Subtitle */}
        <p className="font-handwriting text-2xl sm:text-3xl text-[#dfb88c] italic mb-10 tracking-wide">
          choose your door...
        </p>

        {/* Two Large Doors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 w-full max-w-2xl px-2">
          {/* DOOR 1: JUDATH */}
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group flex flex-col items-center cursor-pointer"
            onClick={() => onSelectDoor('judath')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectDoor('judath')}
          >
            {/* Cream Door Card */}
            <div className="w-full relative bg-[#fdf9ee] text-[#2c170d] rounded-2xl p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.65),0_0_0_1px_rgba(210,163,109,0.35)] border-2 border-[#e8d5b5] transition-all duration-300 group-hover:shadow-[0_20px_45px_rgba(217,143,76,0.35),0_0_0_2px_#d2a36d] group-hover:border-[#c58e4f]">
              {/* Corner vintage decorations */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#b0885a]/40 rounded-tl" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#b0885a]/40 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#b0885a]/40 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#b0885a]/40 rounded-br" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#f3e5cb] flex items-center justify-center mb-3 text-[#945f31] group-hover:bg-[#dfb88c] group-hover:text-[#2c170d] transition-colors shadow-inner">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-[#2e190e] mb-1">
                  JUDATH
                </h2>
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-widest text-[#945f31] uppercase">
                  Sister's Portal
                </span>
                
                {wishesCount > 0 && (
                  <span className="mt-3 text-xs text-[#a25927] font-medium bg-[#f5e6d0] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Mail className="w-3.5 h-3.5" />
                    {wishesCount} {wishesCount === 1 ? 'letter' : 'letters'} waiting
                  </span>
                )}
              </div>
            </div>

            {/* Cute Teddy Bear Underneath */}
            <div className="mt-4 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#d2a36d]/50 bg-[#28150c] p-1 group-hover:border-[#e5b376] transition-all">
                <img
                  src={teddyJudath}
                  alt="Cute birthday teddy bear for Judath"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-handwriting text-lg text-[#dfb88c] mt-2 tracking-wide">
                for the birthday girl 🌸
              </span>
            </div>
          </motion.div>

          {/* DOOR 2: KITH & KIN */}
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group flex flex-col items-center cursor-pointer"
            onClick={() => onSelectDoor('kith_kin')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectDoor('kith_kin')}
          >
            {/* Cream Door Card */}
            <div className="w-full relative bg-[#fdf9ee] text-[#2c170d] rounded-2xl p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.65),0_0_0_1px_rgba(210,163,109,0.35)] border-2 border-[#e8d5b5] transition-all duration-300 group-hover:shadow-[0_20px_45px_rgba(217,143,76,0.35),0_0_0_2px_#d2a36d] group-hover:border-[#c58e4f]">
              {/* Corner vintage decorations */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#b0885a]/40 rounded-tl" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#b0885a]/40 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#b0885a]/40 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#b0885a]/40 rounded-br" />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#f3e5cb] flex items-center justify-center mb-3 text-[#945f31] group-hover:bg-[#dfb88c] group-hover:text-[#2c170d] transition-colors shadow-inner">
                  <Heart className="w-6 h-6 fill-[#945f31] group-hover:fill-[#2c170d] transition-colors" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-[#2e190e] mb-1">
                  Kith &amp; Kin
                </h2>
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-widest text-[#945f31] uppercase">
                  Friends &amp; Family
                </span>
                
                <span className="mt-3 text-xs text-[#52321c] font-medium bg-[#f5e6d0] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  Leave a loving wish
                </span>
              </div>
            </div>

            {/* Cute Teddy Bear Underneath */}
            <div className="mt-4 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#d2a36d]/50 bg-[#28150c] p-1 group-hover:border-[#e5b376] transition-all">
                <img
                  src={teddyKith}
                  alt="Cute teddy bear holding a love letter"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-handwriting text-lg text-[#dfb88c] mt-2 tracking-wide">
                write your heart out 💌
              </span>
            </div>
          </motion.div>
        </div>

        {/* Quiet footer note */}
        <p className="mt-12 text-xs text-[#a98a72] font-sans opacity-70">
          Made with love for Judath's special day
        </p>
      </motion.div>
    </div>
  );
};
