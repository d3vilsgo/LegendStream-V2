import React, { useState } from 'react';
import { History, Play, Trash2, Tv, Film, Clapperboard, RotateCcw } from 'lucide-react';
import { WatchHistoryItem, Channel, VodMedia } from '../types/tv';

interface HistoryScreenProps {
  historyItems: WatchHistoryItem[];
  channels: Channel[];
  vodMedia: VodMedia[];
  onPlayMedia: (media: VodMedia | Channel) => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  historyItems,
  channels,
  vodMedia,
  onPlayMedia,
  onClearHistory,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'live' | 'movie' | 'series'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredHistory = historyItems.filter((item) =>
    filterType === 'all' ? true : item.type === filterType
  );

  const handleResume = (item: WatchHistoryItem) => {
    if (item.type === 'live') {
      const ch = channels.find((c) => c.id === item.mediaId) || channels[0];
      onPlayMedia(ch);
    } else {
      const vod = vodMedia.find((v) => v.id === item.mediaId) || vodMedia[0];
      onPlayMedia(vod);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none pb-20">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-(--accent-primary)" />
            <span>İzleme Geçmişi</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Kronolojik izleme kayıtlarınız ve kaldığınız yerler ({historyItems.length} Kayıt)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Chips */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'live', label: 'Canlı' },
              { id: 'movie', label: 'Film' },
              { id: 'series', label: 'Dizi' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === f.id
                    ? 'bg-(--accent-primary) text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Clear History Button */}
          {historyItems.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Geçmişi Temizle</span>
            </button>
          )}
        </div>
      </div>

      {/* History List Rows */}
      <div className="flex flex-col gap-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => handleResume(item)}
            className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative aspect-video w-32 rounded-xl overflow-hidden shrink-0 bg-zinc-900 ring-1 ring-white/10">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-(--accent-primary)"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{item.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono capitalize">
                    {item.type === 'live' ? 'Canlı TV' : item.type === 'movie' ? 'Film' : 'Dizi'}
                  </span>
                </div>

                {item.subtitle && (
                  <span className="text-xs text-(--accent-primary) mt-0.5">{item.subtitle}</span>
                )}

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 font-mono">
                  <span>{item.watchedAt}</span>
                  <span>·</span>
                  <span>%{item.progressPercent} izlendi ({item.duration})</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResume(item);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 group-hover:bg-(--accent-primary) group-hover:text-black text-white text-xs font-semibold transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Devam Et</span>
            </button>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <History className="w-12 h-12 text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-300">İzleme Geçmişi Boş</h3>
            <p className="text-xs text-zinc-500 mt-1">
              İzlediğiniz film, dizi ve canlı kanallar burada listelenir.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Geçmişi Temizle?</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Tüm izleme kayıtlarınız ve kaldığınız yerler silinecektir. Bu işlem geri alınamaz.
            </p>

            <div className="flex items-center gap-3 w-full mt-6">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md"
              >
                Evet, Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
