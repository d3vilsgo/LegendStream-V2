import React from 'react';
import { 
  Play, 
  Info, 
  Star, 
  Clock, 
  Tv, 
  ChevronRight, 
  Sparkles,
  Download
} from 'lucide-react';
import { Channel, VodMedia, ScreenType, AppLanguage } from '../types/tv';
import { UI_TRANSLATIONS } from '../data/mockIptvData';

interface HomeScreenProps {
  channels: Channel[];
  vodMedia: VodMedia[];
  onPlayMedia: (media: VodMedia | Channel) => void;
  onOpenDetails: (media: VodMedia) => void;
  onNavigate: (screen: ScreenType) => void;
  language: AppLanguage;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  channels,
  vodMedia,
  onPlayMedia,
  onOpenDetails,
  onNavigate,
  language = 'tr',
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.tr;

  // Hero item: Oppenheimer or first media
  const heroMedia = vodMedia.find((m) => m.id === 'vod_1') || vodMedia[0];
  const continueWatching = vodMedia.filter((m) => m.progress && m.progress > 0);
  const tmdbRecommendations = vodMedia.filter((m) => m.rating >= 8.5);
  const movies = vodMedia.filter((m) => m.type === 'movie');
  const series = vodMedia.filter((m) => m.type === 'series');
  const favoriteChannels = channels.filter((c) => c.isFavorite);

  const liveCategories = [
    { name: 'Spor', count: 18, color: 'from-amber-500/20 to-orange-500/10' },
    { name: 'Ulusal', count: 24, color: 'from-blue-500/20 to-indigo-500/10' },
    { name: 'Haber', count: 14, color: 'from-rose-500/20 to-red-500/10' },
    { name: 'Belgesel', count: 16, color: 'from-emerald-500/20 to-teal-500/10' },
    { name: 'Sinema', count: 32, color: 'from-purple-500/20 to-pink-500/10' },
    { name: 'Çocuk', count: 12, color: 'from-cyan-500/20 to-sky-500/10' },
  ];

  return (
    <div className="flex flex-col gap-10 pb-20 select-none">
      {/* 1. Cinematic Hero Banner (Top 1/3) */}
      <section className="relative w-full h-[520px] md:h-[580px] rounded-3xl overflow-hidden border border-white/5 mx-auto shadow-2xl">
        {/* Background Image with Cinematic Scrim */}
        <img
          src={heroMedia.backdrop}
          alt={heroMedia.title}
          className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.85]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/70 to-transparent w-3/4" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 max-w-3xl">
          {/* Metadata line: Zero-pill discipline */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-300 mb-2.5 font-medium tracking-wide">
            <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              {heroMedia.rating} TMDB
            </span>
            <span className="text-zinc-600">·</span>
            <span>{heroMedia.year}</span>
            <span className="text-zinc-600">·</span>
            <span>{heroMedia.duration}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-(--accent-primary)">{heroMedia.genres.join(' / ')}</span>
            {heroMedia.isDownloaded && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Download className="w-3 h-3" /> İndirildi
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {heroMedia.title}
          </h1>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed line-clamp-3 mb-6 max-w-2xl font-normal">
            {heroMedia.synopsis}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlayMedia(heroMedia)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-(--accent-primary) text-black font-semibold text-sm hover:opacity-95 transition-all shadow-lg shadow-(--accent-glow) tv-card-focus cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{heroMedia.progress ? t.resume : t.play}</span>
            </button>

            <button
              onClick={() => onOpenDetails(heroMedia)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10 tv-card-focus cursor-pointer"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>{t.details}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Shelf: Kaldığın Yerden Devam Et (Continue Watching) */}
      {continueWatching.length > 0 && (
        <section className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
              {t.continueWatching}
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {continueWatching.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayMedia(item)}
                className="group relative flex-none w-[280px] md:w-[320px] rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play overlay button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-(--accent-primary) text-black flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                    <div
                      className="h-full bg-(--accent-primary)"
                      style={{ width: `${item.progress || 35}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 flex flex-col">
                  <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                  <div className="flex items-center justify-between mt-1 text-xs text-zinc-400">
                    <span>{item.genres[0]}</span>
                    <span>%{item.progress} izlendi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Shelf: TMDB Önerileri (Based on history) */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
              {t.tmdbRecommendations}
            </h2>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              (İzleme Geçmişinize Göre)
            </span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {tmdbRecommendations.map((media) => (
            <div
              key={media.id}
              onClick={() => onOpenDetails(media)}
              className="group flex-none w-[160px] md:w-[180px] rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <img
                  src={media.poster}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {media.rating}
                </div>
              </div>

              <div className="p-3 flex flex-col">
                <span className="text-xs font-semibold text-white truncate">{media.title}</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {media.year} · {media.genres[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Shelf: Favori Kanallar (Live TV Channels) */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {t.favoriteChannels}
          </h2>
          <button
            onClick={() => onNavigate('live')}
            className="flex items-center gap-1 text-xs text-(--accent-primary) hover:underline font-medium"
          >
            <span>Tüm Kanallar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {favoriteChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onPlayMedia(channel)}
              className="group flex-none w-[240px] md:w-[260px] rounded-2xl p-4 bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-mono text-(--accent-primary)">#{channel.number}</span>
                  <span className="text-sm font-semibold text-white truncate">{channel.name}</span>
                  <span className="text-[11px] text-zinc-400">{channel.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="truncate max-w-[170px]">{channel.currentProgram}</span>
                  <span className="font-mono text-zinc-500">{channel.currentStart}</span>
                </div>
                {/* Live program progress bar */}
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${channel.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Shelf: Son Eklenen Filmler (Movies) */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {t.recentMovies}
          </h2>
          <button
            onClick={() => onNavigate('movies')}
            className="flex items-center gap-1 text-xs text-(--accent-primary) hover:underline font-medium"
          >
            <span>Tüm Filmler</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onOpenDetails(movie)}
              className="group flex-none w-[160px] md:w-[180px] rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {movie.rating}
                </div>
                {movie.isDownloaded && (
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/90 text-black text-[10px] font-bold flex items-center gap-1">
                    <Download className="w-2.5 h-2.5" /> İndirildi
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col">
                <span className="text-xs font-semibold text-white truncate">{movie.title}</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {movie.year} · {movie.genres[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Shelf: Popüler Diziler (Series) */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {t.recentSeries}
          </h2>
          <button
            onClick={() => onNavigate('series')}
            className="flex items-center gap-1 text-xs text-(--accent-primary) hover:underline font-medium"
          >
            <span>Tüm Diziler</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {series.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenDetails(item)}
              className="group flex-none w-[160px] md:w-[180px] rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {item.rating}
                </div>
              </div>

              <div className="p-3 flex flex-col">
                <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {item.seasonsCount} Sezon · {item.genres[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Shelf: Canlı Yayın Kategorileri */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {t.liveCategories}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
          {liveCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigate('live')}
              className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/10 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus flex flex-col justify-between h-28`}
            >
              <Tv className="w-5 h-5 text-white/70" />
              <div>
                <span className="text-sm font-semibold text-white block">{cat.name}</span>
                <span className="text-[11px] text-zinc-400">{cat.count} Kanal</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
