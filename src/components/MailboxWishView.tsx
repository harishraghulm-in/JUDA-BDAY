import React, { useState } from 'react';
import { Wish, extractDriveFileId } from '../services/wishesService';
import IndividualWishModal from './IndividualWishModal';

interface MailboxWishViewProps {
  wishes: Wish[];
  onClose: () => void;
}

export const MailboxWishView: React.FC<MailboxWishViewProps> = ({ wishes, onClose }) => {
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-amber-950/85 backdrop-blur-md flex flex-col p-4 md:p-8 animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
            📫
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-amber-100 tracking-wide font-bold">
              Judath's Birthday Mailbox
            </h2>
            <p className="text-amber-300/80 text-xs md:text-sm font-sans">
              Letters, blessings, and warm memories from your loved ones ({wishes.length})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 rounded-xl transition font-sans text-sm flex items-center gap-2 shadow"
        >
          <span>✕</span>
          <span className="hidden sm:inline">Back to Map</span>
        </button>
      </div>

      {/* Grid of Wish Postcards / Letters */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {wishes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4 opacity-70">📭</div>
            <p className="text-amber-200 text-lg font-serif">The mailbox is resting quietly.</p>
            <p className="text-amber-300/60 text-sm mt-1">When family submit letters, they will arrive here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
            {wishes.map((wish, index) => {
              const rotation = (index % 5 - 2) * 1.5;
              return (
                <div
                  key={wish.id || index}
                  onClick={() => setSelectedWish(wish)}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="group relative cursor-pointer bg-gradient-to-b from-[#fdfbf7] to-[#f4ecd8] text-amber-950 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-amber-900/20 flex flex-col justify-between"
                >
                  {/* Vintage Postmark Stamp Top Right */}
                  <div className="absolute top-2 right-2 flex flex-col items-end opacity-75 group-hover:opacity-100 transition">
                    <div className="w-9 h-11 border-2 border-dashed border-red-800/60 bg-red-50/80 rounded flex flex-col items-center justify-center text-[9px] font-mono text-red-900 leading-tight">
                      <span>★ 25 ★</span>
                      <span className="text-[7px]">AIR MAIL</span>
                    </div>
                  </div>

                  <div>
                    {/* Photo or Vintage Stamp Header */}
                    {wish.photoUrl ? (
                      <div className="w-full h-40 overflow-hidden rounded-lg border border-amber-900/10 mb-3 bg-amber-100 shadow-inner">
                        <img
                          src={wish.photoUrl}
                          alt={wish.name}
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
                              img.src = '/assets/polaroid_placeholder_1790532097729.jpg';
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-lg bg-amber-200/50 border border-amber-900/10 mb-3 flex items-center justify-center text-3xl opacity-60">
                        💌
                      </div>
                    )}

                    {/* Sender Identity */}
                    <div className="mb-2">
                      <h3 className="font-serif font-bold text-lg text-amber-950 group-hover:text-amber-900 leading-snug">
                        {wish.name}
                      </h3>
                      <p className="text-xs font-serif italic text-amber-800/80">
                        {wish.relationship}
                      </p>
                    </div>

                    {/* Letter excerpt */}
                    <p className="font-serif text-sm text-stone-700 line-clamp-3 leading-relaxed italic">
                      "{wish.wish}"
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-amber-900/15 flex items-center justify-between text-[11px] text-amber-900/60 font-mono">
                    <span>Click to read</span>
                    <span>✉ Open ➔</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Reading Modal */}
      {selectedWish && (
        <IndividualWishModal
          wish={selectedWish}
          onClose={() => setSelectedWish(null)}
        />
      )}
    </div>
  );
};

export default MailboxWishView;
