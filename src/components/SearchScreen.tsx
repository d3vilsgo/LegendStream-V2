import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Mic, 
  Tv, 
  Film, 
  Clapperboard, 
  Play, 
  Star, 
  Sparkles,
  X
} from 'lucide-react';
import { Channel, VodMedia } from '../types/tv';

interface SearchScreenProps {
  channels: Channel[];
  vodMedia: VodMedia[];
  onPlayMedia: (media: VodMedia | Channel) => void;
  onOpenDetails: (media: VodMedia) => void;
  autoTriggerVoice?: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  channels,
  vodMedia,
  onPlayMedia,
  onOpenDetails,
  autoTriggerVoice = false,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'movie' | 'series'>('all');
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  useEffect(() => {
    if (autoTriggerVoice) {
      handleVoiceSearch();
    }
  }, [autoTriggerVoice]);

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setQuery('Dune');
      setIsListeningVoice(false);
    }, 1800);
  };

  const cleanQuery = query.toLowerCase().trim();

  const matchingChannels = channels.filter(
    (c) =>
      cleanQuery === '' ||
      c.name.toLowerCase().includes(cleanQuery) ||
      c.currentProgram.toLowerCase().includes(cleanQuery)
  );

  const matchingVod = vodMedia.filter(
    (m) =>
      cleanQuery === '' ||
      m.title.toLowerCase().includes(cleanQuery) ||
      m.genres.some((g) => g.toLowerCase().includes(cleanQuery)) ||
      (m.director && m.director.toLowerCase().includes(cleanQuery)) ||
      (m.cast && m.cast.some((actor) => actor.toLowerCase().includes(cleanQuery)))
  );

  return (
    <div className="flex flex-col gap-8 select-none pb-20">
      {/* Search Input Bar (10-Foot TV Scale) */}
      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div className="relative flex items-center w-full rounded-2xl bg-[#16161A] border-2 border-white/10 focus-within:border-(--accent-primary) transition-all p-2 shadow-2xl">
          <SearchIcon className="w-6 h-6 text-zinc-400 ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Film, dizi, canlı kanal, tür veya oyuncu ara..."
            className="w-full bg-transparent px-4 py-2.5 text-base text-white placeholder-zinc-500 focus:outline-none"
            autoFocus
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Voice Search Mic Button (Google TV Assistant style) */}
          <button
            onClick={handleVoiceSearch}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isListeningVoice
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-(--accent-primary)'
            }`}
            title="Google TV Sesli Arama"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {isListeningVoice && (
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-rose-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Dinleniyor... "Dune", "Oppenheimer" veya "TRT 1" söyleyin</span>
          </div>
        )}

        {/* Filter Chips */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'live', label: 'Canlı Kanallar' },
            { id: 'movie', label: 'Filmler' },
            { id: 'series', label: 'Diziler' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === chip.id
                  ? 'bg-(--accent-primary) text-black shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Content */}
      <div className="flex flex-col gap-8">
        {/* Live Channels Results */}
        {(filterType === 'all' || filterType === 'live') && matchingChannels.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Tv className="w-4 h-4 text-(--accent-primary)" />
              Canlı Kanallar ({matchingChannels.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {matchingChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => onPlayMedia(ch)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
                >
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-mono font-bold text-(--accent-primary)">#{ch.number}</span>
                    <span className="text-xs font-semibold text-white truncate">{ch.name}</span>
                    <span className="text-[11px] text-zinc-400 truncate">{ch.currentProgram}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOD Movies & Series Results */}
        {(filterType === 'all' || filterType === 'movie' || filterType === 'series') && matchingVod.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-(--accent-primary)" />
              Filmler & Diziler ({matchingVod.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {matchingVod
                .filter((m) => (filterType === 'all' ? true : m.type === filterType))
                .map((media) => (
                  <div
                    key={media.id}
                    onClick={() => onOpenDetails(media)}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-[#16161A] border border-white/5 hover:border-(--accent-primary) transition-all cursor-pointer tv-card-focus"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                      <img
                        src={media.poster}
                        alt={media.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {media.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <span className="text-xs font-semibold text-white truncate block">{media.title}</span>
                      <span className="text-[11px] text-zinc-400 truncate block mt-0.5">
                        {media.year} · {media.genres[0]}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {matchingChannels.length === 0 && matchingVod.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="w-12 h-12 text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-300">Aramanızla Eşleşen İçerik Bulunamadı</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Farklı bir kelime deneyin veya üstteki kategori filtrelerini kullanarak keşfe devam edin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
