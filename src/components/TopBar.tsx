import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Gamepad2, 
  Maximize, 
  Minimize, 
  Clock, 
  Search, 
  Globe, 
  Download, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Tv, 
  Layers,
  Cast,
  Mic
} from 'lucide-react';
import { UserProfile, IptvSource, AppLanguage, DeviceMode, CastDevice } from '../types/tv';

interface TopBarProps {
  activeProfile: UserProfile | null;
  activeSource: IptvSource | null;
  onOpenSpecModal: () => void;
  onToggleRemote: () => void;
  isRemoteOpen: boolean;
  onOpenSearch: () => void;
  onOpenDownloads: () => void;
  downloadsCount: number;
  currentLanguage: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  onOpenCastModal: () => void;
  activeCastDevice: CastDevice | null;
  onTriggerVoiceSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeProfile,
  activeSource,
  onOpenSpecModal,
  onToggleRemote,
  isRemoteOpen,
  onOpenSearch,
  onOpenDownloads,
  downloadsCount,
  currentLanguage,
  onChangeLanguage,
  deviceMode,
  onChangeDeviceMode,
  onOpenCastModal,
  activeCastDevice,
  onTriggerVoiceSearch,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const languages: Array<{ code: AppLanguage; label: string; flag: string }> = [
    { code: 'tr', label: 'Türkçe', flag: 'TR' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'de', label: 'Deutsch', flag: 'DE' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'es', label: 'Español', flag: 'ES' },
  ];

  const deviceModes: Array<{ id: DeviceMode; label: string; icon: React.ReactNode }> = [
    { id: 'auto', label: 'Auto', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'compact', label: 'Compact (Mobil)', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'medium', label: 'Medium (Foldable)', icon: <Tablet className="w-3.5 h-3.5" /> },
    { id: 'expanded', label: 'Expanded (Tablet)', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'tv', label: 'TV (10-Foot)', icon: <Tv className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-gradient-to-b from-[#0A0A0C]/95 via-[#0A0A0C]/75 to-transparent backdrop-blur-md border-b border-white/[0.04] select-none">
      {/* Left: Quick Search button + Mic + Active IPTV Source status */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/5 text-xs text-zinc-300 transition-all">
          <button onClick={onOpenSearch} className="flex items-center gap-2 cursor-pointer">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 hidden sm:inline">Ara...</span>
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={onTriggerVoiceSearch}
            className="text-zinc-400 hover:text-(--accent-primary) cursor-pointer"
            title="Google TV Sesli Arama"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeSource && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5 text-xs text-zinc-300">
            <span
              className={`w-2 h-2 rounded-full ${
                activeSource.status === 'active'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : activeSource.status === 'warning'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span className="font-medium truncate max-w-[130px] sm:max-w-[170px]">{activeSource.name}</span>
            <span className="text-zinc-500 text-[11px] font-mono tabular-nums">{activeSource.latencyMs}ms</span>
          </div>
        )}

        {activeProfile?.isKids && (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium hidden sm:inline">
            Çocuk
          </span>
        )}
      </div>

      {/* Middle: Adaptive Screen Class Simulator Switcher */}
      <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px]">
        {deviceModes.map((dm) => (
          <button
            key={dm.id}
            onClick={() => onChangeDeviceMode(dm.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              deviceMode === dm.id
                ? 'bg-(--accent-primary) text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title={`Ekran Sınıfı Testi: ${dm.label}`}
          >
            {dm.icon}
            <span className="hidden xl:inline">{dm.label}</span>
          </button>
        ))}
      </div>

      {/* Right: Cast, Downloads, Language, Spec, Remote, Clock, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Google Cast Button */}
        <button
          onClick={onOpenCastModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            activeCastDevice
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
          }`}
          title={activeCastDevice ? `Yansıtılıyor: ${activeCastDevice.name}` : 'Google Cast / Ekran Yansıt'}
        >
          <Cast className="w-3.5 h-3.5" />
          {activeCastDevice && (
            <span className="hidden lg:inline font-semibold">{activeCastDevice.name}</span>
          )}
        </button>

        {/* Offline Downloads */}
        <button
          onClick={onOpenDownloads}
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition-all"
          title="İndirilenler & Çevrimdışı Kütüphane"
        >
          <Download className="w-3.5 h-3.5 text-zinc-300" />
          <span className="hidden lg:inline">İndirilenler</span>
          {downloadsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-(--accent-primary) text-black text-[10px] font-bold flex items-center justify-center">
              {downloadsCount}
            </span>
          )}
        </button>

        {/* 5 World Languages */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition-all"
            title="Dili Değiştir (RTL sonraki faz kapsamındadır)"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="uppercase font-mono font-semibold">{currentLanguage}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-10 w-36 bg-[#16161A] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onChangeLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                    currentLanguage === l.code
                      ? 'bg-white/10 text-(--accent-primary) font-semibold'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{l.flag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spec Sheet Inspector Modal Trigger */}
        <button
          onClick={onOpenSpecModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all shadow-sm"
          title="Tasarım Şartnamesi & 8 Teslim Envanteri (Kısayol: 's')"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Tasarım Şartnamesi</span>
        </button>

        {/* TV Remote Controller Floating Assistant Toggle (Only for TV mode or manual preview) */}
        {deviceMode !== 'compact' && (
          <button
            onClick={onToggleRemote}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isRemoteOpen
                ? 'bg-(--accent-primary) text-black border-(--accent-primary) font-semibold'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
            title="Sanal TV Kumandası (D-pad)"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kumanda</span>
          </button>
        )}

        {/* Fullscreen TV Mode */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all hidden sm:block"
          title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran TV Modu'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold tracking-wider text-zinc-200 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{timeStr || '20:45'}</span>
        </div>

        {/* Profile Avatar */}
        {activeProfile && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-medium text-zinc-200 hidden 2xl:inline-block max-w-[120px] truncate">
              {activeProfile.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
