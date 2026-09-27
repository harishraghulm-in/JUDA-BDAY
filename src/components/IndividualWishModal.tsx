import React from 'react';
import { Wish, extractDriveFileId } from '../services/wishesService';

interface IndividualWishModalProps {
  wish: Wish;
  onClose: () => void;
}

export const IndividualWishModal: React.FC<IndividualWishModalProps> = ({ wish, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full bg-[#fdfbf7] text-amber-950 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-amber-900/20 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#ebd9b3 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner ribbons */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-700/80 rotate-45 flex items-end justify-center pb-1 text-white text-[10px] font-bold tracking-widest shadow-md">
          25TH
        </div>

        {/* Vintage Postmark stamp */}
        <div className="flex justify-between items-start border-b border-amber-900/20 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-amber-800/70">Special Delivery For Judath</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
              {wish.name}
            </h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-amber-800/10 text-amber-900 rounded-full text-xs font-serif italic border border-amber-900/15">
              {wish.relationship}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 flex items-center justify-center text-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          {wish.photoUrl && (
            <div className="w-full md:w-56 shrink-0 bg-white p-3 rounded-lg shadow-md border border-amber-900/15 transform -rotate-1 hover:rotate-0 transition duration-300">
              <div className="w-full aspect-[4/5] overflow-hidden rounded bg-amber-50">
                <img
                  src={wish.photoUrl}
                  alt={wish.name}
                  className="w-full h-full object-cover"
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
              <p className="text-center font-serif text-[11px] text-amber-900/70 mt-2 italic">
                {wish.name} & Judath
              </p>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between">
            <div className="relative">
              <span className="text-5xl font-serif text-amber-800/20 absolute -top-4 -left-2 select-none">“</span>
              <p className="font-serif text-stone-800 text-base md:text-lg leading-relaxed relative z-10 pt-2 whitespace-pre-line italic">
                {wish.wish}
              </p>
              <span className="text-5xl font-serif text-amber-800/20 float-right select-none">”</span>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs font-mono text-amber-900/60">
              <span>With all our love</span>
              <span>{new Date(wish.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-amber-900/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-900 text-amber-100 hover:bg-amber-950 rounded-xl font-serif text-sm transition shadow"
          >
            Close Letter
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndividualWishModal;
