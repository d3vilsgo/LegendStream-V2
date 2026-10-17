import React, { useState } from 'react';
import { 
  Home, 
  Tv, 
  Film, 
  Clapperboard, 
  MoreHorizontal, 
  Heart, 
  History, 
  CalendarDays, 
  Server, 
  Settings,
  Search,
  X
} from 'lucide-react';
import { ScreenType, AppLanguage } from '../types/tv';
import { UI_TRANSLATIONS } from '../data/mockIptvData';

interface BottomNavBarProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  language: AppLanguage;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeScreen,
  onNavigate,
  language = 'tr',
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.tr;

  const mainTabs: Array<{ id: ScreenType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'live', label: t.liveTv, icon: <Tv className="w-5 h-5" /> },
    { id: 'movies', label: t.movies, icon: <Film className="w-5 h-5" /> },
    { id: 'series', label: t.series, icon: <Clapperboard className="w-5 h-5" /> },
  ];

  const moreItems: Array<{ id: ScreenType; label: string; icon: React.ReactNode }> = [
    { id: 'search', label: 'Arama & Ses', icon: <Search className="w-5 h-5 text-emerald-400" /> },
    { id: 'epg', label: t.epg, icon: <CalendarDays className="w-5 h-5 text-(--accent-primary)" /> },
    { id: 'favorites', label: t.favorites, icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { id: 'history', label: t.history, icon: <History className="w-5 h-5 text-amber-400" /> },
    { id: 'sources', label: t.sources, icon: <Server className="w-5 h-5 text-cyan-400" /> },
    { id: 'settings', label: t.settings, icon: <Settings className="w-5 h-5 text-zinc-400" /> },
  ];

  return (
    <>
      {/* Fixed Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0E0E12]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 select-none">
        {mainTabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onNavigate(tab.id);
                setShowMoreSheet(false);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
                isActive ? 'text-(--accent-primary)' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Tab */}
        <button
          onClick={() => setShowMoreSheet(!showMoreSheet)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            showMoreSheet || ['epg', 'favorites', 'history', 'sources', 'settings'].includes(activeScreen)
              ? 'text-(--accent-primary)'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Daha Fazla</span>
        </button>
      </nav>

      {/* "Daha Fazla" Bottom Sheet Drawer */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full bg-[#16161A] rounded-t-3xl border-t border-white/10 p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white">Daha Fazla Seçenek</span>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowMoreSheet(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-semibold text-left transition-all ${
                    activeScreen === item.id
                      ? 'bg-(--accent-primary) text-black border-(--accent-primary)'
                      : 'bg-white/5 text-zinc-200 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
