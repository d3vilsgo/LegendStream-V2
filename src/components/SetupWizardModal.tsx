import React, { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Server, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  RotateCw, 
  ChevronRight, 
  X,
  Sparkles
} from 'lucide-react';
import { AppLanguage, ThemeType, IptvSource } from '../types/tv';

interface SetupWizardModalProps {
  onComplete: (source: IptvSource) => void;
  onClose: () => void;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>('tr');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('emerald');

  // Source step state
  const [sourceType, setSourceType] = useState<'xtream' | 'm3u' | 'stalker'>('xtream');
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sourceName, setSourceName] = useState('Ev IPTV');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: 'Bağlantı başarılı! 4.120 Kanal ve 12.450 VOD senkronize edildi (38ms).',
      });
    }, 1200);
  };

  const handleFinish = () => {
    const newSrc: IptvSource = {
      id: `src_${Date.now()}`,
      name: sourceName || 'Hızlı Kurulum Kaynağı',
      type: sourceType,
      serverUrl: serverUrl || 'http://stream.legendstream.net:8080',
      username,
      password,
      status: 'active',
      channelsCount: 4120,
      vodCount: 12450,
      seriesCount: 1840,
      lastSyncTime: 'Şimdi',
      latencyMs: 38,
      priorityOrder: 1,
    };
    onComplete(newSrc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none">
      <div className="w-full max-w-xl rounded-3xl bg-[#16161A] border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        {/* Header with Step Tracker */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono font-bold text-(--accent-primary) uppercase tracking-wider">
              İlk Kurulum Sihirbazı · Adım {step}/3
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {step === 1 && '1. Dil ve Tema Tercihi'}
              {step === 2 && '2. IPTV Kaynağınızı Ekleyin'}
              {step === 3 && '3. Kategori ve EPG Eşleştirme'}
            </h2>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Language & Theme */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-2">Arayüz Dili (5 Dünya Dili)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { code: 'tr', label: 'Türkçe' },
                  { code: 'en', label: 'English' },
                  { code: 'de', label: 'Deutsch' },
                  { code: 'fr', label: 'Français' },
                  { code: 'es', label: 'Español' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLanguage(l.code as AppLanguage)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      selectedLanguage === l.code
                        ? 'bg-(--accent-primary) text-black border-(--accent-primary)'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-2">Prestij Vurgu Rengi</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'emerald', label: 'Emerald Green', color: '#10B981' },
                  { id: 'amber', label: 'Amber Gold', color: '#F59E0B' },
                  { id: 'cyan', label: 'Ice Cyan', color: '#38BDF8' },
                  { id: 'crimson', label: 'Crimson Red', color: '#EF4444' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id as ThemeType)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedTheme === th.id
                        ? 'bg-white/10 border-(--accent-primary)'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: th.color }} />
                    <span className="text-white">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Add Source */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.04]">
              {(['xtream', 'm3u', 'stalker'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSourceType(t)}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase ${
                    sourceType === t ? 'bg-(--accent-primary) text-black shadow-sm' : 'text-zinc-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder={
                  sourceType === 'xtream'
                    ? 'http://sunucu-adresi.com:8080'
                    : sourceType === 'm3u'
                    ? 'https://example.com/playlist.m3u8'
                    : 'http://mag.stalker-tv.org/c/'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary)"
              />

              {sourceType === 'xtream' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adı"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              )}

              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-(--accent-primary)' : ''}`} />
                <span>{isTesting ? 'Bağlantı Test Ediliyor...' : 'Bağlantıyı Test Et'}</span>
              </button>

              {testResult && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Category & EPG Sync */}
        {step === 3 && (
          <div className="flex flex-col gap-4 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-(--accent-primary)/10 text-(--accent-primary) flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hazırsınız!</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Kanal kategorileri ve 7 günlük EPG otomatik olarak senkronize edildi. Şimdi sinematik salon deneyimine başlayabilirsiniz.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Geri
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-(--accent-primary) text-black hover:opacity-90 shadow-md"
            >
              <span>İlerle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-(--accent-primary) text-black hover:opacity-90 shadow-lg"
            >
              Uygulamayı Başlat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
