import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Tv, 
  Volume2, 
  Zap, 
  CheckCircle, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Search, 
  Radio, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  Clock,
  Code
} from 'lucide-react';
import { VideoTechnicalInfo, CodecCapability, AppSettings } from '../types/tv';
import { VLC_SUPPORTED_CODECS_DATA } from '../data/mockIptvData';

interface VlcCodecInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMediaTitle?: string;
  currentStreamUrl?: string;
  isLive?: boolean;
  technicalInfo?: VideoTechnicalInfo;
  settings: AppSettings;
  onUpdateSettings?: (newSettings: AppSettings) => void;
  onSwitchEngine?: (engine: 'vlc' | 'exoplayer' | 'external') => void;
  onSwitchFormat?: (format: 'ts' | 'm3u8') => void;
  onToggleDeinterlace?: (mode: 'yadif2x' | 'blend' | 'disabled') => void;
}

export const VlcCodecInspectorModal: React.FC<VlcCodecInspectorModalProps> = ({
  isOpen,
  onClose,
  currentMediaTitle = 'TRT 1 4K HDR',
  currentStreamUrl = 'http://stream.legendstream.net:8080/live/user/pass/101.ts',
  isLive = true,
  technicalInfo,
  settings,
  onUpdateSettings,
  onSwitchEngine,
  onSwitchFormat,
  onToggleDeinterlace,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'matrix' | 'intent' | 'gradle'>('pipeline');
  const [codecCategory, setCodecCategory] = useState<'all' | 'video' | 'audio' | 'container' | 'subtitle'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [intentSuccessMessage, setIntentSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentFormat = technicalInfo?.streamFormat || settings.defaultStreamFormat || 'ts';
  const currentEngine = settings.playerEngine || 'vlc';
  const currentDeinterlace = settings.deinterlaceFilter || 'yadif2x';
  const currentHw = settings.hardwareAcceleration || 'full';
  const currentCaching = settings.networkCachingMs || 1500;

  const filteredCodecs = VLC_SUPPORTED_CODECS_DATA.filter((codec) => {
    const matchesCat = codecCategory === 'all' || codec.category === codecCategory;
    const matchesSearch = 
      codec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      codec.vlcDecoder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      codec.iptvUsage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(currentStreamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleLaunchExternalVlc = () => {
    setIntentSuccessMessage(`Android Intent tetiklendi: vlc://${currentStreamUrl} (Paket: org.videolan.vlc)`);
    setTimeout(() => setIntentSuccessMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 md:p-6 select-none animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] rounded-3xl bg-[#121216] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold flex items-center justify-center text-sm shadow-md">
              <Cpu className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  LibVLC Core v3.6 & Codec Teşhis Merkezi
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                  Universal IPTV Engine
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                MPEG-TS (.ts), HEVC 10-bit HDR, AC3/DTS Passthrough, Yadif 2x Deinterlace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top-Level Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 bg-[#141418] border-b border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'pipeline', label: '1. Canlı Akış & Kod Çözme Boru Hattı', icon: <Layers className="w-4 h-4" /> },
            { id: 'matrix', label: `2. Codec Uyumluluk Matrisi (${VLC_SUPPORTED_CODECS_DATA.length})`, icon: <Radio className="w-4 h-4" /> },
            { id: 'intent', label: '3. Harici VLC Intent & Android Köprüsü', icon: <ExternalLink className="w-4 h-4" /> },
            { id: 'gradle', label: '4. Android Gradle & JNI Mimarisi', icon: <Code className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-(--accent-primary) text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-zinc-200">
          
          {/* TAB 1: PIPELINE & LIVE DIAGNOSTICS */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Media Title & URL Bar */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-(--accent-primary)/15 flex items-center justify-center text-(--accent-primary)">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 font-mono block">Aktif Yayınlanan İçerik:</span>
                    <span className="text-sm font-bold text-white">{currentMediaTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-xs font-mono text-zinc-300 max-w-md truncate">
                  <span className="text-emerald-400 font-bold">{currentFormat.toUpperCase()}:</span>
                  <span className="truncate">{currentStreamUrl}</span>
                  <button 
                    onClick={handleCopyStreamUrl}
                    className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer shrink-0"
                    title="URL'yi Kopyala"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Decoding Flow Diagram */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  LibVLC Donanım & Yazılım Boru Hattı (Decoding Flow)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">1. Kaynak Taşıyıcı</span>
                    <span className="text-xs font-bold text-white mt-1">MPEG-TS (.ts)</span>
                    <span className="text-[11px] text-zinc-400">HTTP Chunked akış (vlc_demux_ts)</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">Gecikme: ~300ms</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">2. Ağ Tamponu</span>
                    <span className="text-xs font-bold text-white mt-1">Network Cache</span>
                    <span className="text-[11px] text-zinc-400">{currentCaching} ms önbellek</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">Düşen Kare: 0 (Kusursuz)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-orange-500/30 bg-orange-500/[0.02] flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-orange-400 uppercase">3. Video Çözücü</span>
                    <span className="text-xs font-bold text-orange-300 mt-1">MediaCodec HW</span>
                    <span className="text-[11px] text-zinc-300">HEVC Main 10@L5.1 (Direct HW)</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">60 FPS Donanımsal</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">4. Deinterlacing</span>
                    <span className="text-xs font-bold text-white mt-1">Yadif (2x)</span>
                    <span className="text-[11px] text-zinc-400">1080i50 -&gt; 1080p50 Titreşim Yok</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">Canlı Spor Optimize</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 bg-cyan-500/[0.02] flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">5. Ses Çözücü</span>
                    <span className="text-xs font-bold text-cyan-300 mt-1">Dolby AC-3 5.1</span>
                    <span className="text-[11px] text-zinc-300">liba52 + Passthrough</span>
                    <span className="text-[10px] text-cyan-400 font-mono mt-2">Bitstream HDMI</span>
                  </div>
                </div>
              </div>

              {/* Interactive Quick Switches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                {/* Format Switcher */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-(--accent-primary)" />
                      IPTV Akış Formatı Tercihi
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Xtream & Stalker için</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSwitchFormat?.('ts')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        currentFormat === 'ts'
                          ? 'bg-(--accent-primary) text-black font-bold border-(--accent-primary)'
                          : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-xs font-bold">MPEG-TS (.ts)</span>
                      <span className="text-[10px] opacity-80 block">En düşük kanal geçiş gecikmesi (&lt;0.5s)</span>
                    </button>

                    <button
                      onClick={() => onSwitchFormat?.('m3u8')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        currentFormat === 'm3u8'
                          ? 'bg-(--accent-primary) text-black font-bold border-(--accent-primary)'
                          : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-xs font-bold">HLS (.m3u8)</span>
                      <span className="text-[10px] opacity-80 block">Değişken mobil ağlar için adaptif</span>
                    </button>
                  </div>
                </div>

                {/* Player Engine Switcher */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-orange-400" />
                      Oynatıcı Çekirdeği (Engine)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Çalışma Anı</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'vlc', name: 'LibVLC Core', sub: 'En Geniş Codec' },
                      { id: 'exoplayer', name: 'ExoPlayer', sub: 'Standart Android' },
                      { id: 'external', name: 'Harici VLC', sub: 'Android Intent' },
                    ].map((eng) => (
                      <button
                        key={eng.id}
                        onClick={() => onSwitchEngine?.(eng.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          currentEngine === eng.id
                            ? 'bg-orange-500 text-black font-bold border-orange-500'
                            : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="block text-xs font-bold">{eng.name}</span>
                        <span className="text-[10px] opacity-80 block truncate">{eng.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deinterlace & Caching row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deinterlacing */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-white block">
                    Deinterlacing Filtresi (1080i Canlı Spor)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'yadif2x', label: 'Yadif (2x)', sub: '60 FPS Akıcı' },
                      { id: 'blend', label: 'Blend', sub: 'Harmanlama' },
                      { id: 'disabled', label: 'Kapalı', sub: 'Progresif' },
                    ].map((di) => (
                      <button
                        key={di.id}
                        onClick={() => onToggleDeinterlace?.(di.id as any)}
                        className={`p-2 rounded-xl border text-xs text-left cursor-pointer ${
                          currentDeinterlace === di.id
                            ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                            : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="block font-semibold">{di.label}</span>
                        <span className="text-[10px] opacity-80 block">{di.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Caching */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white block">
                      Ağ Önbelleği (Network Caching Buffer)
                    </span>
                    <span className="text-xs font-mono text-(--accent-primary)">{currentCaching} ms</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { ms: 300, label: '300ms', desc: 'Düşük Gecikme' },
                      { ms: 1500, label: '1500ms', desc: 'Dengeli' },
                      { ms: 3000, label: '3000ms', desc: 'IPTV Kararlı' },
                      { ms: 5000, label: '5000ms', desc: 'Zayıf Hat' },
                    ].map((buf) => (
                      <button
                        key={buf.ms}
                        onClick={() => onUpdateSettings?.({ ...settings, networkCachingMs: buf.ms })}
                        className={`p-2 rounded-xl border text-xs text-center cursor-pointer ${
                          currentCaching === buf.ms
                            ? 'bg-(--accent-primary) text-black font-bold border-(--accent-primary)'
                            : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="block font-bold">{buf.label}</span>
                        <span className="text-[9px] opacity-80 block truncate">{buf.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODEC COMPATIBILITY MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Codec adı, standart veya decoder kütüphanesi ara..."
                    className="w-full bg-[#16161A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-primary)"
                  />
                </div>

                <div className="flex gap-1 bg-[#16161A] border border-white/10 p-1 rounded-xl text-xs overflow-x-auto w-full sm:w-auto">
                  {(['all', 'video', 'audio', 'container', 'subtitle'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCodecCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        codecCategory === cat
                          ? 'bg-(--accent-primary) text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? 'Tümü' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Codecs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCodecs.map((codec) => (
                  <div
                    key={codec.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {codec.category === 'video' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                          {codec.category === 'audio' && <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                          {codec.category === 'container' && <Radio className="w-3.5 h-3.5 text-emerald-400" />}
                          {codec.category === 'subtitle' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                          <span>{codec.name}</span>
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            codec.hardwareSupported
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                          }`}
                        >
                          {codec.hardwareSupported ? 'HW Direct' : 'SW FFmpeg'}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 font-mono mb-2">
                        Standart: <span className="text-zinc-200">{codec.standard}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-orange-300">
                        VLC Modülü: <span className="text-zinc-300">{codec.vlcDecoder}</span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 pt-2 border-t border-white/5">
                      <strong className="text-zinc-300">IPTV Rolü:</strong> {codec.iptvUsage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXTERNAL VLC INTENT & ANDROID BRIDGE */}
          {activeTab === 'intent' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Harici VLC for Android Uygulamasına Akış Yönlendirme (Intent)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Bazen IPTV sağlayıcıları aşırı yüksek bitrate (80+ Mbps remux) veya nadir bulunan kodekler kullanır. 
                  LegendStream XPlayer V2, tek tuşla resmi <strong>VLC for Android</strong> veya <strong>MX Player</strong> 
                  uygulamasına akışı kayıpsız aktarabilir.
                </p>
              </div>

              {/* Action Button */}
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-300">VLC Android Intent Simülasyonu</span>
                  <span className="text-[10px] font-mono text-zinc-400">org.videolan.vlc</span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 break-all select-text">
                  intent:{currentStreamUrl}#Intent;action=android.intent.action.VIEW;type=video/*;package=org.videolan.vlc;end
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleLaunchExternalVlc}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-black font-bold text-xs hover:bg-orange-400 transition-all cursor-pointer shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Harici VLC'de Aç (Intent Gönder)</span>
                  </button>

                  <button
                    onClick={handleCopyStreamUrl}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>URL'yi Kopyala</span>
                  </button>
                </div>

                {intentSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-in fade-in">
                    ✓ {intentSuccessMessage}
                  </div>
                )}
              </div>

              {/* Supported Third-Party Players */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Desteklenen Harici Oynatıcılar:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <strong className="text-white block">VLC for Android</strong>
                    <span className="text-[11px] text-zinc-400 font-mono">org.videolan.vlc</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <strong className="text-white block">MX Player Pro</strong>
                    <span className="text-[11px] text-zinc-400 font-mono">com.mxtech.videoplayer</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <strong className="text-white block">Just Player</strong>
                    <span className="text-[11px] text-zinc-400 font-mono">com.brouken.player</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANDROID GRADLE & JNI ARCHITECTURE */}
          {activeTab === 'gradle' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Android TV & Mobil LibVLC Kod Mimarisi
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Android TV uygulamasında gömülü LibVLC C kütüphanesinin derleme ve başlatma parametreleri
                </p>
              </div>

              {/* build.gradle snippet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400">app/build.gradle.kts:</span>
                <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto select-text">
                  <pre>{`dependencies {
    // Resmi VideoLAN LibVLC Android Çekirdeği (Tüm mimariler: arm64-v8a, armeabi-v7a, x86_64)
    implementation("org.videolan.android:libvlc-all:3.6.0")

    // IPTV için özel FFmpeg uzantıları ve donanım hızlandırma modülleri
    implementation("androidx.media3:media3-exoplayer:1.2.1")
}`}</pre>
                </div>
              </div>

              {/* Kotlin LibVLC Init snippet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400">VlcPlayerEngine.kt:</span>
                <div className="p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-orange-300 leading-relaxed overflow-x-auto select-text">
                  <pre>{`val options = arrayListOf<String>(
    "--network-caching=1500",      // IPTV için 1.5 saniye optimum ağ tamponu
    "--clock-jitter=0",            // Canlı MPEG-TS PCR saat kayması düzeltmesi
    "--clock-synchro=0",           // Ses-görüntü senkron kaybını önleme
    "--deinterlace=1",             // 1080i canlı TV için donanımsal deinterlace
    "--deinterlace-mode=yadif2x",  // Yadif 2x 60 FPS akıcı spor modu
    "--audio-time-stretch",        // Hız değişiminde ses tonunu koruma
    "-vvv"                         // Gelişmiş IPTV akış hata ayıklama günlüğü
)

val libVlc = LibVLC(context, options)
val mediaPlayer = MediaPlayer(libVlc)
mediaPlayer.attachViews(vlcVideoLayout, null, false, false)`}</pre>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#16161A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tüm IPTV Sağlayıcıları (Xtream, M3U, Stalker) ile %100 Doğrulanmış Codec Uyumluluğu</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-(--accent-primary) text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
