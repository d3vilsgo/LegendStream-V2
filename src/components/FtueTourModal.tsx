import React, { useState } from 'react';
import { 
  Sparkles, 
  Tv, 
  Sliders, 
  Download, 
  ChevronRight, 
  Check, 
  X,
  Compass
} from 'lucide-react';

interface FtueTourModalProps {
  onComplete: () => void;
}

export const FtueTourModal: React.FC<FtueTourModalProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: 'Tek Uygulama, Her Ekran',
      subtitle: 'Adaptif TV & Mobil Ergonomisi',
      desc: 'LegendStream XPlayer V2; salonda TV kumandası D-pad tuşlarıyla tek odaklı, telefonda ise başparmak erişimli alt sekme barıyla doğal çalışır.',
      icon: <Tv className="w-8 h-8 text-(--accent-primary)" />,
      badge: 'D-Pad & Touch Gestures',
    },
    {
      step: 2,
      title: 'Kesintisiz Canlı Zapping',
      subtitle: 'Oynatıcıdan Çıkmadan Kanal Değiştirme',
      desc: 'Canlı yayındayken Sol yön tuşuyla transparan kanal çekmecesini açabilir, Sağ yön tuşuyla EPG yayın akışını video duraksamadan izleyebilirsiniz.',
      icon: <Sliders className="w-8 h-8 text-cyan-400" />,
      badge: 'Hızlı Zapping & OSD',
    },
    {
      step: 3,
      title: 'TMDB & Çevrimdışı İndirme',
      subtitle: 'Sinematik Arşiv & Çevrimdışı Keyif',
      desc: 'IMDb/TMDB puanları, zengin oyuncu kadrosu ve fragmanlar parmaklarınızın ucunda. Dilediğiniz filmi indirip internetsiz izleyebilirsiniz.',
      icon: <Download className="w-8 h-8 text-amber-400" />,
      badge: 'Offline & TMDB Engine',
    },
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#16161A] border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative">
        {/* Skip button top right */}
        <button
          onClick={onComplete}
          className="absolute top-6 right-6 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Turu Atla
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === currentStep
                  ? 'w-8 bg-(--accent-primary)'
                  : s < currentStep
                  ? 'w-3 bg-(--accent-primary)/50'
                  : 'w-3 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-3 py-2">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-2">
            {current.icon}
          </div>

          <span className="text-[11px] font-mono font-bold text-(--accent-primary) uppercase tracking-wider">
            {current.badge} · Adım {currentStep}/3
          </span>

          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            {current.title}
          </h3>

          <span className="text-xs font-semibold text-zinc-300">
            {current.subtitle}
          </span>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mt-1">
            {current.desc}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] text-zinc-500 font-mono">
            30 Saniyelik Hızlı Tur
          </span>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-(--accent-primary) text-black hover:opacity-90 shadow-lg cursor-pointer"
            >
              <span>İlerle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-(--accent-primary) text-black hover:opacity-90 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Keşfetmeye Başla</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
