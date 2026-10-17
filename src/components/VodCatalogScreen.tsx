import React, { useState } from 'react';
import { 
  Star, 
  Play, 
  Heart, 
  Download, 
  Film, 
  Clapperboard, 
  Info, 
  Check, 
  X, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { VodMedia } from '../types/tv';

interface VodCatalogScreenProps {
  type: 'movie' | 'series';
  mediaList: VodMedia[];
  onPlayMedia: (media: VodMedia, episodeTitle?: string) => void;
  onToggleFavorite: (mediaId: string) => void;
  onTriggerDownload: (media: VodMedia, quality: '1080p FHD' | '720p HD', episodeTitle?: string) => void;
  selectedMediaDetail: VodMedia | null;
  onCloseDetail: () => void;
  onSelectMediaDetail: (media: VodMedia) => void;
}

export const VodCatalogScreen: React.FC<VodCatalogScreenProps> = ({
  type,
  mediaList,
  onPlayMedia,
  onToggleFavorite,
  onTriggerDownload,
  selectedMediaDetail,
  onCloseDetail,
  onSelectMediaDetail,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('Tümü');
  const [selectedSort, setSelectedSort] = useState<'rating' | 'year' | 'title'>('rating');
  const [downloadModalMedia, setDownloadModalMedia] = useState<{ media: VodMedia; episodeTitle?: string } | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [synopsisExpanded, setSynopsisExpanded] = useState<boolean>(false);

  const filteredMedia = mediaList
    .filter((m) => m.type === type)
    .filter((m) => (selectedGenre === 'Tümü' ? true : m.genres.includes(selectedGenre)))
    .sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });

  const availableGenres = ['Tümü', 'Aksiyon', 'Bilim Kurgu', 'Dram', 'Komedi', 'Macera', 'Suç', 'Biyografi'];

  return (
    <div className="flex flex-col gap-6 select-none pb-20">
      {/* Header and Filter Bars */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {type === 'movie' ? <Film className="w-6 h-6 text-(--accent-primary)" /> : <Clapperboard className="w-6 h-6 text-(--accent-primary)" />}
            <span>{type === 'movie' ? 'Filmler Kataloğu' : 'Diziler Kataloğu'}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            TMDB entegrasyonlu yüksek çözünürlüklü içerik arşivi ({filteredMedia.length} İçerik)
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Genre Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5 overflow-x-auto no-scrollbar">
            {availableGenres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-(--accent-primary) text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5 text-xs">
            <button
              onClick={() => setSelectedSort('rating')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedSort === 'rating' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400'
              }`}
            >
              TMDB Puanı
            </button>
            <button
              onClick={() => setSelectedSort('year')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedSort === 'year' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400'
              }`}
            >
              Yıl
            </button>
          </div>
        </div>
      </div>

      {/* 6-Column TV Poster Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            onClick={() => onSelectMediaDetail(media)}
            className="group flex flex-col rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
              <img
                src={media.poster}
                alt={media.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {/* TMDB Rating badge */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono shadow-md">
                <Star className="w-3 h-3 fill-current" />
                {media.rating}
              </div>

              {/* Download status corner badge */}
              {media.isDownloaded && (
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/90 text-black text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Download className="w-2.5 h-2.5" /> İndirildi
                </div>
              )}

              {/* Play hover button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-(--accent-primary) text-black flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="p-3 flex flex-col justify-between flex-1">
              <div>
                <span className="text-xs font-semibold text-white truncate block">
                  {media.title}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5 block truncate">
                  {media.year} · {media.genres.join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RICH DETAIL MODAL (Overlay) */}
      {selectedMediaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-8 overflow-y-auto no-scrollbar">
          <div className="relative w-full max-w-5xl rounded-3xl bg-[#121216] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            {/* Close Button */}
            <button
              onClick={onCloseDetail}
              className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer border border-white/10"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Backdrop Header with gradient */}
            <div className="relative w-full h-[320px] md:h-[400px] overflow-hidden">
              <img
                src={selectedMediaDetail.backdrop}
                alt={selectedMediaDetail.title}
                className="w-full h-full object-cover filter brightness-[0.75]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121216] via-[#121216]/60 to-transparent w-2/3" />

              {/* Title & Metadata on top of backdrop */}
              <div className="absolute bottom-8 left-8 right-8 z-20 flex items-end gap-6">
                <img
                  src={selectedMediaDetail.poster}
                  alt={selectedMediaDetail.title}
                  className="w-32 md:w-44 rounded-2xl shadow-2xl ring-2 ring-white/10 hidden sm:block shrink-0 aspect-[2/3] object-cover"
                  referrerPolicy="no-referrer"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300 mb-2 font-medium">
                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {selectedMediaDetail.rating} TMDB
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span>{selectedMediaDetail.year}</span>
                    <span className="text-zinc-600">·</span>
                    <span>{selectedMediaDetail.duration}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-(--accent-primary)">{selectedMediaDetail.genres.join(' / ')}</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    {selectedMediaDetail.title}
                  </h2>
                  {selectedMediaDetail.originalTitle && (
                    <span className="text-xs text-zinc-400 italic mt-0.5">
                      Orijinal Adı: {selectedMediaDetail.originalTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Details Body */}
            <div className="p-8 flex flex-col gap-8">
              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onPlayMedia(selectedMediaDetail)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-(--accent-primary) text-black font-semibold text-sm hover:opacity-90 transition-all shadow-lg tv-card-focus cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{selectedMediaDetail.progress ? 'Devam Et' : 'Hemen Oynat'}</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(selectedMediaDetail.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                    selectedMediaDetail.isFavorite
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedMediaDetail.isFavorite ? 'fill-current' : ''}`} />
                  <span>{selectedMediaDetail.isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}</span>
                </button>

                <button
                  onClick={() => setDownloadModalMedia({ media: selectedMediaDetail })}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-sm font-medium transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{selectedMediaDetail.isDownloaded ? 'İndirildi (Tekrar İndir)' : 'İndir'}</span>
                </button>

                {selectedMediaDetail.trailerUrl && (
                  <button
                    onClick={() => setShowTrailerModal(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-sm font-medium transition-all cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    <span>Fragman</span>
                  </button>
                )}
              </div>

              {/* Synopsis with 3-line expander */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Özet
                </span>
                <p className={`text-sm text-zinc-300 leading-relaxed ${synopsisExpanded ? '' : 'line-clamp-3'}`}>
                  {selectedMediaDetail.synopsis}
                </p>
                <button
                  onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                  className="text-xs text-(--accent-primary) hover:underline self-start font-medium cursor-pointer"
                >
                  {synopsisExpanded ? 'Daha az göster' : 'Devamını oku...'}
                </button>
              </div>

              {/* TMDB Cast Shelf */}
              {selectedMediaDetail.tmdbCast && selectedMediaDetail.tmdbCast.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Oyuncu Kadrosu (TMDB)
                  </span>

                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {selectedMediaDetail.tmdbCast.map((actor) => (
                      <div key={actor.name} className="flex-none flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 w-52">
                        <img
                          src={actor.photoUrl}
                          alt={actor.name}
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white truncate">{actor.name}</span>
                          <span className="text-[11px] text-zinc-400 truncate">{actor.character}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Series: Season & Episode List */}
              {selectedMediaDetail.type === 'series' && selectedMediaDetail.episodes && (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white tracking-wide">
                      Sezonlar ve Bölümler
                    </span>
                    {/* Season selector */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].slice(0, selectedMediaDetail.seasonsCount || 2).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSeason(s)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            selectedSeason === s
                              ? 'bg-(--accent-primary) text-black shadow-md'
                              : 'bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {s}. Sezon
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Episodes Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMediaDetail.episodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => onPlayMedia(selectedMediaDetail, `${ep.season}. Sezon ${ep.episode}. Bölüm - ${ep.title}`)}
                        className="group flex gap-3.5 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
                      >
                        <div className="relative aspect-video w-36 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-white truncate">
                                {ep.episode}. {ep.title}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono shrink-0">{ep.duration}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                              {ep.synopsis}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            {ep.isWatched ? (
                              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" /> İzlendi
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500">İzlenmedi</span>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTriggerDownload(selectedMediaDetail, '1080p FHD', `${ep.season}. Sezon ${ep.episode}. Bölüm`);
                              }}
                              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                              title="Bölümü İndir"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD QUALITY MODAL */}
      {downloadModalMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-1">İndirme Kalitesi Seçin</h3>
            <p className="text-xs text-zinc-400 mb-4">
              {downloadModalMedia.media.title} {downloadModalMedia.episodeTitle ? `(${downloadModalMedia.episodeTitle})` : ''} çevrimdışı izlemek için cihazınıza indirilecek.
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              <button
                onClick={() => {
                  onTriggerDownload(downloadModalMedia.media, '1080p FHD', downloadModalMedia.episodeTitle);
                  setDownloadModalMedia(null);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">1080p FHD (Önerilen)</span>
                  <span className="text-[11px] text-zinc-400">Yüksek Bitrate H.265 · ~3.8 GB</span>
                </div>
                <Download className="w-4 h-4 text-(--accent-primary) group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onTriggerDownload(downloadModalMedia.media, '720p HD', downloadModalMedia.episodeTitle);
                  setDownloadModalMedia(null);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">720p HD (Hızlı İndirme)</span>
                  <span className="text-[11px] text-zinc-400">Düşük Depolama Kullanımı · ~1.6 GB</span>
                </div>
                <Download className="w-4 h-4 text-zinc-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <button
              onClick={() => setDownloadModalMedia(null)}
              className="w-full py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 transition-all"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* TRAILER MODAL */}
      {showTrailerModal && selectedMediaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={selectedMediaDetail.trailerUrl || selectedMediaDetail.streamUrl}
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
