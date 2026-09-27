import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Send, 
  RefreshCw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Plus, 
  Calendar,
  Trash2
} from 'lucide-react';
import { getWishes, getStoredScriptUrl, deleteWishRemotely, extractDriveFileId, Wish } from '../services/wishesService';
import AddWishModal from './AddWishModal';
import DeleteWishModal from './DeleteWishModal';
import { GOOGLE_FORM_URL } from '../config';

const AUDIO_SRC = 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3';
const POLAROID_FALLBACK_IMAGE = '/assets/polaroid_placeholder_1790532097729.jpg';

interface KithKinPageProps {
  onBack: () => void;
}

export const KithKinPage: React.FC<KithKinPageProps> = ({ onBack }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio(AUDIO_SRC));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [wishToDelete, setWishToDelete] = useState<Wish | null>(null);

  // Load wishes
  const loadWishes = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const data = await getWishes(refresh);
      setWishes(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWishes();

    audio.loop = true;
    audio.volume = 0.4;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Perform permanent delete
  const handleDeleteWish = async (pin: string) => {
    if (!wishToDelete) return;

    await deleteWishRemotely({
      pin,
      rowNumber: wishToDelete.rowNumber,
      id: wishToDelete.id,
      name: wishToDelete.name,
      timestamp: wishToDelete.timestamp
    });

    // Remove from local view
    setWishes(prev => prev.filter(w => w.id !== wishToDelete.id));
    setWishToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-800 font-sans selection:bg-amber-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-900/10 px-4 py-3 sm:px-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-900 hover:text-amber-950 font-serif font-medium text-sm sm:text-base group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Exit to Entrance</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Form Link */}
          {GOOGLE_FORM_URL && (
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-serif transition border border-amber-300"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Form</span>
            </a>
          )}

          {/* Add Wish Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full font-serif shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Wish</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadWishes(true)}
            disabled={isRefreshing}
            className={`p-2 rounded-full hover:bg-amber-100 text-amber-900 transition ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Wishes"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full hover:bg-amber-100 text-amber-900 transition"
            title={isPlaying ? 'Mute Music' : 'Play Music'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-8 text-center bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-transparent">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200/60 text-amber-950 rounded-full text-xs font-serif tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Celebration Scrapbook</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-950 tracking-tight">
            Kith & Kin Gallery
          </h1>
          <p className="mt-3 text-stone-600 font-serif text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Every smile, memory, and heartfelt blessing sent for Judath's 25th birthday milestone.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 mx-auto text-amber-700 animate-spin mb-4" />
            <p className="font-serif text-stone-600">Gathering the letters & photographs...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-amber-900/10 shadow-sm max-w-md mx-auto p-8">
            <Heart className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-amber-950">No wishes recorded yet</h3>
            <p className="text-sm text-stone-500 font-serif mt-1 mb-6">
              Be the first to leave a warm message and picture for Judath!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full font-serif text-sm shadow transition"
            >
              Write First Wish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishes.map((wish, index) => {
              const rotation = (index % 5 - 2) * 1.5;
              return (
                <div
                  key={wish.id || index}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="group relative bg-white p-4 pb-6 rounded shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-amber-900/10 flex flex-col justify-between"
                >
                  {/* Photo frame */}
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden rounded mb-4 shadow-inner border border-amber-900/5">
                    <img
                      src={wish.photoUrl || POLAROID_FALLBACK_IMAGE}
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
                          img.src = POLAROID_FALLBACK_IMAGE;
                        }
                      }}
                    />
                    
                    {/* Delete button (Visible on card for family/admin) */}
                    <button
                      onClick={() => setWishToDelete(wish)}
                      className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete wish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Text details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-serif font-bold text-base text-amber-950 truncate">
                          {wish.name}
                        </h3>
                        <span className="text-[10px] text-amber-800 font-serif italic bg-amber-50 px-2 py-0.5 rounded-full border border-amber-900/10 shrink-0 ml-1">
                          {wish.relationship}
                        </span>
                      </div>
                      <p className="font-serif text-xs text-stone-600 leading-relaxed italic line-clamp-4">
                        "{wish.wish}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(wish.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setWishToDelete(wish)}
                        className="text-stone-400 hover:text-red-600 transition flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Wish Modal */}
      {isAddModalOpen && (
        <AddWishModal
          onClose={() => setIsAddModalOpen(false)}
          onWishAdded={() => {
            setIsAddModalOpen(false);
            loadWishes(true);
          }}
        />
      )}

      {/* Delete Wish Modal */}
      {wishToDelete && (
        <DeleteWishModal
          wish={wishToDelete}
          onClose={() => setWishToDelete(null)}
          onConfirm={handleDeleteWish}
        />
      )}
    </div>
  );
};

export default KithKinPage;
