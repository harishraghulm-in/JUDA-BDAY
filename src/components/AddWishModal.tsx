import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Sparkles, Image as ImageIcon, Send } from 'lucide-react';
import { Wish } from '../types';
import { saveCustomLocalWish } from '../services/wishesService';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWishAdded: (wish: Wish) => void;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose, onWishAdded }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [wishText, setWishText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) return;

    setIsSubmitting(true);
    const newWish: Wish = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim() || 'Friend',
      wish: wishText.trim(),
      image: imageUrl.trim(),
      timestamp: new Date().toISOString(),
    };

    saveCustomLocalWish(newWish);
    onWishAdded(newWish);
    setIsSubmitting(false);
    onClose();
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

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg bg-[#fcf8ee] text-[#2c170d] rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-2 border-[#e6d3b3]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#725239] hover:text-[#2c170d] p-1.5 rounded-full hover:bg-[#eedfc4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#fcedea] flex items-center justify-center text-[#943f21] border border-[#e8bbb0]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2c170d]">
                Write a Birthday Wish
              </h3>
              <p className="text-xs text-[#7c5a41]">Add directly to Judath's memory album</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Victor, Grandma..."
                  className="w-full px-3.5 py-2 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-xs text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1">
                  Relationship with Her *
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-xs text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b]"
                >
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Friend">Friend</option>
                  <option value="Best Friend">Best Friend</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Family">Family</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1">
                Your Birthday Wish *
              </label>
              <textarea
                required
                rows={3}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your heartfelt message to Judath..."
                className="w-full px-3.5 py-2 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-xs text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-[#68472f] mb-1 flex items-center justify-between">
                <span>Memorable Image URL (Optional)</span>
                <span className="text-[10px] text-[#9b7657] font-sans lowercase">Google Drive or photo link</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or image URL"
                  className="w-full pl-9 pr-3.5 py-2 bg-[#f6eee0] border border-[#d9c4a4] rounded-xl text-xs text-[#2c170d] focus:outline-hidden focus:ring-2 focus:ring-[#944e1b] font-mono text-[11px]"
                />
                <ImageIcon className="w-4 h-4 text-[#8a684f] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-serif text-[#6c4a30] hover:text-[#2c170d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !wishText.trim()}
                className="px-5 py-2.5 bg-[#8b311e] hover:bg-[#a63c25] disabled:opacity-50 text-white rounded-xl font-serif text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Post Wish
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
