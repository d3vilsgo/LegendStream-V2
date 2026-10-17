import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  CornerDownLeft, 
  RotateCcw, 
  Home, 
  Info, 
  CalendarDays, 
  X,
  Volume2,
  VolumeX,
  Tv
} from 'lucide-react';

interface TvRemoteOverlayProps {
  onClose: () => void;
  onSendKey: (key: string) => void;
}

export const TvRemoteOverlay: React.FC<TvRemoteOverlayProps> = ({
  onClose,
  onSendKey,
}) => {
  const triggerKey = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    onSendKey(key);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-3xl bg-[#16161A]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl flex flex-col items-center gap-4 select-none animate-in fade-in slide-in-from-bottom-4">
      {/* Remote Header */}
      <div className="flex items-center justify-between w-full pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-(--accent-primary) animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Sanal TV Kumandası
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation D-PAD */}
      <div className="relative w-44 h-44 rounded-full bg-black/60 border border-white/10 p-2 flex items-center justify-center shadow-inner my-1">
        {/* UP */}
        <button
          onClick={() => triggerKey('ArrowUp')}
          className="absolute top-2 w-12 h-10 rounded-t-2xl bg-white/5 hover:bg-white/15 active:bg-(--accent-primary) active:text-black text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
          title="Yukarı (Kanal +)"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* DOWN */}
        <button
          onClick={() => triggerKey('ArrowDown')}
          className="absolute bottom-2 w-12 h-10 rounded-b-2xl bg-white/5 hover:bg-white/15 active:bg-(--accent-primary) active:text-black text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
          title="Aşağı (Kanal -)"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* LEFT */}
        <button
          onClick={() => triggerKey('ArrowLeft')}
          className="absolute left-2 h-12 w-10 rounded-l-2xl bg-white/5 hover:bg-white/15 active:bg-(--accent-primary) active:text-black text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
          title="Sol (Kanal Çekmecesi / -10 sn)"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => triggerKey('ArrowRight')}
          className="absolute right-2 h-12 w-10 rounded-r-2xl bg-white/5 hover:bg-white/15 active:bg-(--accent-primary) active:text-black text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
          title="Sağ (EPG Çekmecesi / +10 sn)"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* CENTER: OK BUTTON */}
        <button
          onClick={() => triggerKey('Enter')}
          className="w-16 h-16 rounded-full bg-(--accent-primary) text-black font-extrabold text-sm flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          title="OK / Seç / Oynat"
        >
          OK
        </button>
      </div>

      {/* Function Row: Back, Home, Info, EPG */}
      <div className="grid grid-cols-4 gap-2 w-full">
        <button
          onClick={() => triggerKey('Backspace')}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-zinc-300 flex flex-col items-center gap-1 text-[10px]"
          title="Geri (Backspace)"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <button
          onClick={() => triggerKey('Escape')}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-zinc-300 flex flex-col items-center gap-1 text-[10px]"
          title="Ana Ekran"
        >
          <Home className="w-4 h-4" />
          <span>Ana</span>
        </button>

        <button
          onClick={() => triggerKey('i')}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-zinc-300 flex flex-col items-center gap-1 text-[10px]"
          title="Yayın Bilgisi (i)"
        >
          <Info className="w-4 h-4" />
          <span>Bilgi</span>
        </button>

        <button
          onClick={() => triggerKey('ArrowRight')}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-zinc-300 flex flex-col items-center gap-1 text-[10px]"
          title="Yayın Rehberi (EPG)"
        >
          <CalendarDays className="w-4 h-4" />
          <span>EPG</span>
        </button>
      </div>

      {/* 0-9 Keypad for Zapping */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '0', ' '].map((num, i) => {
          if (num === ' ') return <div key={`empty-slot-${i}`} />;
          return (
            <button
              key={`pad-key-${num}`}
              onClick={() => triggerKey(num)}
              className="py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] active:bg-(--accent-primary) active:text-black text-xs font-mono font-semibold text-zinc-300 transition-colors cursor-pointer"
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="w-full pt-2 border-t border-white/5 text-[10px] text-zinc-400 space-y-0.5">
        <div><strong className="text-zinc-300">Yön Tuşları:</strong> D-pad Gezinme</div>
        <div><strong className="text-zinc-300">Enter / Space:</strong> OK / Oynat</div>
        <div><strong className="text-zinc-300">Geri / Esc:</strong> Geri Adım</div>
        <div><strong className="text-zinc-300">0 - 9:</strong> Doğrudan Kanal Tuşlama</div>
      </div>
    </div>
  );
};
