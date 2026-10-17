import React, { useState, useEffect } from 'react';
import { 
  ScreenType, 
  ScreenClass, 
  DeviceMode, 
  UserProfile, 
  Channel, 
  VodMedia, 
  IptvSource, 
  AppSettings, 
  DownloadItem, 
  WatchHistoryItem,
  CastDevice
} from './types/tv';
import { 
  INITIAL_PROFILES, 
  INITIAL_SETTINGS, 
  CHANNELS_DATA, 
  VOD_MEDIA_DATA, 
  INITIAL_SOURCES, 
  INITIAL_WATCH_HISTORY, 
  INITIAL_DOWNLOADS 
} from './data/mockIptvData';
import { NavigationRail } from './components/NavigationRail';
import { BottomNavBar } from './components/BottomNavBar';
import { TopBar } from './components/TopBar';
import { ProfileSelectScreen } from './components/ProfileSelectScreen';
import { HomeScreen } from './components/HomeScreen';
import { LiveTvScreen } from './components/LiveTvScreen';
import { VodCatalogScreen } from './components/VodCatalogScreen';
import { EpgScreen } from './components/EpgScreen';
import { SearchScreen } from './components/SearchScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SourcesScreen } from './components/SourcesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TvPlayer } from './components/TvPlayer';
import { DownloadsModal } from './components/DownloadsModal';
import { DesignSpecModal } from './components/DesignSpecModal';
import { TvRemoteOverlay } from './components/TvRemoteOverlay';
import { SetupWizardModal } from './components/SetupWizardModal';
import { CastModal } from './components/CastModal';
import { FtueTourModal } from './components/FtueTourModal';

