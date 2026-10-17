export type ScreenType =
  | 'profile_select'
  | 'setup_wizard'
  | 'home'
  | 'live'
  | 'movies'
  | 'series'
  | 'epg'
  | 'favorites'
  | 'history'
  | 'sources'
  | 'settings'
  | 'search'
  | 'player';

export type ScreenClass = 'compact' | 'medium' | 'expanded' | 'tv';
export type DeviceMode = 'auto' | 'compact' | 'medium' | 'expanded' | 'tv';

export type ThemeType = 'emerald' | 'amber' | 'cyan' | 'crimson';
export type AppLanguage = 'tr' | 'en' | 'de' | 'fr' | 'es';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  hasPin: boolean;
  pinCode?: string;
  accentColor?: string;
  favoriteChannelIds: string[];
  favoriteVodIds: string[];
  hasCompletedFtue?: boolean;
}

export interface Channel {
  id: string;
  number: number;
  name: string;
  category: string;
  logo: string;
  streamUrl: string;
  backupStreamUrl?: string;
  currentProgram: string;
  currentStart: string;
  currentEnd: string;
  progressPercent: number;
  nextProgram: string;
  nextStart: string;
  resolution: '4K HDR' | 'FHD 1080p' | 'HD 720p';
  hasCatchup: boolean;
  isFavorite: boolean;
  audioTracks?: string[];
  subtitles?: string[];
}

export interface TmdbCastMember {
  name: string;
  character: string;
  photoUrl: string;
}

export interface VodMedia {
  id: string;
  type: 'movie' | 'series';
  title: string;
  originalTitle?: string;
  year: number;
  duration: string;
  rating: number; // TMDB Score
  tmdbVotes?: number;
  genres: string[];
  synopsis: string;
  director?: string;
  cast?: string[];
  tmdbCast?: TmdbCastMember[];
  poster: string;
  backdrop: string;
  streamUrl: string;
  progress?: number;
  isFavorite: boolean;
  isDownloaded?: boolean;
  trailerUrl?: string;
  similarIds?: string[];
  seasonsCount?: number;
  episodesCount?: number;
  episodes?: Array<{
    id: string;
    season: number;
    episode: number;
    title: string;
    duration: string;
    synopsis: string;
    thumbnail: string;
    isWatched?: boolean;
    isDownloaded?: boolean;
  }>;
}

export interface DownloadItem {
  id: string;
  profileId: string;
  mediaId: string;
  title: string;
  subTitle?: string;
  poster: string;
  quality: '4K HDR' | '1080p FHD' | '720p HD';
  sizeFormatted: string;
  progressPercent: number;
  status: 'downloading' | 'queued' | 'paused' | 'completed' | 'error';
  downloadSpeed: string;
  downloadedAt: string;
  retryCount?: number;
}

export interface WatchHistoryItem {
  id: string;
  profileId: string;
  mediaId: string;
  type: 'live' | 'movie' | 'series';
  title: string;
  subtitle?: string;
  poster: string;
  progressPercent: number;
  duration: string;
  watchedAt: string;
}

export interface EpgProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  startHour: number;
  durationMinutes: number;
  category: string;
  isLive?: boolean;
  hasCatchup?: boolean;
}

export interface IptvSource {
  id: string;
  name: string;
  type: 'xtream' | 'm3u' | 'stalker';
  serverUrl: string;
  username?: string;
  password?: string;
  macAddress?: string;
  serialNumber?: string;
  deviceId?: string;
  status: 'active' | 'warning' | 'error';
  channelsCount: number;
  vodCount: number;
  seriesCount: number;
  lastSyncTime: string;
  latencyMs: number;
  priorityOrder: number;
  isBackupCandidate?: boolean;
  expireDate?: string;
  streamFormat?: 'ts' | 'm3u8';
  vlcCompatible?: boolean;
}

export interface VideoTechnicalInfo {
  resolution: string;
  videoCodec: string;
  audioCodec: string;
  audioChannels: string;
  bitrateMbps: number;
  fps: number;
  bufferHealthSeconds: number;
  bufferStatus: 'optimal' | 'warning' | 'critical';
  connectionHost: string;
  engine?: string;
  containerFormat?: string;
  streamFormat?: 'ts' | 'm3u8';
  demuxer?: string;
  hardwareDecoder?: string;
  deinterlaceMode?: string;
  audioPassthrough?: boolean;
  droppedFrames?: number;
  networkCachingMs?: number;
}

export interface CodecCapability {
  id: string;
  name: string;
  category: 'video' | 'audio' | 'subtitle' | 'container';
  standard: string;
  vlcDecoder: string;
  hardwareSupported: boolean;
  iptvUsage: string;
}

export interface SubtitleStyle {
  size: 'small' | 'medium' | 'large';
  color: string;
  bgColor: string;
  bgOpacity: number;
}

export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'googletv' | 'androidtv';
  ip: string;
}

export interface AppSettings {
  theme: ThemeType;
  language: AppLanguage;
  contentLanguage: AppLanguage;
  fontSize: 'standard' | 'large';
  bufferSizeSec: number;
  autoPlayNext: boolean;
  enablePipPreview: boolean;
  defaultAspectRatio: '16:9' | '21:9' | '4:3' | 'fill';
  enableParentalPin: boolean;
  parentalPin: string;
  epgUpdateIntervalHours: number;
  audioTrack: string;
  subtitleTrack: string;
  subtitleStyle: SubtitleStyle;
  // Player Engine & Codecs
  playerEngine: 'vlc' | 'exoplayer' | 'external';
  hardwareAcceleration: 'full' | 'decoding_only' | 'disabled';
  deinterlaceFilter: 'yadif2x' | 'blend' | 'disabled';
  audioPassthrough: boolean;
  userAgentType: 'vlc' | 'iptvsmarters' | 'exoplayer' | 'custom';
  customUserAgent: string;
  preferSoftwareAudioDecoding: boolean;
  networkCachingMs: number;
  defaultStreamFormat: 'ts' | 'm3u8';
  useExternalPlayer: boolean;
  externalPlayerApp: 'vlc' | 'mxplayer' | 'justplayer';
  enableTmdbMetadata: boolean;
  tmdbApiKey: string;
  autoUpdateContent: boolean;
  lastSyncTime: string;
  // Error Recovery & Network
  autoFailoverBackupSource: boolean;
  adaptiveBufferLowBitrate: boolean;
  // Downloads Management
  downloadQuality: '1080p FHD' | '720p HD';
  wifiOnlyDownloads: boolean;
  autoDeleteWatchedDownloads: boolean;
  maxConcurrentDownloads: number;
  // Accessibility
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia';
  highContrastUi: boolean;
}
