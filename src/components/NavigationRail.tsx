import React, { useState } from 'react';
import { 
  Home, 
  Tv, 
  Film, 
  Clapperboard, 
  CalendarDays, 
  Heart, 
  History,
  Server, 
  Settings, 
  Search,
  Users
} from 'lucide-react';
import { ScreenType, UserProfile, AppLanguage } from '../types/tv';
import { UI_TRANSLATIONS } from '../data/mockIptvData';

interface NavigationRailProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  activeProfile: UserProfile | null;
  onSwitchProfile: () => void;
  isExpanded?: boolean;
  onHoverExpand?: (expanded: boolean) => void;
  language: AppLanguage;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeScreen,
  onNavigate,
  activeProfile,
  onSwitchProfile,
  isExpanded = false,
  onHoverExpand,
  language = 'tr',
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const expanded = isExpanded || internalHover;
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.tr;

  const navItems: Array<{ id: ScreenType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5 shrink-0" /> },
    { id: 'live', label: t.liveTv, icon: <Tv className="w-5 h-5 shrink-0" /> },
    { id: 'movies', label: t.movies, icon: <Film className="w-5 h-5 shrink-0" /> },
    { id: 'series', label: t.series, icon: <Clapperboard className="w-5 h-5 shrink-0" /> },
    { id: 'epg', label: t.epg, icon: <CalendarDays className="w-5 h-5 shrink-0" /> },
    { id: 'favorites', label: t.favorites, icon: <Heart className="w-5 h-5 shrink-0" /> },
    { id: 'history', label: t.history, icon: <History className="w-5 h-5 shrink-0" /> },
    { id: 'sources', label: t.sources, icon: <Server className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: t.settings, icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const handleMouseEnter = () => {
    setInternalHover(true);
    onHoverExpand?.(true);
  };

  const handleMouseLeave = () => {
    setInternalHover(false);
    onHoverExpand?.(false);
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col justify-between py-5 transition-all duration-200 ease-out border-r border-white/5 backdrop-blur-xl ${
        expanded ? 'w-[230px] bg-[#0c0c10]/95 shadow-2xl shadow-black/80' : 'w-[74px] bg-[#0c0c10]/80'
      }`}
      aria-label="LegendStream Navigasyon Rayı"
    >
      {/* Top: Logo & Search */}
      <div className="flex flex-col gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-5 h-11">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--accent-primary) text-black font-extrabold text-base shadow-sm shrink-0">
            L
          </div>
          {expanded && (
            <div className="flex flex-col overflow-hidden transition-opacity duration-200">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">LegendStream</span>
              <span className="text-[10px] text-(--accent-primary) font-semibold tracking-wider uppercase font-mono">XPlayer V2</span>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <div className="px-3">
          <button
            onClick={() => onNavigate('search')}
            className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl transition-all duration-150 text-left ${
              activeScreen === 'search'
                ? 'bg-(--accent-primary) text-black font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Arama"
          >
            <Search className="w-4 h-4 shrink-0 text-zinc-400" />
            {expanded && (
              <span className="text-xs font-medium text-zinc-300 truncate">Hızlı Arama</span>
            )}
          </button>
        </div>

        {/* Primary Nav Items */}
        <nav className="flex flex-col gap-1 px-3 mt-1">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-(--accent-primary) shadow-[0_0_10px_var(--accent-primary)]" />
                )}
                
                <div className={`transition-colors ${isActive ? 'text-(--accent-primary)' : 'group-hover:text-white'}`}>
                  {item.icon}
                </div>

                {expanded && (
                  <span className="text-xs tracking-wide truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Active Profile Switch */}
      <div className="px-3 pt-3 border-t border-white/5">
        <button
          onClick={onSwitchProfile}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left"
          title="Profil Değiştir"
        >
          {activeProfile?.avatar ? (
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 text-zinc-300" />
            </div>
          )}

          {expanded && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {activeProfile ? activeProfile.name : 'Profil Seç'}
              </span>
              <span className="text-[10px] text-zinc-500 truncate">
                {activeProfile?.isKids ? 'Çocuk Modu' : 'Değiştir'}
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
