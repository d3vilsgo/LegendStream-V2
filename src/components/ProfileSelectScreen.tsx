import React, { useState } from 'react';
import { Lock, Plus, Check, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types/tv';

interface ProfileSelectScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onAddProfile: (newProfile: UserProfile) => void;
}

export const ProfileSelectScreen: React.FC<ProfileSelectScreenProps> = ({
  profiles,
  onSelectProfile,
  onAddProfile,
}) => {
  const [pinModalProfile, setPinModalProfile] = useState<UserProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isKidsProfile, setIsKidsProfile] = useState(false);

  const handleProfileClick = (profile: UserProfile) => {
    if (profile.hasPin && profile.pinCode) {
      setPinModalProfile(profile);
      setEnteredPin('');
      setPinError(false);
    } else {
      onSelectProfile(profile);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      if (nextPin.length === 4) {
        if (pinModalProfile && nextPin === pinModalProfile.pinCode) {
          onSelectProfile(pinModalProfile);
          setPinModalProfile(null);
        } else {
          setPinError(true);
          setTimeout(() => {
            setEnteredPin('');
            setPinError(false);
          }, 800);
        }
      }
    }
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProf: UserProfile = {
      id: `prof_${Date.now()}`,
      name: newProfileName.trim(),
      avatar: isKidsProfile
        ? 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      isKids: isKidsProfile,
      hasPin: false,
      accentColor: isKidsProfile ? '#F59E0B' : '#10B981',
      favoriteChannelIds: [],
      favoriteVodIds: [],
      hasCompletedFtue: false,
    };
    onAddProfile(newProf);
    setShowAddModal(false);
    setNewProfileName('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0C] px-6 py-12 relative overflow-hidden select-none">
      {/* Background ambient gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Brand Heading */}
      <div className="flex flex-col items-center mb-12 text-center z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--accent-primary) text-black font-extrabold text-lg">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LegendStream</span>
          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-(--accent-primary) font-mono uppercase font-bold">
            XPlayer V2
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-zinc-100 tracking-tight">
          Kim İzliyor?
        </h1>
        <p className="text-sm text-zinc-400 mt-1.5">
          Devam etmek için profilinizi seçin veya yeni profil oluşturun
        </p>
      </div>

      {/* Profiles Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl z-10">
        {profiles.map((prof) => (
          <button
            key={prof.id}
            onClick={() => handleProfileClick(prof)}
            className="group flex flex-col items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-(--accent-primary) transition-all duration-200 cursor-pointer tv-card-focus text-left"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-(--accent-primary) transition-all shadow-xl">
              <img
                src={prof.avatar}
                alt={prof.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {prof.hasPin && (
                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/75 backdrop-blur-md text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
              {prof.isKids && (
                <div className="absolute bottom-0 inset-x-0 py-1 bg-amber-500/90 text-black font-bold text-[10px] text-center tracking-wider uppercase">
                  Çocuk
                </div>
              )}
            </div>

            <span className="text-sm md:text-base font-medium text-zinc-200 group-hover:text-white transition-colors text-center max-w-[130px] truncate">
              {prof.name}
            </span>
          </button>
        ))}

        {/* Add Profile Card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="group flex flex-col items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-white/20 group-hover:border-white/40 flex flex-col items-center justify-center transition-all bg-white/[0.01]">
            <Plus className="w-8 h-8 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200">
            Profil Ekle
          </span>
        </button>
      </div>

      {/* 4-Digit PIN Modal */}
      {pinModalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#16161A] border border-white/10 p-6 flex flex-col items-center shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-400 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Ebeveyn PIN Kodu</h3>
            <p className="text-xs text-zinc-400 mt-1 text-center">
              <strong className="text-zinc-200">{pinModalProfile.name}</strong> profiline erişmek için 4 haneli PIN girin. (Varsayılan: 1234)
            </p>

            {/* PIN Dots */}
            <div className="flex gap-4 my-6">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    idx < enteredPin.length
                      ? pinError
                        ? 'bg-rose-500 scale-125'
                        : 'bg-(--accent-primary) scale-110 shadow-[0_0_8px_var(--accent-primary)]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 mb-3 flex items-center gap-1 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Hatalı PIN kodu. Tekrar deneyin.
              </p>
            )}

            {/* On-screen Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[220px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Temizle', '0', 'İptal'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'İptal') {
                      setPinModalProfile(null);
                    } else if (key === 'Temizle') {
                      setEnteredPin('');
                    } else {
                      handlePinDigit(key);
                    }
                  }}
                  className="h-11 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-zinc-200 font-semibold text-sm transition-all flex items-center justify-center cursor-pointer border border-white/5"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Yeni Profil Ekle</h3>
            
            <label className="text-xs text-zinc-400 block mb-1">Profil Adı</label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Örn: Salondaki TV, Ayşe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-(--accent-primary) mb-4"
              autoFocus
            />

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={isKidsProfile}
                onChange={(e) => setIsKidsProfile(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Çocuk Profili mi?</span>
                <span className="text-xs text-zinc-400">Yalnızca 12 yaş altı güvenli içerikler ve çizgi filmler listelenir</span>
              </div>
            </label>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-(--accent-primary) text-black hover:opacity-90 transition-all disabled:opacity-40"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