export default function App() {
  // Navigation & Screen State
  const [activeScreen, setActiveScreen] = useState<ScreenType>('profile_select');
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Device & Adaptive Mode ('auto' detects window width, or manual simulation)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  // Settings & Theme
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Media & Catalog State
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_DATA);
  const [vodMedia, setVodMedia] = useState<VodMedia[]>(VOD_MEDIA_DATA);
  const [sources, setSources] = useState<IptvSource[]>(INITIAL_SOURCES);
  const [activeSourceId, setActiveSourceId] = useState<string>(INITIAL_SOURCES[0].id);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(INITIAL_WATCH_HISTORY);
  const [downloads, setDownloads] = useState<DownloadItem[]>(INITIAL_DOWNLOADS);

  // Player & Detail Modal State
  const [activePlayerMedia, setActivePlayerMedia] = useState<VodMedia | Channel | null>(null);
  const [activeEpisodeTitle, setActiveEpisodeTitle] = useState<string | undefined>(undefined);
  const [selectedMediaDetail, setSelectedMediaDetail] = useState<VodMedia | null>(null);

  // Google Cast & Voice Search
  const [showCastModal, setShowCastModal] = useState<boolean>(false);
  const [activeCastDevice, setActiveCastDevice] = useState<CastDevice | null>(null);
  const [autoTriggerVoice, setAutoTriggerVoice] = useState<boolean>(false);

  // FTUE & Modals & Overlays
  const [showFtueTour, setShowFtueTour] = useState<boolean>(false);
  const [showSpecModal, setShowSpecModal] = useState<boolean>(false);
  const [showDownloadsModal, setShowDownloadsModal] = useState<boolean>(false);
  const [showRemote, setShowRemote] = useState<boolean>(false);
  const [showSetupWizard, setShowSetupWizard] = useState<boolean>(false);
  const [isNavRailExpanded, setIsNavRailExpanded] = useState<boolean>(false);

  // Track window resizing for auto screen class detection
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute active screen class (Compact / Medium / Expanded / TV)
  const screenClass: ScreenClass = React.useMemo(() => {
    if (deviceMode !== 'auto') {
      return deviceMode as ScreenClass;
    }
    if (windowWidth < 600) return 'compact';
    if (windowWidth < 840) return 'medium';
    if (windowWidth < 1280) return 'expanded';
    return 'tv';
  }, [deviceMode, windowWidth]);

  // Apply theme & accessibility attributes to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('data-reduce-motion', String(settings.reduceMotion));
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrastUi));
    document.documentElement.setAttribute('data-colorblind', settings.colorBlindMode);
  }, [
    settings.theme,
    settings.fontSize,
    settings.reduceMotion,
    settings.highContrastUi,
    settings.colorBlindMode,
  ]);

  // Global Keyboard listener for TV shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Spec sheet inspector modal with 's' or 'S'
      if ((e.key === 's' || e.key === 'S') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        if (!activePlayerMedia) {
          setShowSpecModal((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlayerMedia]);

  const activeSource = sources.find((s) => s.id === activeSourceId) || sources[0];

  // Playback launch
  const handlePlayMedia = (media: VodMedia | Channel, episode?: string) => {
    setActivePlayerMedia(media);
    setActiveEpisodeTitle(episode);

    // Add to watch history with profile isolation
    const isChannel = 'number' in media;
    const newHistItem: WatchHistoryItem = {
      id: `hist_${Date.now()}`,
      profileId: activeProfile?.id || 'prof_1',
      mediaId: media.id,
      type: isChannel ? 'live' : (media as VodMedia).type,
      title: isChannel ? (media as Channel).name : (media as VodMedia).title,
      subtitle: isChannel
        ? (media as Channel).currentProgram
        : episode || (media as VodMedia).genres[0],
      poster: isChannel ? (media as Channel).logo : (media as VodMedia).poster,
      progressPercent: isChannel ? 100 : 25,
      duration: isChannel ? 'Canlı Yayın' : (media as VodMedia).duration,
      watchedAt: 'Az önce',
    };
    setWatchHistory((prev) => [newHistItem, ...prev.filter((h) => h.mediaId !== media.id)]);
  };

  // Toggle favorite channel
  const handleToggleFavoriteChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  // Toggle favorite VOD
  const handleToggleFavoriteVod = (vodId: string) => {
    setVodMedia((prev) =>
      prev.map((v) => (v.id === vodId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  // Trigger download action with concurrent limit and queue management
  const handleTriggerDownload = (
    media: VodMedia,
    quality: '1080p FHD' | '720p HD',
    episodeTitle?: string
  ) => {
    const activeDlCount = downloads.filter((d) => d.status === 'downloading').length;
    const shouldQueue = activeDlCount >= settings.maxConcurrentDownloads;

    const newDl: DownloadItem = {
      id: `dl_${Date.now()}`,
      profileId: activeProfile?.id || 'prof_1',
      mediaId: media.id,
      title: media.title,
      subTitle: episodeTitle || `${quality} ${shouldQueue ? 'Kuyrukta (Sırada)' : 'İndiriliyor...'}`,
      poster: media.poster,
      quality,
      sizeFormatted: quality === '1080p FHD' ? '3.8 GB' : '1.6 GB',
      progressPercent: shouldQueue ? 0 : 35,
      status: shouldQueue ? 'queued' : 'downloading',
      downloadSpeed: shouldQueue ? '0 KB/s' : '28.4 MB/s',
      downloadedAt: 'Şimdi',
    };
    setDownloads((prev) => [newDl, ...prev]);

    // Mark as downloaded in catalog
    setVodMedia((prev) =>
      prev.map((v) => (v.id === media.id ? { ...v, isDownloaded: true } : v))
    );
  };

  // Toggle Pause/Resume download item
  const handleTogglePauseDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (d.status === 'downloading') {
          return { ...d, status: 'paused', downloadSpeed: '0 KB/s' };
        } else if (d.status === 'paused' || d.status === 'queued') {
          return { ...d, status: 'downloading', downloadSpeed: '24.2 MB/s' };
        }
        return d;
      })
    );
  };

  // Play downloaded media offline
  const handlePlayDownloaded = (download: DownloadItem) => {
    const foundVod = vodMedia.find((v) => v.id === download.mediaId);
    if (foundVod) {
      handlePlayMedia(foundVod);
    }
  };

  // Sources management
  const handleAddSource = (newSource: IptvSource) => {
    setSources((prev) => [...prev, newSource]);
  };

  const handleUpdateSource = (updatedSource: IptvSource) => {
    setSources((prev) => prev.map((s) => (s.id === updatedSource.id ? updatedSource : s)));
  };

  const handleDeleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    if (activeSourceId === id) {
      const remaining = sources.filter((s) => s.id !== id);
      if (remaining.length > 0) setActiveSourceId(remaining[0].id);
    }
  };

  const handleReorderSource = (id: string, direction: 'up' | 'down') => {
    const idx = sources.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sources.length) return;

    const newSources = [...sources];
    const temp = newSources[idx];
    newSources[idx] = newSources[targetIdx];
    newSources[targetIdx] = temp;
    setSources(newSources);
  };

  // If on profile select screen (initial welcoming experience)
  if (activeScreen === 'profile_select' || !activeProfile) {
    return (
      <main className="min-h-screen bg-[#0A0A0C]">
        <ProfileSelectScreen
          profiles={profiles}
          onSelectProfile={(profile) => {
            setActivePlayerMedia(null);
            setActiveProfile(profile);
            setActiveScreen('home');
            if (!profile.hasCompletedFtue) {
              setShowFtueTour(true);
            }
          }}
          onAddProfile={(newProf) => {
            setProfiles((prev) => [...prev, newProf]);
            setActiveProfile(newProf);
            setActiveScreen('home');
            setShowFtueTour(true);
          }}
        />

        {/* Global Spec Sheet Modal */}
        {showSpecModal && <DesignSpecModal onClose={() => setShowSpecModal(false)} />}
      </main>
    );
  }

  // Active TV Player Mode
  if (activePlayerMedia) {
    return (
      <TvPlayer
        media={activePlayerMedia}
        channels={channels}
        onClose={() => setActivePlayerMedia(null)}
        onSwitchChannel={(ch) => setActivePlayerMedia(ch)}
        episodeTitle={activeEpisodeTitle}
        activeCastDevice={activeCastDevice}
        autoFailover={settings.autoFailoverBackupSource}
        adaptiveBuffer={settings.adaptiveBufferLowBitrate}
        initialPlayerEngine={settings.playerEngine}
        deinterlaceFilter={settings.deinterlaceFilter}
      />
    );
  }

  const isCompact = screenClass === 'compact';
  const isMedium = screenClass === 'medium';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDED] flex flex-col relative select-none">
      {/* 1. TOP BAR */}
      <TopBar
        activeProfile={activeProfile}
        activeSource={activeSource}
        onOpenSpecModal={() => setShowSpecModal(true)}
        onToggleRemote={() => setShowRemote(!showRemote)}
        isRemoteOpen={showRemote}
        onOpenSearch={() => {
          setAutoTriggerVoice(false);
          setActiveScreen('search');
        }}
        onOpenDownloads={() => setShowDownloadsModal(true)}
        downloadsCount={downloads.length}
        currentLanguage={settings.language}
        onChangeLanguage={(lang) => setSettings({ ...settings, language: lang, contentLanguage: lang })}
        deviceMode={deviceMode}
        onChangeDeviceMode={(mode) => setDeviceMode(mode)}
        onOpenCastModal={() => setShowCastModal(true)}
        activeCastDevice={activeCastDevice}
        onTriggerVoiceSearch={() => {
          setAutoTriggerVoice(true);
          setActiveScreen('search');
        }}
      />

      {/* 2. BODY LAYOUT: Navigation + Content */}
      <div className="flex-1 flex w-full relative">
        {/* Navigation Rail (Medium, Expanded, TV) */}
        {!isCompact && (
          <NavigationRail
            activeScreen={activeScreen}
            onNavigate={(screen) => setActiveScreen(screen)}
            activeProfile={activeProfile}
            onSwitchProfile={() => {
              setActivePlayerMedia(null);
              setActiveScreen('profile_select');
            }}
            isExpanded={isNavRailExpanded}
            onHoverExpand={setIsNavRailExpanded}
            language={settings.language}
          />
        )}

        {/* Primary Content Viewport */}
        <main
          className={`flex-1 transition-all duration-200 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full ${
            isCompact ? 'pb-24' : isMedium ? 'ml-[74px]' : 'ml-[74px] md:ml-[80px]'
          }`}
        >
          {activeScreen === 'home' && (
            <HomeScreen
              channels={channels}
              vodMedia={vodMedia}
              onPlayMedia={handlePlayMedia}
              onOpenDetails={(media) => setSelectedMediaDetail(media)}
              onNavigate={(s) => setActiveScreen(s)}
              language={settings.language}
            />
          )}

          {activeScreen === 'search' && (
            <SearchScreen
              channels={channels}
              vodMedia={vodMedia}
              onPlayMedia={handlePlayMedia}
              onOpenDetails={(media) => setSelectedMediaDetail(media)}
              autoTriggerVoice={autoTriggerVoice}
            />
          )}

          {activeScreen === 'live' && (
            <LiveTvScreen
              channels={channels}
              onSelectChannel={handlePlayMedia}
              onToggleFavorite={handleToggleFavoriteChannel}
              enablePip={settings.enablePipPreview}
            />
          )}

          {(activeScreen === 'movies' || activeScreen === 'series') && (
            <VodCatalogScreen
              type={activeScreen === 'movies' ? 'movie' : 'series'}
              mediaList={vodMedia}
              onPlayMedia={handlePlayMedia}
              onToggleFavorite={handleToggleFavoriteVod}
              onTriggerDownload={handleTriggerDownload}
              selectedMediaDetail={selectedMediaDetail}
              onCloseDetail={() => setSelectedMediaDetail(null)}
              onSelectMediaDetail={(media) => setSelectedMediaDetail(media)}
            />
          )}

          {activeScreen === 'epg' && (
            <EpgScreen
              channels={channels}
              onSelectChannel={handlePlayMedia}
            />
          )}

          {activeScreen === 'favorites' && (
            <FavoritesScreen
              channels={channels}
              vodMedia={vodMedia}
              onPlayMedia={handlePlayMedia}
              onOpenDetails={(media) => setSelectedMediaDetail(media)}
              onToggleFavoriteChannel={handleToggleFavoriteChannel}
              onToggleFavoriteVod={handleToggleFavoriteVod}
            />
          )}

          {activeScreen === 'history' && (
            <HistoryScreen
              historyItems={watchHistory.filter((h) => !activeProfile || h.profileId === activeProfile.id)}
              channels={channels}
              vodMedia={vodMedia}
              onPlayMedia={handlePlayMedia}
              onClearHistory={() => setWatchHistory((prev) => prev.filter((h) => activeProfile && h.profileId !== activeProfile.id))}
            />
          )}

          {activeScreen === 'sources' && (
            <SourcesScreen
              sources={sources}
              activeSourceId={activeSourceId}
              onSetActiveSource={(id) => setActiveSourceId(id)}
              onAddSource={handleAddSource}
              onUpdateSource={handleUpdateSource}
              onDeleteSource={handleDeleteSource}
              onReorderSource={handleReorderSource}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={(newSet) => setSettings(newSet)}
              activeProfile={activeProfile}
              profiles={profiles}
            />
          )}
        </main>
      </div>

      {/* 3. Bottom Navigation Bar for Compact (Mobile Portrait) Screens */}
      {isCompact && (
        <BottomNavBar
          activeScreen={activeScreen}
          onNavigate={(s) => setActiveScreen(s)}
          language={settings.language}
        />
      )}

      {/* 4. MODALS & ASSISTANTS */}
      {/* Offline Downloads Modal */}
      {showDownloadsModal && (
        <DownloadsModal
          downloads={downloads}
          onClose={() => setShowDownloadsModal(false)}
          onPlayDownloaded={handlePlayDownloaded}
          onDeleteDownload={(id) => setDownloads((prev) => prev.filter((d) => d.id !== id))}
          onTogglePauseDownload={handleTogglePauseDownload}
          wifiOnly={settings.wifiOnlyDownloads}
        />
      )}

      {/* Google Cast Device Selector Modal */}
      {showCastModal && (
        <CastModal
          onClose={() => setShowCastModal(false)}
          activeCastDevice={activeCastDevice}
          onConnectDevice={(device) => setActiveCastDevice(device)}
          onDisconnectDevice={() => setActiveCastDevice(null)}
        />
      )}

      {/* FTUE First-Time User Experience Tour */}
      {showFtueTour && (
        <FtueTourModal
          onComplete={() => {
            setShowFtueTour(false);
            if (activeProfile) {
              setProfiles((prev) =>
                prev.map((p) => (p.id === activeProfile.id ? { ...p, hasCompletedFtue: true } : p))
              );
            }
          }}
        />
      )}

      {/* 12-Part Design Spec & Architecture Inspector Modal */}
      {showSpecModal && (
        <DesignSpecModal onClose={() => setShowSpecModal(false)} />
      )}

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <SetupWizardModal
          onClose={() => setShowSetupWizard(false)}
          onComplete={(newSrc) => {
            handleAddSource(newSrc);
            setActiveSourceId(newSrc.id);
            setShowSetupWizard(false);
          }}
        />
      )}

      {/* Floating Virtual TV Remote Controller */}
      {showRemote && (
        <TvRemoteOverlay
          onClose={() => setShowRemote(false)}
          onSendKey={() => {}}
        />
      )}
    </div>
  );
}
