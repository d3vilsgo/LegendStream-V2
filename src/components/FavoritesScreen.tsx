import React, { useState } from 'react';
import { Heart, Play, Trash2, Tv, Film, Clapperboard, Star } from 'lucide-react';
import { Channel, VodMedia } from '../types/tv';

interface FavoritesScreenProps {
  channels: Channel[];
  vodMedia: VodMedia[];
  onPlayMedia: (media: VodMedia | Channel) => void;
  onOpenDetails: (media: VodMedia) => void;
  onToggleFavoriteChannel: (id: string) => void;
  onToggleFavoriteVod: (id: string) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  channels,
  vodMedia,
  onPlayMedia,
  onOpenDetails,
  onToggleFavoriteChannel,
  onToggleFavoriteVod,
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'movies' | 'series'>('channels');

  const favoriteChannels = channels.filter((c) => c.isFavorite);
  const favoriteMovies = vodMedia.filter((m) => m.type === 'movie' && m.isFavorite);
  const favoriteSeries = vodMedia.filter((m) => m.type === 'series' && m.isFavorite);

  return (
    <div className="flex flex-col gap-6 select-none pb-20">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            <span>Favorilerim</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Hızlı erişim için işaretlediğiniz tüm kanallar, filmler ve diziler
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/5">
          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'channels'
                ? 'bg-(--accent-primary) text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Kanallar ({favoriteChannels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'movies'
                ? 'bg-(--accent-primary) text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Filmler ({favoriteMovies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'series'
                ? 'bg-(--accent-primary) text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Diziler ({favoriteSeries.length})</span>
          </button>
        </div>
      </div>

      {/* Tab: Channels */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {favoriteChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onPlayMedia(channel)}
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-mono font-bold text-(--accent-primary)">#{channel.number}</span>
                  <span className="text-sm font-semibold text-white truncate">{channel.name}</span>
                  <span className="text-xs text-zinc-400 truncate">{channel.currentProgram}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavoriteChannel(channel.id);
                }}
                className="p-2 text-rose-500 hover:text-rose-400 transition-colors"
                title="Favorilerden Çıkar"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}

          {favoriteChannels.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
              Henüz favori canlı TV kanalınız bulunmuyor. Canlı TV ekranında kalp ikonuna basarak ekleyebilirsiniz.
            </div>
          )}
        </div>
      )}

      {/* Tab: Movies */}
      {activeTab === 'movies' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favoriteMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onOpenDetails(movie)}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {movie.rating}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate block">{movie.title}</span>
                  <span className="text-[11px] text-zinc-400 truncate block mt-0.5">{movie.year}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavoriteVod(movie.id);
                  }}
                  className="p-1 text-rose-500 hover:text-rose-400"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}

          {favoriteMovies.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
              Henüz favori filminiz bulunmuyor. Film detayından kalp butonuna basarak ekleyebilirsiniz.
            </div>
          )}
        </div>
      )}

      {/* Tab: Series */}
      {activeTab === 'series' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favoriteSeries.map((s) => (
            <div
              key={s.id}
              onClick={() => onOpenDetails(s)}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={s.poster}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {s.rating}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate block">{s.title}</span>
                  <span className="text-[11px] text-zinc-400 truncate block mt-0.5">{s.seasonsCount} Sezon</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavoriteVod(s.id);
                  }}
                  className="p-1 text-rose-500 hover:text-rose-400"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}

          {favoriteSeries.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
              Henüz favori diziniz bulunmuyor.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
