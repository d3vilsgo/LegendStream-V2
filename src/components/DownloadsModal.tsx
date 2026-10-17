import React from 'react';
import { 
  Download, 
  Play, 
  Trash2, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  X,
  WifiOff,
  Pause,
  RotateCw,
  Wifi,
  AlertCircle
} from 'lucide-react';
import { DownloadItem } from '../types/tv';

interface DownloadsModalProps {
  downloads: DownloadItem[];
  onClose: () => void;
  onPlayDownloaded: (download: DownloadItem) => void;
  onDeleteDownload: (id: string) => void;
  onTogglePauseDownload: (id: string) => void;
  wifiOnly: boolean;
}

export const DownloadsModal: React.FC<DownloadsModalProps> = ({
  downloads,
  onClose,
  onPlayDownloaded,
  onDeleteDownload,
  onTogglePauseDownload,
  wifiOnly,
}) => {
  const totalStorageGb = '16.6 GB / 64 GB (%26 Dolu)';
  const remainingGb = '47.4 GB Boş Alan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8 select-none">
      <div className="w-full max-w-2xl rounded-3xl bg-[#16161A] border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>İndirilenler & Çevrimdışı Kuyruk</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                  {downloads.length} İçerik
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  {wifiOnly ? 'Yalnızca Wi-Fi ile İndir Aktif' : 'Mobil Veri & Wi-Fi İzinli'}
                </span>
                <span>·</span>
                <span className="text-zinc-500">Eşzamanlı Maksimum 2 İndirme</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage Bar Breakdown */}
        <div className="my-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-(--accent-primary)" />
              <span className="text-zinc-300 font-medium">Cihaz Dahili Depolama: {totalStorageGb}</span>
            </div>
            <span className="text-zinc-400 font-mono text-[11px]">{remainingGb}</span>
          </div>

          {/* Progress bar for storage */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-(--accent-primary) w-[26%]" />
          </div>
        </div>

        {/* Downloads & Queue List */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 py-2">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-(--accent-primary) transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-12 h-16 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-mono">
                      {item.quality}
                    </span>
                  </div>

                  {item.subTitle && (
                    <span className="text-[11px] text-zinc-400 truncate mt-0.5">{item.subTitle}</span>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-1">
                    <span>{item.sizeFormatted}</span>
                    <span>·</span>
                    {item.status === 'completed' && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> İndirildi ({item.downloadedAt})
                      </span>
                    )}
                    {item.status === 'downloading' && (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> İndiriliyor (%{item.progressPercent}) · {item.downloadSpeed}
                      </span>
                    )}
                    {item.status === 'queued' && (
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Kuyrukta (Sırada Bekliyor)
                      </span>
                    )}
                    {item.status === 'paused' && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <Pause className="w-3 h-3" /> Duraklatıldı
                      </span>
                    )}
                  </div>

                  {/* Active download progress */}
                  {(item.status === 'downloading' || item.status === 'paused') && (
                    <div className="w-44 h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full ${item.status === 'paused' ? 'bg-zinc-500' : 'bg-amber-400'}`}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Pause/Resume, Play, Delete */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'downloading' && (
                  <button
                    onClick={() => onTogglePauseDownload(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                    title="Duraklat"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                )}

                {item.status === 'paused' && (
                  <button
                    onClick={() => onTogglePauseDownload(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400"
                    title="Devam Ettir"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {item.status === 'completed' && (
                  <button
                    onClick={() => {
                      onPlayDownloaded(item);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-(--accent-primary) text-black font-semibold text-xs hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Oynat</span>
                  </button>
                )}

                <button
                  onClick={() => onDeleteDownload(item.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {downloads.length === 0 && (
            <div className="py-16 text-center text-zinc-500 text-xs">
              Henüz indirilmiş içerik bulunmuyor. Film veya dizi detayındaki "İndir" butonuna basarak çevrimdışı arşiv oluşturabilirsiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
