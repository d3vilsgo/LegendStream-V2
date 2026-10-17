import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  Subtitles, 
  Info, 
  List, 
  CalendarDays, 
  Maximize, 
  Minimize, 
  ChevronLeft, 
  X, 
  Check, 
  Wifi, 
  ArrowLeft,
  Tv,
  Sparkles,
  AlertTriangle,
  Cast,
  Sun,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Channel, VodMedia, VideoTechnicalInfo, SubtitleStyle, EpgProgram, CastDevice } from '../types/tv';
import { EPG_SCHEDULE_DATA, TECHNICAL_VIDEO_INFO_SAMPLE } from '../data/mockIptvData';

interface TvPlayerProps {
  media: VodMedia | Channel;
  channels: Channel[];
  onClose: () => void;
  onSwitchChannel: (channel: Channel) => void;
  episodeTitle?: string;
  activeCastDevice: CastDevice | null;
  autoFailover: boolean;
  adaptiveBuffer: boolean;
  initialPlayerEngine?: 'vlc' | 'exoplayer' | 'external';
  deinterlaceFilter?: 'yadif2x' | 'blend' | 'disabled';
}

export const TvPlayer: React.FC<TvPlayerProps> = ({
  media,
  channels,
  onClose,
  onSwitchChannel,
  episodeTitle,
  activeCastDevice,
  autoFailover,
  adaptiveBuffer,
  initialPlayerEngine = 'vlc',
  deinterlaceFilter = 'yadif2x',
}) => {
  const isLive = 'number' in media;
  const currentChannel = isLive ? (media as Channel) : null;
  const currentVod = !isLive ? (media as VodMedia) : null;

  // Video state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(isLive ? 7200 : 9600);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '21:9' | '4:3' | 'fill'>('16:9');

  // Error Recovery & Network State
  const [showBufferAlert, setShowBufferAlert] = useState<boolean>(false);
  const [isLowBitrateMode, setIsLowBitrateMode] = useState<boolean>(false);
  const [failoverToast, setFailoverToast] = useState<string | null>(null);

  // LibVLC & Codec State
  const [playerEngine, setPlayerEngine] = useState<'vlc' | 'exoplayer'>(
    initialPlayerEngine === 'exoplayer' ? 'exoplayer' : 'vlc'
  );
  const [isDeinterlaceOn, setIsDeinterlaceOn] = useState<boolean>(deinterlaceFilter !== 'disabled');
  const [externalVlcMessage, setExternalVlcMessage] = useState<string | null>(null);

  // Overlays state
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showZappingOsd, setShowZappingOsd] = useState<boolean>(isLive);
  const [showLeftChannelDrawer, setShowLeftChannelDrawer] = useState<boolean>(false);
  const [showRightEpgDrawer, setShowRightEpgDrawer] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [showAudioSubPanel, setShowAudioSubPanel] = useState<boolean>(false);

  // Mobile gesture simulation state
  const [gestureFeedback, setGestureFeedback] = useState<{ icon: string; text: string } | null>(null);

  // Audio & Subtitle State
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<string>('Türkçe 5.1 (Orijinal)');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('Kapalı');
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>({
    size: 'medium',
    color: '#FFFFFF',
    bgColor: '#000000',
    bgOpacity: 0.6,
  });

  // Direct channel numeric input (0-9)
  const [numericInput, setNumericInput] = useState<string>('');
  const numericTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Left Drawer category selection
  const [drawerCategory, setDrawerCategory] = useState<string>('Tümü');
  const categories = ['Tümü', 'Spor', 'Ulusal', 'Haber', 'Belgesel', 'Sinema', 'Çocuk'];

  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  // Zapping OSD auto-hide timer (3 seconds)
  useEffect(() => {
    if (isLive) {
      setShowZappingOsd(true);
      const timer = setTimeout(() => {
        setShowZappingOsd(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [media.id, isLive]);

  // Initial controls timer
  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  // Keyboard navigation listener inside player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct numeric input 0-9
      if (e.key >= '0' && e.key <= '9') {
        const nextInput = numericInput + e.key;
        setNumericInput(nextInput);
        if (numericTimerRef.current) clearTimeout(numericTimerRef.current);
        numericTimerRef.current = setTimeout(() => {
          const chNum = parseInt(nextInput, 10);
          const found = channels.find((c) => c.number === chNum);
          if (found) {
            onSwitchChannel(found);
          }
          setNumericInput('');
        }, 2000);
        return;
      }

      if (e.key === 'ArrowLeft') {
        if (showRightEpgDrawer) {
          setShowRightEpgDrawer(false);
        } else if (!showLeftChannelDrawer) {
          setShowLeftChannelDrawer(true);
          setShowControls(false);
        }
      } else if (e.key === 'ArrowRight') {
        if (showLeftChannelDrawer) {
          setShowLeftChannelDrawer(false);
        } else if (!showRightEpgDrawer) {
          setShowRightEpgDrawer(true);
          setShowControls(false);
        }
      } else if (e.key === 'ArrowUp') {
        if (isLive && !showLeftChannelDrawer && !showRightEpgDrawer) {
          const currIdx = channels.findIndex((c) => c.id === media.id);
          const nextIdx = (currIdx + 1) % channels.length;
          onSwitchChannel(channels[nextIdx]);
        }
      } else if (e.key === 'ArrowDown') {
        if (isLive && !showLeftChannelDrawer && !showRightEpgDrawer) {
          const currIdx = channels.findIndex((c) => c.id === media.id);
          const prevIdx = (currIdx - 1 + channels.length) % channels.length;
          onSwitchChannel(channels[prevIdx]);
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (showLeftChannelDrawer) {
          setShowLeftChannelDrawer(false);
        } else if (showRightEpgDrawer) {
          setShowRightEpgDrawer(false);
        } else if (showInfoPanel) {
          setShowInfoPanel(false);
        } else if (showAudioSubPanel) {
          setShowAudioSubPanel(false);
        } else {
          onClose();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!showLeftChannelDrawer && !showRightEpgDrawer) {
          resetControlsTimer();
          if (e.key === ' ') {
            togglePlay();
          }
        }
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfoPanel((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        setShowAudioSubPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLeftChannelDrawer, showRightEpgDrawer, showInfoPanel, showAudioSubPanel, numericInput, media.id, channels, isLive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (deltaSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + deltaSeconds);
      setCurrentTime(videoRef.current.currentTime);
      resetControlsTimer();
    }
  };

  // Simulate mobile double-tap seek gesture
  const handleDoubleTap = (side: 'left' | 'right') => {
    const delta = side === 'left' ? -10 : 10;
    handleSeek(delta);
    setGestureFeedback({
      icon: side === 'left' ? '<<' : '>>',
      text: `${delta > 0 ? '+10' : '-10'} Saniye`,
    });
    setTimeout(() => setGestureFeedback(null), 800);
  };

  // Simulate automatic failover if stream encounters error
  const triggerSimulatedFailover = () => {
    if (currentChannel && currentChannel.backupStreamUrl) {
      setFailoverToast('Birincil sunucu yanıt vermedi. Ulusal Yedek akışa kesintisiz geçildi.');
      setTimeout(() => setFailoverToast(null), 4000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const drawerChannels = channels.filter(
    (c) => drawerCategory === 'Tümü' || c.category === drawerCategory
  );

  return (
    <div
      onMouseMove={resetControlsTimer}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Active Video Player Screen */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-out ${
          showRightEpgDrawer ? 'w-[calc(100%-420px)] mr-[420px] scale-[0.98]' : 'w-full'
        }`}
      >
        <video
          ref={videoRef}
          src={isLowBitrateMode && currentChannel?.backupStreamUrl ? currentChannel.backupStreamUrl : media.streamUrl}
          autoPlay
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              setDuration(videoRef.current.duration || (isLive ? 7200 : 9600));
            }
          }}
          className={`w-full h-full object-cover transition-all duration-200 ${
            aspectRatio === '21:9'
              ? 'scale-y-[0.77]'
              : aspectRatio === '4:3'
              ? 'scale-x-[0.75]'
              : aspectRatio === 'fill'
              ? 'scale-[1.12]'
              : 'object-contain'
          }`}
        />

        {/* Mobile Double-tap Touch Zones (Left & Right halves) */}
        <div
          onDoubleClick={() => handleDoubleTap('left')}
          className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer opacity-0 hover:opacity-5 transition-opacity bg-white"
          title="Çift Dokunma: 10 sn Geri"
        />
        <div
          onDoubleClick={() => handleDoubleTap('right')}
          className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer opacity-0 hover:opacity-5 transition-opacity bg-white"
          title="Çift Dokunma: 10 sn İleri"
        />

        {/* Gesture feedback badge */}
        {gestureFeedback && (
          <div className="absolute z-40 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono text-sm flex items-center gap-2 animate-in zoom-in-95">
            <span className="text-(--accent-primary) font-bold">{gestureFeedback.icon}</span>
            <span>{gestureFeedback.text}</span>
          </div>
        )}

        {/* Cast Streaming Banner Overlay (if actively casting to Google TV) */}
        {activeCastDevice && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 backdrop-blur-md text-blue-300 text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in">
            <Cast className="w-4 h-4 text-blue-400" />
            <span>Yayın Aktarılıyor: <strong>{activeCastDevice.name}</strong></span>
          </div>
        )}

        {/* Failover Toast Notification */}
        {failoverToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in slide-in-from-top-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{failoverToast}</span>
          </div>
        )}

        {/* External VLC Intent Toast Notification */}
        {externalVlcMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-orange-500/20 border border-orange-500/50 backdrop-blur-xl text-orange-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in slide-in-from-top-4">
            <ExternalLink className="w-4 h-4 text-orange-400" />
            <span>{externalVlcMessage}</span>
          </div>
        )}

        {/* Buffer Underrun Recovery Suggestion (Simulated) */}
        {showBufferAlert && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 p-4 rounded-2xl bg-black/90 border border-amber-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ağ tamponu tükendi. Kesintisiz yayın için 720p düşük bitrate'e geçilsin mi?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsLowBitrateMode(true);
                  setShowBufferAlert(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold"
              >
                Geç (720p)
              </button>
              <button
                onClick={() => setShowBufferAlert(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white"
              >
                Bekle
              </button>
            </div>
          </div>
        )}

        {/* Live Subtitle Overlay */}
        {selectedSubtitle !== 'Kapalı' && (
          <div className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none z-20">
            <span
              style={{
                fontSize: subtitleStyle.size === 'small' ? '16px' : subtitleStyle.size === 'large' ? '26px' : '20px',
                color: subtitleStyle.color,
                backgroundColor: `rgba(0, 0, 0, ${subtitleStyle.bgOpacity})`,
              }}
              className="px-4 py-1.5 rounded-lg font-medium shadow-lg backdrop-blur-sm tracking-wide"
            >
              [Altyazı Aktif: {selectedSubtitle}] — Konuşma metni burada senkron olarak akar.
            </span>
          </div>
        )}

        {/* Direct Numeric Input Box (0-9) */}
        {numericInput && (
          <div className="absolute top-8 right-8 z-40 px-5 py-3 rounded-2xl bg-black/85 border-2 border-(--accent-primary) shadow-2xl flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">Kanal Numarası:</span>
            <span className="text-2xl font-black font-mono text-white tracking-widest text-(--accent-primary)">
              {numericInput}
            </span>
          </div>
        )}

        {/* 1. ZAPPING OSD */}
        {isLive && currentChannel && showZappingOsd && !showLeftChannelDrawer && (
          <div className="absolute bottom-8 left-8 right-8 z-30 flex items-center justify-between p-5 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black font-mono text-(--accent-primary) w-12 text-center">
                {currentChannel.number}
              </span>
              <img
                src={currentChannel.logo}
                alt={currentChannel.name}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{currentChannel.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                    {isLowBitrateMode ? 'HD 720p (Düşük Bitrate)' : currentChannel.resolution}
                  </span>
                  <span className="text-xs text-(--accent-primary)">{currentChannel.category}</span>
                </div>
                {/* Now Playing + Progress */}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-200">
                  <span className="font-semibold">{currentChannel.currentProgram}</span>
                  <span className="text-zinc-500 font-mono">
                    {currentChannel.currentStart} - {currentChannel.currentEnd}
                  </span>
                </div>
                <div className="w-64 h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-(--accent-primary)"
                    style={{ width: `${currentChannel.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-zinc-400">Sonraki Program:</span>
              <span className="text-sm font-semibold text-zinc-200">{currentChannel.nextProgram}</span>
              <span className="text-xs text-zinc-500 font-mono">{currentChannel.nextStart}</span>
            </div>
          </div>
        )}

        {/* 2. TOP CONTROL BAR */}
        {showControls && (
          <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Geri Çık"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col">
                <span className="text-base font-bold text-white">
                  {isLive ? currentChannel?.name : currentVod?.title}
                </span>
                <span className="text-xs text-zinc-400">
                  {isLive ? currentChannel?.currentProgram : episodeTitle || currentVod?.genres.join(' · ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Oynatıcı Motoru & Codec Switcher */}
              <button
                onClick={() => setPlayerEngine(playerEngine === 'vlc' ? 'exoplayer' : 'vlc')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  playerEngine === 'vlc'
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                    : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                }`}
                title="Oynatıcı Motorunu Değiştir (LibVLC vs ExoPlayer)"
              >
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>{playerEngine === 'vlc' ? 'LibVLC Core v3.6' : 'ExoPlayer 2.19'}</span>
                <span className="text-[10px] text-zinc-400 hidden lg:inline font-normal">
                  {playerEngine === 'vlc' ? '(MPEG-TS/AC3)' : '(HLS)'}
                </span>
              </button>

              {/* Deinterlace Yadif 2x Toggle (Live Broadcast) */}
              {isLive && (
                <button
                  onClick={() => setIsDeinterlaceOn(!isDeinterlaceOn)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer hidden md:flex items-center gap-1 ${
                    isDeinterlaceOn
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                      : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                  title="Spor ve 1080i Canlı Yayınlar İçin Yadif (2x) Titreşim Önleyici"
                >
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Yadif: {isDeinterlaceOn ? 'AÇIK (60fps)' : 'KAPALI'}</span>
                </button>
              )}

              {/* Harici VLC Uygulamasında Aç */}
              <button
                onClick={() => {
                  const url = isLowBitrateMode && currentChannel?.backupStreamUrl ? currentChannel.backupStreamUrl : media.streamUrl;
                  setExternalVlcMessage(`Harici VLC oynatıcıya aktarıldı: vlc://${url}`);
                  setTimeout(() => setExternalVlcMessage(null), 4000);
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium transition-all cursor-pointer"
                title="Yayın URL'sini Harici VLC for Android Uygulamasına Yönlendir"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>VLC'de Aç</span>
              </button>

              {/* Failover test trigger */}
              <button
                onClick={triggerSimulatedFailover}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-zinc-400 hover:text-white border border-white/5 cursor-pointer hidden lg:block"
                title="Yedek Kaynağa Otomatik Geçiş Simülasyonu"
              >
                Yedek Akışı Test Et
              </button>

              <button
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10 cursor-pointer"
                title="Yayın Bilgisi (Info Panel - 'i')"
              >
                <Info className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Yayın Bilgisi</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. BOTTOM CONTROL BAR */}
        {showControls && (
          <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30">
            {/* Scrub Progress Bar */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-xs font-mono text-zinc-400 w-12 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current) {
                    videoRef.current.currentTime = ratio * duration;
                  }
                }}
                className="flex-1 h-2 rounded-full bg-white/20 hover:h-2.5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div
                  className="h-full bg-(--accent-primary)"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <span className="text-xs font-mono text-zinc-400 w-12 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between">
              {/* Left group: Play/Pause, ±10s */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-(--accent-primary) text-black hover:opacity-90 transition-all cursor-pointer shadow-lg"
                  title={isPlaying ? 'Duraklat (Space)' : 'Oynat (Space)'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSeek(-10)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="10 sn Geri"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSeek(10)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="10 sn İleri"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Right group */}
              <div className="flex items-center gap-2">
                {/* In-Player Left Channel Drawer toggle */}
                {isLive && (
                  <button
                    onClick={() => {
                      setShowLeftChannelDrawer(!showLeftChannelDrawer);
                      setShowRightEpgDrawer(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      showLeftChannelDrawer
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                    }`}
                    title="Oynatıcı İçi Kanal Listesi (Sol Ok Tuşu)"
                  >
                    <List className="w-4 h-4" />
                    <span>Kanallar</span>
                  </button>
                )}

                {/* Right EPG Drawer toggle */}
                {isLive && (
                  <button
                    onClick={() => {
                      setShowRightEpgDrawer(!showRightEpgDrawer);
                      setShowLeftChannelDrawer(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      showRightEpgDrawer
                        ? 'bg-(--accent-primary) text-black font-semibold'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                    }`}
                    title="Sağ EPG Rehberi (Sağ Ok Tuşu)"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>EPG</span>
                  </button>
                )}

                {/* Multi Audio & Subtitles Panel Trigger */}
                <button
                  onClick={() => setShowAudioSubPanel(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all border border-white/10"
                  title="Ses Parçası ve Altyazı Seçimi ('c')"
                >
                  <Subtitles className="w-4 h-4" />
                  <span>Ses / Altyazı</span>
                </button>

                {/* Aspect Ratio Cycler */}
                <button
                  onClick={() => {
                    const ratios: Array<'16:9' | '21:9' | '4:3' | 'fill'> = ['16:9', '21:9', '4:3', 'fill'];
                    const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
                    setAspectRatio(next);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-medium text-white transition-all border border-white/10"
                  title="En-Boy Oranı Değiştir"
                >
                  {aspectRatio}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. IN-PLAYER LEFT CATEGORY & CHANNEL DRAWER */}
      {showLeftChannelDrawer && (
        <div className="absolute top-0 bottom-0 left-0 w-96 z-40 bg-[#0C0C10]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col p-4 shadow-2xl animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-(--accent-primary)" />
              <span className="text-sm font-bold text-white">Hızlı Kanal Seçimi</span>
            </div>
            <button
              onClick={() => setShowLeftChannelDrawer(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5 py-3 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setDrawerCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  drawerCategory === c
                    ? 'bg-(--accent-primary) text-black font-semibold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5">
            {drawerChannels.map((channel) => {
              const isCurrent = currentChannel?.id === channel.id;
              return (
                <div
                  key={channel.id}
                  onClick={() => onSwitchChannel(channel)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-(--accent-primary)/20 border-(--accent-primary) text-white'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-xs font-mono font-bold text-(--accent-primary) text-center">
                      {channel.number}
                    </span>
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold truncate">{channel.name}</span>
                      <span className="text-[11px] text-zinc-400 truncate">{channel.currentProgram}</span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--accent-primary) text-black font-bold uppercase shrink-0">
                      Yayında
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. IN-PLAYER RIGHT EPG DRAWER */}
      {showRightEpgDrawer && (
        <aside className="absolute top-0 bottom-0 right-0 w-[420px] z-40 bg-[#0C0C10]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col p-5 shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-(--accent-primary)" />
              <span className="text-sm font-bold text-white">Yayın Akışı (EPG)</span>
            </div>
            <button
              onClick={() => setShowRightEpgDrawer(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <img
              src={currentChannel?.logo}
              alt={currentChannel?.name}
              className="w-10 h-10 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">{currentChannel?.name}</span>
              <span className="text-[11px] text-(--accent-primary)">Canlı Yayın Akışı</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 mt-4">
            {EPG_SCHEDULE_DATA.map((prog) => (
              <div
                key={prog.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  prog.isLive
                    ? 'bg-(--accent-primary)/10 border-(--accent-primary)/40'
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{prog.title}</span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {prog.startTime} - {prog.endTime}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  {prog.description}
                </p>
                {prog.isLive && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-(--accent-primary) uppercase tracking-wider">
                    ● ŞU ANDA OYNUYOR
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* 6. TECHNICAL VIDEO INFO PANEL */}
      {showInfoPanel && (
        <div className="absolute top-16 right-8 w-80 z-50 bg-[#16161A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Video Bilgisi (Info)</span>
            </div>
            <button
              onClick={() => setShowInfoPanel(false)}
              className="p-1 rounded hover:bg-white/10 text-zinc-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5 mt-4 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Oynatıcı Motoru:</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                {playerEngine === 'vlc' ? 'LibVLC Core v3.6.0' : 'Google ExoPlayer 2.19'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Konteyner:</span>
              <span className="text-white font-semibold">
                {playerEngine === 'vlc' ? 'MPEG-TS (.ts canlı demuxer)' : 'HLS (.m3u8 akışı)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Çözünürlük:</span>
              <span className="text-white font-semibold">
                {isLowBitrateMode ? '1280×720 (HD 16:9 Adaptif)' : TECHNICAL_VIDEO_INFO_SAMPLE.resolution}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Video Codec:</span>
              <span className="text-zinc-200">HEVC / H.265 Main 10@L5.1 (Direct HW)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Ses Codec:</span>
              <span className="text-zinc-200">Dolby Digital (AC-3 5.1 Passthrough)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Deinterlacing:</span>
              <span className={isDeinterlaceOn ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                {isDeinterlaceOn ? 'Yadif (2x) Aktif — 60 FPS' : 'Devre Dışı'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Bitrate & FPS:</span>
              <span className="text-emerald-400">
                {isLowBitrateMode ? '4.8 Mbps' : `${TECHNICAL_VIDEO_INFO_SAMPLE.bitrateMbps} Mbps`} · {TECHNICAL_VIDEO_INFO_SAMPLE.fps} FPS
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-zinc-500">Buffer Sağlığı:</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {TECHNICAL_VIDEO_INFO_SAMPLE.bufferHealthSeconds}s Hazır (Optimum)
              </span>
            </div>
            <div className="pt-2 border-t border-white/5 text-[10px] text-zinc-400 leading-tight">
              Codec Desteği: MPEG-2, AVC, HEVC 10-bit, AV1, VP9, AC3, E-AC3, DTS, AAC, FLAC
            </div>
          </div>
        </div>
      )}

      {/* 7. MULTI-AUDIO & SUBTITLES PANEL */}
      {showAudioSubPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-(--accent-primary)" />
                Multi Audio & Altyazı Seçimi
              </span>
              <button
                onClick={() => setShowAudioSubPanel(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Track Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Ses Parçası (Multi Audio)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {['Türkçe 5.1 (Orijinal)', 'Türkçe Stereo', 'English 5.1 Dolby', 'Deutsch Stereo', 'Français 5.1'].map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedAudioTrack(track)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedAudioTrack === track
                        ? 'bg-(--accent-primary) text-black font-semibold border-(--accent-primary)'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{track}</span>
                    {selectedAudioTrack === track && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitles Track Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Altyazı Dili
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['Kapalı', 'Türkçe', 'English', 'Deutsch', 'Français', 'Español'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubtitle(sub)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedSubtitle === sub
                        ? 'bg-(--accent-primary) text-black font-semibold border-(--accent-primary)'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubtitle === sub && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {selectedSubtitle !== 'Kapalı' && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                <span>Altyazı Boyutu:</span>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSubtitleStyle({ ...subtitleStyle, size: sz })}
                      className={`px-3 py-1 rounded-lg capitalize ${
                        subtitleStyle.size === sz
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAudioSubPanel(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-(--accent-primary) text-black hover:opacity-90 transition-all"
            >
              Uygula ve Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
