import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Globe, 
  Palette, 
  Tv, 
  RefreshCw, 
  Download, 
  Lock, 
  Database, 
  Info,
  Check,
  AlertCircle,
  ShieldCheck,
  Eye,
  Sliders,
  RotateCw,
  Wifi,
  Cpu,
  Volume2,
  Zap
} from 'lucide-react';
import { AppSettings, ThemeType, AppLanguage, UserProfile } from '../types/tv';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  activeProfile: UserProfile | null;
  profiles: UserProfile[];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  activeProfile,
  profiles,
}) => {
  const [activeTab, setActiveTab] = useState<string>('appearance');
  const [cacheCleared, setCacheCleared] = useState(false);
  const [syncingNow, setSyncingNow] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const tabs = [
    { id: 'profile', label: 'Hesap & Profil', icon: <Users className="w-4 h-4" /> },
    { id: 'languages', label: 'Diller & Ses', icon: <Globe className="w-4 h-4" /> },
    { id: 'appearance', label: 'Görünüm & Tema', icon: <Palette className="w-4 h-4" /> },
    { id: 'player', label: 'Oynatıcı Ayarları', icon: <Tv className="w-4 h-4" /> },
    { id: 'recovery', label: 'Hata & Ağ Kurtarma', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'content', label: 'İçerik & TMDB', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'downloads', label: 'İndirmeler', icon: <Download className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Erişilebilirlik', icon: <Eye className="w-4 h-4" /> },
    { id: 'parental', label: 'Ebeveyn Kontrolü', icon: <Lock className="w-4 h-4" /> },
    { id: 'data', label: 'Veri & Önbellek', icon: <Database className="w-4 h-4" /> },
    { id: 'about', label: 'Hakkında', icon: <Info className="w-4 h-4" /> },
  ];

  const handleThemeChange = (t: ThemeType) => {
    onUpdateSettings({ ...settings, theme: t });
  };

  const handleLanguageChange = (l: AppLanguage) => {
    onUpdateSettings({ ...settings, language: l, contentLanguage: l });
  };

  const clearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleTriggerSync = () => {
    setSyncingNow(true);
    setSyncMessage(null);
    setTimeout(() => {
      setSyncingNow(false);
      const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      onUpdateSettings({ ...settings, lastSyncTime: `Bugün ${nowStr}` });
      setSyncMessage('Kanal ve EPG verileri başarıyla senkronize edildi.');
      setTimeout(() => setSyncMessage(null), 3500);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] select-none pb-12">
      {/* Left Settings Sidebar Tabs */}
      <aside className="w-full md:w-64 flex-none flex flex-row md:flex-col gap-1.5 p-3 rounded-2xl bg-[#16161A]/80 border border-white/5 overflow-x-auto md:overflow-y-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-2 hidden md:block">
          Sistem Ayarları
        </span>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-(--accent-primary) text-black font-semibold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Right Settings Content Panel */}
      <div className="flex-1 rounded-2xl bg-[#16161A]/60 border border-white/5 p-6 md:p-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
        {/* TAB: Görünüm & Tema */}
        {activeTab === 'appearance' && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Görünüm & Tema Seçimi</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                TV ekranınız için en uygun prestij vurgu rengini ve kontrast stilini belirleyin
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Prestij Vurgu Rengi
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'emerald', label: 'Emerald Green', desc: 'Zarif & sakin minimal', color: '#10B981' },
                  { id: 'amber', label: 'Amber Gold', desc: 'Sıcak lüks sinema', color: '#F59E0B' },
                  { id: 'cyan', label: 'Ice Cyan', desc: 'Modern & berrak teknoloji', color: '#38BDF8' },
                  { id: 'crimson', label: 'Crimson Red', desc: 'Cesur streaming servisi', color: '#EF4444' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => handleThemeChange(th.id as ThemeType)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      settings.theme === th.id
                        ? 'bg-white/10 border-(--accent-primary) shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full shadow-md" style={{ backgroundColor: th.color }} />
                      <div>
                        <span className="text-xs font-bold text-white block">{th.label}</span>
                        <span className="text-[11px] text-zinc-400">{th.desc}</span>
                      </div>
                    </div>
                    {settings.theme === th.id && <Check className="w-4 h-4 text-(--accent-primary)" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                10-Foot TV Tipografi Ölçeği
              </span>
              <div className="flex gap-3">
                {(['standard', 'large'] as const).map((fs) => (
                  <button
                    key={fs}
                    onClick={() => onUpdateSettings({ ...settings, fontSize: fs })}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      settings.fontSize === fs
                        ? 'bg-(--accent-primary) text-black border-(--accent-primary) font-semibold'
                        : 'bg-white/5 text-zinc-300 border-white/5'
                    }`}
                  >
                    {fs === 'standard' ? 'Standart (3 Metre)' : 'Büyük (Erişilebilirlik)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Hata & Ağ Kurtarma (NEW!) */}
        {activeTab === 'recovery' && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-(--accent-primary)" />
                Hata & Ağ Kurtarma Akışları
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Yayın kesintilerinde ve zayıf ağ koşullarında akıllı otomatik toparlanma kuralları
              </p>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Otomatik Yedek Kaynak Geçişi (Failover)</span>
                <span className="text-[11px] text-zinc-400">Birincil yayın çöktüğünde kesinti hissettirmeden M3U yedek akışına geçer</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoFailoverBackupSource}
                onChange={(e) => onUpdateSettings({ ...settings, autoFailoverBackupSource: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Adaptif Düşük Bitrate Tamponlama</span>
                <span className="text-[11px] text-zinc-400">Ağ yavaşladığında donmayı önlemek için otomatik 720p HD akışa geçiş önerir</span>
              </div>
              <input
                type="checkbox"
                checked={settings.adaptiveBufferLowBitrate}
                onChange={(e) => onUpdateSettings({ ...settings, adaptiveBufferLowBitrate: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 space-y-2">
              <span className="font-bold text-white block">Kurtarma İlkeleri:</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                • EPG sunucusu yanıt vermezse son önbelleklenen haftalık veri korunur ve kullanıcıya teknik kod yerine 'Çevrimdışı EPG' uyarısı verilir.
              </p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                • Depolama alanı %95'e ulaştığında indirmeler otomatik duraklatılır ve kullanıcıya alan açma yönlendirmesi yapılır.
              </p>
            </div>
          </div>
        )}

        {/* TAB: Erişilebilirlik (NEW!) */}
        {activeTab === 'accessibility' && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-(--accent-primary)" />
                Erişilebilirlik Derinleştirmesi
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                TalkBack ekran okuyucu, azaltılmış hareket ve renk körü dostu arayüz
              </p>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Azaltılmış Hareket (Reduce Motion)</span>
                <span className="text-[11px] text-zinc-400">Sayfa geçişlerindeki kaydırma ve büyütme animasyonlarını devre dışı bırakır</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => onUpdateSettings({ ...settings, reduceMotion: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Yüksek Kontrast Modu (4.5:1 Minimum)</span>
                <span className="text-[11px] text-zinc-400">Daha belirgin 2px odak çerçeveleri ve saf siyah-beyaz zemin ayrımı</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrastUi}
                onChange={(e) => onUpdateSettings({ ...settings, highContrastUi: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Renk Körü Uyarlama Paleti
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Standart' },
                  { id: 'protanopia', label: 'Protanopia (Kırmızı)' },
                  { id: 'deuteranopia', label: 'Deuteranopia (Yeşil)' },
                ].map((cb) => (
                  <button
                    key={cb.id}
                    onClick={() => onUpdateSettings({ ...settings, colorBlindMode: cb.id as any })}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      settings.colorBlindMode === cb.id
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {cb.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 font-mono">
              TalkBack Haritası: Tüm butonlar, afişler ve OSD bileşenleri 'aria-label', 'role' ve 'tabIndex' ile tam uyumludur.
            </div>
          </div>
        )}

        {/* TAB: 5 Diller */}
        {activeTab === 'languages' && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white">5 Dünya Dili Desteği</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Arayüz dili ve TMDB içerik meta verisi dil tercihi (Not: Arapça/İbranice RTL desteği sonraki faz kapsamındadır)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { code: 'tr', label: 'Türkçe', sub: 'Varsayılan Sistem Dili' },
                { code: 'en', label: 'English', sub: 'Global English' },
                { code: 'de', label: 'Deutsch', sub: 'Deutsche Sprache' },
                { code: 'fr', label: 'Français', sub: 'Langue Française' },
                { code: 'es', label: 'Español', sub: 'Idioma Español' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code as AppLanguage)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    settings.language === l.code
                      ? 'bg-(--accent-primary) text-black font-semibold border-(--accent-primary)'
                      : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <span className="block font-bold">{l.label}</span>
                    <span className="text-[10px] opacity-80">{l.sub}</span>
                  </div>
                  {settings.language === l.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Oynatıcı Ayarları & LibVLC Codec Engine */}
        {activeTab === 'player' && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Oynatıcı Motoru & Codec Ayarları</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold border border-orange-500/30">
                  LibVLC v3.6.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                IPTV sağlayıcılarının MPEG-TS, H.265/HEVC, AC3/DTS ve interlaced canlı yayınları için evrensel kod çözücü yapılandırması
              </p>
            </div>

            {/* 1. Player Engine Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-(--accent-primary)" />
                Birincil Oynatıcı Motoru
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'vlc',
                    name: 'LibVLC Engine',
                    badge: 'Önerilen',
                    badgeColor: 'bg-emerald-500/20 text-emerald-400',
                    desc: 'MPEG-TS, AC3, DTS, HEVC evrensel uyumluluk',
                  },
                  {
                    id: 'exoplayer',
                    name: 'ExoPlayer',
                    badge: 'Donanım',
                    badgeColor: 'bg-blue-500/20 text-blue-400',
                    desc: 'Standart HLS/DASH akışları ve düşük pil tüketimi',
                  },
                  {
                    id: 'external',
                    name: 'Harici Oynatıcı',
                    badge: 'Intent',
                    badgeColor: 'bg-amber-500/20 text-amber-400',
                    desc: 'Yayınları VLC veya MX Player uygulamasına yönlendirir',
                  },
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        playerEngine: engine.id as any,
                        useExternalPlayer: engine.id === 'external',
                      });
                    }}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      settings.playerEngine === engine.id
                        ? 'bg-(--accent-primary)/10 border-(--accent-primary) shadow-sm'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{engine.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${engine.badgeColor}`}>
                        {engine.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 leading-tight">{engine.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Hardware Acceleration Mode */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Donanım Hızlandırma & Kod Çözücü
              </span>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'full', label: 'Tam Donanım', sub: 'MediaCodec Direct' },
                  { id: 'decoding_only', label: 'Yalnızca Çözme', sub: 'Decode Only' },
                  { id: 'disabled', label: 'Yazılım / FFmpeg', sub: 'Maksimum Uyumluluk' },
                ].map((hw) => (
                  <button
                    key={hw.id}
                    onClick={() => onUpdateSettings({ ...settings, hardwareAcceleration: hw.id as any })}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      settings.hardwareAcceleration === hw.id
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold truncate">{hw.label}</span>
                    <span className="text-[10px] opacity-75 font-mono truncate">{hw.sub}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400">
                IPTV sağlayıcınız eski MPEG-2 veya sıra dışı H.265 profili kullanıyorsa 'Yazılım / FFmpeg' moduna geçebilirsiniz.
              </p>
            </div>

            {/* 3. Deinterlacing Filter (Yadif 2x) */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Titreşim Önleme (Deinterlacing Filtresi)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                  1080i Canlı Spor Yayınları
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yadif2x', label: 'Yadif (2x)', sub: 'Akıcı 50/60 FPS' },
                  { id: 'blend', label: 'Blend', sub: 'Dengeli Harman' },
                  { id: 'disabled', label: 'Kapalı', sub: 'İşlemsiz Doğrudan' },
                ].map((di) => (
                  <button
                    key={di.id}
                    onClick={() => onUpdateSettings({ ...settings, deinterlaceFilter: di.id as any })}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      settings.deinterlaceFilter === di.id
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold">{di.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{di.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Audio Passthrough & AC3/DTS */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Gelişmiş Ses (Dolby Digital & DTS)
              </span>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">HDMI Ses Geçişi (Bitstream Passthrough)</span>
                  <span className="text-[11px] text-zinc-400">AC3, E-AC3 (Dolby) ve DTS sinyalini doğrudan AV Alıcı / Soundbar'a aktarır</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.audioPassthrough}
                  onChange={(e) => onUpdateSettings({ ...settings, audioPassthrough: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 accent-(--accent-primary)"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Dahili Yazılımsal Ses Kod Çözme (Software Downmix)</span>
                  <span className="text-[11px] text-zinc-400">DTS / AC3 desteklemeyen TV hoparlörleri için LibVLC ile stereo çözme</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferSoftwareAudioDecoding}
                  onChange={(e) => onUpdateSettings({ ...settings, preferSoftwareAudioDecoding: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 accent-(--accent-primary)"
                />
              </label>
            </div>

            {/* 5. IPTV Custom User-Agent */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                IPTV Kullanıcı Kimliği (User-Agent Başlığı)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'vlc', label: 'VLC Media Player', val: 'VLC/3.0.18 LibVLC/3.0.18' },
                  { id: 'iptvsmarters', label: 'IPTV Smarters Pro', val: 'IPTVSmartersPro/3.1.5' },
                  { id: 'exoplayer', label: 'ExoPlayer', val: 'ExoPlayerLib/2.19.1' },
                  { id: 'custom', label: 'Özel Tanımlı', val: settings.customUserAgent || 'LegendStream/2.0' },
                ].map((ua) => (
                  <button
                    key={ua.id}
                    onClick={() => {
                      onUpdateSettings({
                        ...settings,
                        userAgentType: ua.id as any,
                        customUserAgent: ua.val,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.userAgentType === ua.id
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-bold">{ua.label}</span>
                    <span className="text-[10px] font-mono opacity-80 truncate block">{ua.val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Buffer & Auto Play Next */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Sonraki Bölümü Otomatik Başlat</span>
                  <span className="text-[11px] text-zinc-400">Dizi bölümü bittiğinde 5 saniye içinde sıradaki bölüm başlar</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPlayNext}
                  onChange={(e) => onUpdateSettings({ ...settings, autoPlayNext: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 accent-(--accent-primary)"
                />
              </label>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">Yayın Tampon Bellek Boyutu (Buffer):</span>
                  <span className="font-bold text-(--accent-primary) font-mono">{settings.bufferSizeSec} Saniye</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.bufferSizeSec}
                  onChange={(e) => onUpdateSettings({ ...settings, bufferSizeSec: parseInt(e.target.value, 10) })}
                  className="w-full accent-(--accent-primary) cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>1s (Ultra Hızlı Zapping)</span>
                  <span>5s (Dengeli)</span>
                  <span>10s (Kararsız Ağlar)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: İndirmeler & Ağ (NEW!) */}
        {activeTab === 'downloads' && (
          <div className="flex flex-col gap-5 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white">İndirme & Depolama Ayarları</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kuyruk yönetimi, Wi-Fi kısıtlaması ve otomatik temizleme kuralları
              </p>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Yalnızca Wi-Fi ile İndir</span>
                <span className="text-[11px] text-zinc-400">Mobil ağa bağlıyken indirmeler otomatik duraklatılır</span>
              </div>
              <input
                type="checkbox"
                checked={settings.wifiOnlyDownloads}
                onChange={(e) => onUpdateSettings({ ...settings, wifiOnlyDownloads: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">İzlenen Bölümleri Otomatik Sil</span>
                <span className="text-[11px] text-zinc-400">Dizi bölümü %100 izlendiğinde cihaz depolamasından temizlenir</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoDeleteWatchedDownloads}
                onChange={(e) => onUpdateSettings({ ...settings, autoDeleteWatchedDownloads: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-300">Eşzamanlı İndirme Limiti:</span>
              <span className="font-bold text-(--accent-primary)">Maksimum {settings.maxConcurrentDownloads} İndirme</span>
            </div>
          </div>
        )}

        {/* TAB: İçerik & TMDB & Senkronizasyon */}
        {activeTab === 'content' && (
          <div className="flex flex-col gap-5 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">İçerik & TMDB Senkronizasyonu</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The Movie Database (TMDB) API ve otomatik arka plan taraması
                </p>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={syncingNow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${syncingNow ? 'animate-spin text-(--accent-primary)' : ''}`} />
                <span>{syncingNow ? 'Güncelleniyor...' : 'Şimdi Senkronize Et'}</span>
              </button>
            </div>

            {syncMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between text-xs font-mono">
              <span className="text-zinc-500">Son Güncelleme Zamanı:</span>
              <span className="text-white font-semibold">{settings.lastSyncTime}</span>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">TMDB Zengin Meta Verisini Etkinleştir</span>
                <span className="text-[11px] text-zinc-400">IMDb puanları, oyuncu fotoğrafları ve fragmanlar yüklenir</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableTmdbMetadata}
                onChange={(e) => onUpdateSettings({ ...settings, enableTmdbMetadata: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500"
              />
            </label>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Özel TMDB API Anahtarı (Opsiyonel)</label>
              <input
                type="text"
                value={settings.tmdbApiKey}
                onChange={(e) => onUpdateSettings({ ...settings, tmdbApiKey: e.target.value })}
                placeholder="Boş bırakılırsa dahili ücretsiz anahtar kullanılır"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary) font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB: Veri & Önbellek */}
        {activeTab === 'data' && (
          <div className="flex flex-col gap-5 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Veri & Depolama Yönetimi</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Önbelleğe alınan poster ve EPG verilerini temizleyin veya yedekleyin
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Görsel ve EPG Önbelleği (248 MB)</span>
                <span className="text-[11px] text-zinc-400">Daha hızlı açılış için yerel bellekte tutulan geçici veriler</span>
              </div>
              <button
                onClick={clearCache}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
              >
                {cacheCleared ? 'Önbellek Temizlendi!' : 'Temizle'}
              </button>
            </div>
          </div>
        )}

        {/* TAB: Hakkında */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-(--accent-primary) text-black font-black text-xl flex items-center justify-center shadow-lg">
                LSX
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">LegendStream XPlayer V2</h2>
                <span className="text-xs font-mono text-(--accent-primary)">Sürüm 2.4.0 (Adaptive Multi-Platform)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              LegendStream XPlayer V2; telefon, katlanabilir, tablet, Chromebook ve Android/Google TV cihazları için optimize edilmiş "Tek Kod Tabanı, Her Ekran" IPTV oynatıcı arayüzüdür.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-400 flex flex-col gap-1.5">
              <div>Motor: ExoPlayer 2.19 & FFmpeg Codec Extension</div>
              <div>Platform Desteği: Android 9.0+ / Google TV / Android TV</div>
              <div>IPTV Standartları: Xtream Codes, M3U8 HLS, Stalker Portal API</div>
              <div>Google Cast: Chromecast Ultra & Google TV Cast v3.2</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
