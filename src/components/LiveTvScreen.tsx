import React, { useState } from 'react';
import { 
  Tv, 
  Play, 
  Heart, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  History, 
  Search,
  Sparkles
} from 'lucide-react';
import { Channel } from '../types/tv';

interface LiveTvScreenProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  enablePip: boolean;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  channels,
  onSelectChannel,
  onToggleFavorite,
  enablePip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [activeHoverChannel, setActiveHoverChannel] = useState<Channel>(channels[0]);
  const [pipVisible, setPipVisible] = useState<boolean>(enablePip);
  const [pipMuted, setPipMuted] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Tümü', 'Favoriler', 'Spor', 'Ulusal', 'Haber', 'Belgesel', 'Sinema', 'Çocuk', 'Müzik'];

  const filteredChannels = channels.filter((ch) => {
    const matchesCategory =
      selectedCategory === 'Tümü'
        ? true
        : selectedCategory === 'Favoriler'
        ? ch.isFavorite
        : ch.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.currentProgram.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)] select-none">
      {/* 1. Left: Categories Column (180px - 220px) */}
      <aside className="w-52 flex-none flex flex-col gap-1.5 p-3 rounded-2xl bg-[#16161A]/80 border border-white/5 overflow-y-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-2">
          Kategoriler
        </span>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-(--accent-primary) text-black font-semibold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/20 text-black' : 'text-zinc-500'
                }`}
              >
                {cat === 'Tümü'
                  ? channels.length
                  : cat === 'Favoriler'
                  ? channels.filter((c) => c.isFavorite).length
                  : channels.filter((c) => c.category === cat).length}
              </span>
            </button>
          );
        })}
      </aside>

      {/* 2. Middle: Channel List Table (60% width) */}
      <div className="flex-1 flex flex-col rounded-2xl bg-[#16161A]/50 border border-white/5 overflow-hidden">
        {/* Search & Filter Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#16161A]/80">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-72">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kanal veya program ara..."
              className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>{filteredChannels.length} Kanal</span>
            <button
              onClick={() => setPipVisible(!pipVisible)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-all border border-white/5"
              title="Sağ Üst Küçük Önizlemeyi Aç/Kapat"
            >
              {pipVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{pipVisible ? 'Önizlemeyi Gizle' : 'Canlı Önizleme'}</span>
            </button>
          </div>
        </div>

        {/* Channel Rows */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-2">
          {filteredChannels.map((channel) => {
            const isHovered = activeHoverChannel?.id === channel.id;
            return (
              <div
                key={channel.id}
                onMouseEnter={() => setActiveHoverChannel(channel)}
                onClick={() => onSelectChannel(channel)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer tv-card-focus ${
                  isHovered
                    ? 'bg-white/[0.08] border-white/20'
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                }`}
              >
                {/* Left: Number + Logo + Channel & Program Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-8 text-sm font-mono font-semibold text-zinc-400 text-center">
                    {channel.number}
                  </span>

                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{channel.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                        {channel.resolution}
                      </span>
                      {channel.hasCatchup && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5" title="Geriye Sarma (Catch-up) Desteklenir">
                          <History className="w-3 h-3" /> Catch-up
                        </span>
                      )}
                    </div>

                    {/* Program and Progress */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-300">
                      <span className="font-medium truncate max-w-[280px]">
                        {channel.currentProgram}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px] shrink-0">
                        {channel.currentStart} - {channel.currentEnd}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-(--accent-primary)"
                        style={{ width: `${channel.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Next show + Favorite action */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[11px] text-zinc-400">Sonraki:</span>
                    <span className="text-xs text-zinc-300 truncate max-w-[160px]">
                      {channel.nextProgram}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{channel.nextStart}</span>
                  </div>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel.id);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      channel.isFavorite
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-zinc-500 hover:text-white hover:bg-white/10'
                    }`}
                    title={channel.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  >
                    <Heart className={`w-4 h-4 ${channel.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Play Action Icon */}
                  <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-(--accent-primary) group-hover:text-black text-white flex items-center justify-center transition-colors">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}

          {filteredChannels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Tv className="w-12 h-12 text-zinc-600 mb-3" />
              <h3 className="text-base font-semibold text-zinc-300">Kanal Bulunamadı</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Farklı bir arama terimi veya kategori deneyin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right: Small Live PiP Preview Box (Optional, default enabled for rich UX) */}
      {pipVisible && activeHoverChannel && (
        <aside className="w-80 flex-none flex flex-col gap-3 rounded-2xl bg-[#16161A]/80 border border-white/5 p-4 h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Canlı Önizleme
            </span>
            <button
              onClick={() => setPipMuted(!pipMuted)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
              title={pipMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {pipMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-(--accent-primary)" />}
            </button>
          </div>

          {/* Mini video container */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10 group cursor-pointer" onClick={() => onSelectChannel(activeHoverChannel)}>
            <video
              src={activeHoverChannel.streamUrl}
              autoPlay
              loop
              muted={pipMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase">
              CANLI
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-(--accent-primary) text-black flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">{activeHoverChannel.name}</span>
            <span className="text-xs text-zinc-300 font-medium">{activeHoverChannel.currentProgram}</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
              Yayın 1080p 50 FPS akışında kesintisiz iletilmektedir. Tam ekran izlemek için kanala tıklayın veya OK tuşuna basın.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
};
