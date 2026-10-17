import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  CheckCircle, 
  Layers, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Tv, 
  Palette, 
  Sliders, 
  ShieldCheck,
  Download,
  Eye,
  Cast,
  Compass,
  Check,
  Code2,
  Copy,
  Search,
  Filter,
  CheckSquare,
  AlertTriangle,
  Users,
  Flame,
  Clock,
  Radio,
  Sparkles,
  Zap
} from 'lucide-react';
import { FEATURE_MATRIX_DATA, FeatureItem } from '../data/featureMatrixData';

interface DesignSpecModalProps {
  onClose: () => void;
}

type MainTab = 'figma' | 'matrix' | 'beta' | 'arch';

export const DesignSpecModal: React.FC<DesignSpecModalProps> = ({ onClose }) => {
  const [mainTab, setMainTab] = useState<MainTab>('figma');

  // State for B) Feature Matrix Tab
  const [matrixSearch, setMatrixSearch] = useState('');
  const [matrixCategory, setMatrixCategory] = useState<string>('all');
  const [matrixPhase, setMatrixPhase] = useState<'all' | 'MVP' | 'V1'>('all');
  const [copiedJson, setCopiedJson] = useState(false);

  // State for Part D: Architecture 12 sections
  const [activeArchSection, setActiveArchSection] = useState<number>(1);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(FEATURE_MATRIX_DATA, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const categories = ['all', ...Array.from(new Set(FEATURE_MATRIX_DATA.features.map((f) => f.category)))];

  const filteredFeatures = FEATURE_MATRIX_DATA.features.filter((f) => {
    const matchesSearch =
      matrixSearch === '' ||
      f.id.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      f.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      f.acceptance.some((a) => a.toLowerCase().includes(matrixSearch.toLowerCase()));
    const matchesCat = matrixCategory === 'all' || f.category === matrixCategory;
    const matchesPhase = matrixPhase === 'all' || f.phase === matrixPhase;
    return matchesSearch && matchesCat && matchesPhase;
  });

  const archSections = [
    { id: 1, title: '1. Ekran Envanteri & Adaptif Varyantlar' },
    { id: 2, title: '2. Bileşen Kütüphanesi' },
    { id: 3, title: '3. Renk & Tipografi Tokenları' },
    { id: 4, title: '4. Adaptif Kırılım Kuralları (Breakpoints)' },
    { id: 5, title: '5. Etkileşim Matrisi (Dokunma vs TV D-pad)' },
    { id: 6, title: '6. Hata Kurtarma & Ağ Akışları (Recovery)' },
    { id: 7, title: '7. İndirme & Kuyruk Yönetimi Kuralları' },
    { id: 8, title: '8. Profil İzolasyonu & Güvenlik' },
    { id: 9, title: '9. Erişilebilirlik (TalkBack, Font, Motion)' },
    { id: 10, title: '10. Cast & Sesli Arama Mimarisi' },
    { id: 11, title: '11. FTUE (İlk Kullanıcı Turu) & Senkronizasyon' },
    { id: 12, title: '12. Klavye Kısayolları & Marka Monogramı' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 md:p-6 select-none animate-in fade-in">
      <div className="w-full max-w-6xl h-[92vh] rounded-3xl bg-[#121216] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-(--accent-primary) text-black font-extrabold flex items-center justify-center text-sm shadow-md">
              LSX
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>LegendStream XPlayer V2 — Tam Teslim Paketi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  v1.0 Ready
                </span>
              </h2>
              <span className="text-[11px] text-zinc-400 font-mono">
                A) Figma Handoff · B) JSON Feature Matrix · C) Beta Test Planı · D) 12 Bölümlük Şartname
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Main Top-Level Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#141418] border-b border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'figma', label: 'A) Figma Handoff Paketi', icon: <Palette className="w-4 h-4" /> },
            { id: 'matrix', label: `B) JSON Feature Matrix (${FEATURE_MATRIX_DATA.features.length})`, icon: <Code2 className="w-4 h-4" /> },
            { id: 'beta', label: 'C) Beta Test & QA Planı', icon: <CheckSquare className="w-4 h-4" /> },
            { id: 'arch', label: 'D) 12 Bölümlük Şartname', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id as MainTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                mainTab === tab.id
                  ? 'bg-(--accent-primary) text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 text-zinc-200">
          {/* ========================================================= */}
          {/* TAB A: FIGMA HANDOFF PAKETİ                               */}
          {/* ========================================================= */}
          {mainTab === 'figma' && (
            <div className="space-y-8 max-w-5xl">
              {/* A.1 Renk Tokenları */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-(--accent-primary)" />
                    <span>A.1 Renk Tokenları & Renk Körü Uyarlaması</span>
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">13 Token + Protanopia/Deuteranopia/High-Contrast</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {[
                    { token: 'bg/base', hex: '#0A0A0C', use: 'Ana arka plan', sample: '#0A0A0C' },
                    { token: 'bg/surface', hex: '#16161A', use: 'Kart, panel', sample: '#16161A' },
                    { token: 'bg/elevated', hex: '#1F1F24', use: 'Modal, çekmece', sample: '#1F1F24' },
                    { token: 'bg/overlay', hex: 'rgba(0,0,0,0.65)', use: 'Video üstü katman', sample: '#000000' },
                    { token: 'text/primary', hex: '#EDEDED', use: 'Başlık, gövde', sample: '#EDEDED' },
                    { token: 'text/secondary', hex: '#9A9AA0', use: 'İkincil metin', sample: '#9A9AA0' },
                    { token: 'text/disabled', hex: '#5A5A62', use: 'Pasif buton', sample: '#5A5A62' },
                    { token: 'accent/default', hex: '#E0A94A', use: 'Vurgu (varsayılan amber/emerald)', sample: '#E0A94A' },
                    { token: 'accent/alt', hex: '#5FB6E8', use: 'Alternatif buz mavisi', sample: '#5FB6E8' },
                    { token: 'state/success', hex: '#3FBF7F', use: 'Yeşil nokta, başarı', sample: '#3FBF7F' },
                    { token: 'state/warning', hex: '#E0A94A', use: 'Sarı nokta, uyarı', sample: '#E0A94A' },
                    { token: 'state/error', hex: '#E05353', use: 'Kırmızı nokta, hata', sample: '#E05353' },
                    { token: 'focus/ring', hex: 'accent 1px', use: 'D-pad focus çerçevesi', sample: '#10B981' },
                    { token: 'divider', hex: '#26262C', use: 'İnce ayrım çizgisi', sample: '#26262C' },
                  ].map((c) => (
                    <div key={c.token} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg border border-white/20 shrink-0" style={{ backgroundColor: c.sample }} />
                        <span className="text-xs font-mono font-bold text-white truncate">{c.token}</span>
                      </div>
                      <span className="text-[11px] font-mono text-(--accent-primary)">{c.hex}</span>
                      <span className="text-[10px] text-zinc-400 leading-tight">{c.use}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300">
                  <strong className="text-white">Renk Körü Paletleri:</strong> Protanopia, Deuteranopia ve Yüksek Kontrast (4.5:1) modlarında durum renkleri sadece tonlara bağlı kalmaz; semantik ikonlar ve 2px belirgin sınırlarla desteklenir.
                </div>
              </section>

              {/* A.2 Tipografi Tokenları */}
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                  <Sliders className="w-5 h-5 text-(--accent-primary)" />
                  <span>A.2 Tipografi Tokenları (10-Foot TV Ölçeği Dahil)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 font-mono">
                        <th className="py-2.5 px-3">Token Adı</th>
                        <th className="py-2.5 px-3">Compact (&lt;600dp)</th>
                        <th className="py-2.5 px-3">Medium (600–839dp)</th>
                        <th className="py-2.5 px-3">Expanded (840–1279dp)</th>
                        <th className="py-2.5 px-3 text-(--accent-primary)">TV (≥1280dp 10-Foot)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300 font-mono">
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">display/hero</td><td className="py-2 px-3">28sp</td><td className="py-2 px-3">32sp</td><td className="py-2 px-3">36sp</td><td className="py-2 px-3 text-white font-bold">44sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">title/page</td><td className="py-2 px-3">22sp</td><td className="py-2 px-3">26sp</td><td className="py-2 px-3">30sp</td><td className="py-2 px-3 text-white font-bold">42sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">title/section</td><td className="py-2 px-3">18sp</td><td className="py-2 px-3">20sp</td><td className="py-2 px-3">22sp</td><td className="py-2 px-3 text-white font-bold">28sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">body/primary</td><td className="py-2 px-3">16sp</td><td className="py-2 px-3">16sp</td><td className="py-2 px-3">18sp</td><td className="py-2 px-3 text-white font-bold">22sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">body/secondary</td><td className="py-2 px-3">14sp</td><td className="py-2 px-3">14sp</td><td className="py-2 px-3">16sp</td><td className="py-2 px-3 text-white font-bold">20sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">caption</td><td className="py-2 px-3">12sp</td><td className="py-2 px-3">12sp</td><td className="py-2 px-3">13sp</td><td className="py-2 px-3 text-white font-bold">16sp</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans font-semibold">label/button</td><td className="py-2 px-3">14sp</td><td className="py-2 px-3">14sp</td><td className="py-2 px-3">16sp</td><td className="py-2 px-3 text-white font-bold">20sp</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Font: Inter / Plus Jakarta Sans. Ağırlıklar: 300 (display), 400 (body), 500 (label), 600 (button).
                </p>
              </section>

              {/* A.3 & A.4 Boşluk, Yarıçap & Animasyon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-(--accent-primary)" />
                    <span>A.3 Boşluk & Yarıçap Tokenları</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/xs: 4px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/sm: 8px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/md: 16px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/lg: 24px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/xl: 32px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02]">space/2xl: 48px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02] text-emerald-400">radius/card: 14px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02] text-emerald-400">radius/button: 8px</div>
                    <div className="p-2 rounded-xl bg-white/[0.02] text-emerald-400 col-span-2">radius/modal: 20px</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-(--accent-primary)" />
                    <span>A.4 Animasyon Tokenları</span>
                  </h4>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                      <span className="text-zinc-300">motion/fast</span>
                      <span className="text-(--accent-primary)">150ms ease-out</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                      <span className="text-zinc-300">motion/base</span>
                      <span className="text-(--accent-primary)">200ms ease-out</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                      <span className="text-zinc-300">motion/focus</span>
                      <span className="text-(--accent-primary)">180ms cubic-bezier(.2,.8,.2,1)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-white/[0.02]">
                      <span className="text-zinc-300">Reduce-motion</span>
                      <span className="text-amber-400">0ms (Kapatılabilir)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* A.5 Bileşen Kütüphanesi Özeti */}
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                  A.5 Bileşen Kütüphanesi (6 Kategori)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B1. Kartlar</span>
                    <p className="text-zinc-400">PosterCard (1.06x focus), ChannelCard, HeroBanner, ProfileCard (kaynak noktası), SourceRow, DownloadRow, HistoryRow.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B2. Raflar & Listeler</span>
                    <p className="text-zinc-400">HorizontalRail, FilterChips (Tür/Yıl/Sırala), CategoryList (Dikey kategori sütunu).</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B3. Navigasyon</span>
                    <p className="text-zinc-400">BottomBar (5 sekme), NavRail (Expanded), LeftRay (TV 72→230px, LSX V2 monogram), TopBar (Cast, Saat, Profil).</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B4. Oynatıcı Bileşenleri</span>
                    <p className="text-zinc-400">ControlBar, ZappingOSD (3sn fade), LeftDrawer, RightDrawer (EPG), InfoPanel (Codec/Bitrate), AudioSubPanel, ChannelNumberInput, BufferWarning.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B5. Modal & Overlay</span>
                    <p className="text-zinc-400">CastModal, TrailerModal, DownloadModal, FtueTourModal (30sn/3 adım), FailoverBanner (4sn), ConfirmDialog, SourceEditSheet.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="font-bold text-(--accent-primary) block">B6. Durum Bileşenleri</span>
                    <p className="text-zinc-400">SkeletonCard / SkeletonRow, EmptyState, ErrorState, StatusDot (Yeşil/Sarı/Kırmızı).</p>
                  </div>
                </div>
              </section>

              {/* A.6 20 Kritik Frame Tablosu */}
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                  A.6 20 Kritik Frame (4 Sınıf × 5 Ekran)
                </h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 font-mono">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Ekran</th>
                        <th className="py-2 px-3">Compact</th>
                        <th className="py-2 px-3">Medium</th>
                        <th className="py-2 px-3">Expanded</th>
                        <th className="py-2 px-3 text-(--accent-primary)">TV (10-Foot)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      <tr><td className="py-2 px-3 font-mono">1</td><td className="py-2 px-3 font-semibold text-white">Kim İzliyor?</td><td className="py-2 px-3">Alt bar + tek sütun</td><td className="py-2 px-3">Rail + 2 sütun</td><td className="py-2 px-3">Rail + 3 sütun</td><td className="py-2 px-3 font-bold text-white">Sol ray + yatay avatarlar</td></tr>
                      <tr><td className="py-2 px-3 font-mono">2</td><td className="py-2 px-3 font-semibold text-white">Kaynak Ekle</td><td className="py-2 px-3">Tam ekran form</td><td className="py-2 px-3">Form + önizleme</td><td className="py-2 px-3">2 panel form</td><td className="py-2 px-3 font-bold text-white">Tam ekran form + test paneli</td></tr>
                      <tr><td className="py-2 px-3 font-mono">3</td><td className="py-2 px-3 font-semibold text-white">Ana Ekran</td><td className="py-2 px-3">Hero + 2 sütun</td><td className="py-2 px-3">Hero + 4 sütun</td><td className="py-2 px-3">Hero + 6 sütun</td><td className="py-2 px-3 font-bold text-white">Hero + 7 sütun</td></tr>
                      <tr><td className="py-2 px-3 font-mono">4</td><td className="py-2 px-3 font-semibold text-white">Oynatıcı (Canlı)</td><td className="py-2 px-3">Jest + PiP + Cast</td><td className="py-2 px-3">Jest + PiP</td><td className="py-2 px-3">Dokunma + çekmeceler</td><td className="py-2 px-3 font-bold text-white">D-pad + çekmeceler + OSD</td></tr>
                      <tr><td className="py-2 px-3 font-mono">5</td><td className="py-2 px-3 font-semibold text-white">EPG</td><td className="py-2 px-3">Yatay şerit + liste</td><td className="py-2 px-3">2 panel</td><td className="py-2 px-3">2 panel geniş</td><td className="py-2 px-3 font-bold text-white">Zaman şeridi + kanal sütunu</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* A.7 Etkileşim Matrisi */}
              <section className="space-y-3">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                  A.7 Etkileşim Matrisi (Dokunma vs TV D-pad)
                </h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse text-left font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400">
                        <th className="py-2 px-3 font-sans">Aksiyon</th>
                        <th className="py-2 px-3">Compact</th>
                        <th className="py-2 px-3">Medium / Expanded</th>
                        <th className="py-2 px-3 text-(--accent-primary)">TV (Kumanda)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      <tr><td className="py-2 px-3 text-white font-sans">Seçim</td><td className="py-2 px-3">Dokunma</td><td className="py-2 px-3">Dokunma / Fare</td><td className="py-2 px-3 font-bold text-white">OK / Enter</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Geri</td><td className="py-2 px-3">Sistem jesti</td><td className="py-2 px-3">Sistem jesti / Esc</td><td className="py-2 px-3 font-bold text-white">Geri tuşu / Backspace</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Ses / Parlaklık</td><td className="py-2 px-3">Sağ/Sol dikey kaydırma</td><td className="py-2 px-3">Dikey kaydırma</td><td className="py-2 px-3 font-bold text-white">Kumanda ses tuşları</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">±10 sn Sarma</td><td className="py-2 px-3">Kenara çift dokunma</td><td className="py-2 px-3">Çift dokunma</td><td className="py-2 px-3 font-bold text-white">Sol / Sağ yön tuşları</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Kanal Zapping</td><td className="py-2 px-3">Kanal listesi</td><td className="py-2 px-3">Kanal listesi</td><td className="py-2 px-3 font-bold text-white">Yukarı / Aşağı yön tuşları</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">EPG Paneli</td><td className="py-2 px-3">Sağdan kaydırma</td><td className="py-2 px-3">Sağdan kaydırma</td><td className="py-2 px-3 font-bold text-white">Sağ (→) tuşu</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Kanal Çekmecesi</td><td className="py-2 px-3">Sol kenardan kaydırma</td><td className="py-2 px-3">Sol kenardan kaydırma</td><td className="py-2 px-3 font-bold text-white">Sol (←) tuşu</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Video Info</td><td className="py-2 px-3">Uzun basış / buton</td><td className="py-2 px-3">i butonu</td><td className="py-2 px-3 font-bold text-white">'i' tuşu</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Doğrudan Kanal No</td><td className="py-2 px-3">Sanal tuş takımı</td><td className="py-2 px-3">Sanal tuş takımı</td><td className="py-2 px-3 font-bold text-white">0–9 rakamları (2sn timeout)</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Google Cast</td><td className="py-2 px-3">Topbar Cast butonu</td><td className="py-2 px-3">Topbar Cast butonu</td><td className="py-2 px-3 text-zinc-500">— (Zaten TV)</td></tr>
                      <tr><td className="py-2 px-3 text-white font-sans">Sesli Arama</td><td className="py-2 px-3">Mikrofon ikonu</td><td className="py-2 px-3">Mikrofon ikonu</td><td className="py-2 px-3 font-bold text-white">Google TV Asistan Tuşu</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB B: JSON FEATURE MATRIX                                */}
          {/* ========================================================= */}
          {mainTab === 'matrix' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-(--accent-primary)" />
                    <span>JSON Feature Matrix (Tam 40 Özellik)</span>
                  </h3>
                  <span className="text-xs text-zinc-400">
                    MVP & V1 Fazları, platform destekleri ve kabul kriterleri
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer border border-white/10"
                    title="Ham JSON formatında panoya kopyala"
                  >
                    {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedJson ? 'JSON Kopyalandı!' : 'Ham JSON Kopyala'}</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={matrixSearch}
                    onChange={(e) => setMatrixSearch(e.target.value)}
                    placeholder="Özellik adı, ID veya kabul kriteri ara..."
                    className="w-full bg-[#16161A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-(--accent-primary)"
                  />
                </div>

                <select
                  value={matrixCategory}
                  onChange={(e) => setMatrixCategory(e.target.value)}
                  className="bg-[#16161A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-(--accent-primary)"
                >
                  <option value="all">Tüm Kategoriler ({FEATURE_MATRIX_DATA.features.length})</option>
                  {categories.filter((c) => c !== 'all').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="flex rounded-xl bg-[#16161A] border border-white/10 p-0.5 text-xs">
                  {(['all', 'MVP', 'V1'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setMatrixPhase(p)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        matrixPhase === p
                          ? 'bg-(--accent-primary) text-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {p === 'all' ? 'Tümü' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-(--accent-primary)">
                          {feat.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                            {feat.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                              feat.phase === 'MVP'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {feat.phase}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white">{feat.name}</h4>

                      {/* Platforms */}
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <span>Platformlar:</span>
                        <span className="text-zinc-200">{feat.platforms.join(', ')}</span>
                      </div>

                      {/* Acceptance Criteria */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                          Kabul Kriterleri:
                        </span>
                        <ul className="space-y-1 text-xs text-zinc-300">
                          {feat.acceptance.map((acc, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-(--accent-primary) shrink-0 mt-0.5" />
                              <span className="leading-tight">{acc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {feat.screens && feat.screens.length > 0 && (
                      <div className="text-[10px] text-zinc-500 font-mono pt-1">
                        Ekranlar: {feat.screens.join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB C: BETA TEST PLANI                                    */}
          {/* ========================================================= */}
          {mainTab === 'beta' && (
            <div className="space-y-8 max-w-5xl">
              {/* Header */}
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-(--accent-primary)" />
                  <span>C) Beta Test & Kalite Güvence (QA) Planı</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  10 test senaryosu, 12 katılımcı profili, cihaz matrisi ve katı çıkış kriterleri
                </p>
              </div>

              {/* C.1 Hedefler & Başarı Metrikleri */}
              <section className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">
                  C.1 Hedefler & Başarı Metrikleri
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'İlk Yayına Ulaşma', target: '< 60 sn', desc: 'Median kurulum süresi' },
                    { label: 'Kaynak Başarısı', target: '%90', desc: 'İlk denemede bağlanma' },
                    { label: 'Failover Süresi', target: '< 4 sn', desc: 'Yedek akışa geçiş' },
                    { label: 'Crash-Free Oranı', target: '%99.5', desc: 'Hatasız oturum oranı' },
                    { label: 'Zapping Süresi', target: '< 1.5 sn', desc: 'Kanal değişim hızı' },
                    { label: 'FTUE Tamamlama', target: '%70', desc: 'Tur tamamlama oranı' },
                    { label: 'TalkBack Görev', target: '5 / 5', desc: 'Erişilebilirlik senaryosu' },
                    { label: 'SUS Memnuniyet', target: '> 80', desc: 'System Usability Scale' },
                  ].map((m) => (
                    <div key={m.label} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-xs text-zinc-400 font-medium block">{m.label}</span>
                      <span className="text-xl font-mono font-extrabold text-(--accent-primary) block">{m.target}</span>
                      <span className="text-[10px] text-zinc-500">{m.desc}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* C.2 & C.4 Katılımcılar & Cihaz Matrisi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-(--accent-primary)" />
                    <span>C.2 Katılımcı Profili (12 Kişi)</span>
                  </h4>
                  <ul className="text-xs text-zinc-300 space-y-1.5">
                    <li>• <strong>5 TV Kullanıcısı</strong> (Chromecast, Shield, Xiaomi Stick)</li>
                    <li>• <strong>4 Mobil Kullanıcı</strong> (Android 13/14, 4G + Wi-Fi)</li>
                    <li>• <strong>2 Tablet Kullanıcısı</strong> (Samsung Tab S6 Lite)</li>
                    <li>• <strong>1 Chromebook Kullanıcısı</strong> (Lenovo Duet)</li>
                    <li className="pt-2 text-zinc-400 text-[11px] border-t border-white/5">
                      Segment: 4 IPTV Deneyimli + 4 Yeni Kullanıcı + 4 Erişilebilirlik (TalkBack / Düşük Görüş).
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-(--accent-primary)" />
                    <span>C.4 Test Ortamı Matrisi</span>
                  </h4>
                  <div className="overflow-x-auto text-[11px] font-mono">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        <tr><td className="py-1">Chromecast Google TV</td><td>Android 12</td><td className="text-zinc-400">Wi-Fi 5GHz</td></tr>
                        <tr><td className="py-1">Nvidia Shield TV</td><td>Android 11</td><td className="text-zinc-400">Ethernet</td></tr>
                        <tr><td className="py-1">Xiaomi Stick 4K</td><td>Android 11</td><td className="text-zinc-400">Wi-Fi 2.4GHz</td></tr>
                        <tr><td className="py-1">Pixel 6a</td><td>Android 14</td><td className="text-zinc-400">4G + Wi-Fi</td></tr>
                        <tr><td className="py-1">Samsung Galaxy A54</td><td>Android 13</td><td className="text-zinc-400">Wi-Fi</td></tr>
                        <tr><td className="py-1">Galaxy Tab S6 Lite</td><td>Android 13</td><td className="text-zinc-400">Wi-Fi</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* C.3 10 Test Senaryosu */}
              <section className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">
                  C.3 10 Test Senaryosu (Adım Adım QA)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'Senaryo 1', title: 'İlk Kurulum (Tüm Platformlar)', desc: 'İlk açılış → Dil/Tema seçimi → Kim İzliyor → Profil oluştur → Kaynak Ekle (Xtream) → Test Et → İlk kanalı oynat (<60 sn).' },
                    { id: 'Senaryo 2', title: 'Kaynak Çeşitliliği', desc: 'M3U URL, M3U Dosya, Stalker Portal ekleme. Hatalı kimlik denemesi ve düzenleme/silme/öncelik sıralama.' },
                    { id: 'Senaryo 3', title: 'Canlı TV & EPG', desc: 'Kanal zapping, TV Sağ tuşuyla şeffaf EPG çekmecesi, program hatırlatıcısı kurma ve 0-9 doğrudan numara girişi.' },
                    { id: 'Senaryo 4', title: 'VOD & TMDB', desc: 'Film detayını açma, TMDB puanı, oyuncular, benzer içerikler ve fragman modal testi. Favorilere ekleme/çıkarma.' },
                    { id: 'Senaryo 5', title: 'İndirme & Kuyruk', desc: '1080p indirme, 3. indirmede otomatik kuyruk, depolama %95 doluluk testi ve Wi-Fi-only kısıtlaması.' },
                    { id: 'Senaryo 6', title: 'Otomatik Failover', desc: 'Xtream kaynağı kesildiğinde kesintisiz M3U yedeğe geçiş ve 4 sn toast bildirimi.' },
                    { id: 'Senaryo 7', title: 'Profil İzolasyonu', desc: 'Profil A\'da film izleme, Profil B\'ye geçiş (video durur ve bellek temizlenir), Profil B\'de Devam Et boş kalır.' },
                    { id: 'Senaryo 8', title: 'Erişilebilirlik', desc: 'TalkBack ekran okuyucu, sistem yazı tipi %150 ölçekleme, Reduce-motion ve renk körü paleti testi.' },
                    { id: 'Senaryo 9', title: 'FTUE (İlk Tur)', desc: 'Yeni profilde 30 saniyelik 3 adımlı tur gösterimi, her adımda "Atla" kontrolü ve ana ekrana dönüş.' },
                    { id: 'Senaryo 10', title: 'Cast & Sesli Arama', desc: 'Mobil Cast ile TV\'ye aktarma, TV arama çubuğunda mikrofonla sesli tanıma simülasyonu.' },
                  ].map((s) => (
                    <div key={s.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-(--accent-primary)">{s.id}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">{s.title}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* C.5 & C.6 Severity & Çıkış Kriterleri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>C.5 Hata Sınıflandırması (Severity)</span>
                  </h4>
                  <div className="space-y-1.5">
                    <p>• <strong className="text-rose-400">P0 (Kritik):</strong> Oynatma tamamen durur, kaynak eklenemez, çökme yaşanır → 24 saatte fix.</p>
                    <p>• <strong className="text-amber-400">P1 (Yüksek):</strong> Bir ekran çalışmıyor, veri kaybı riski → 1 haftada fix.</p>
                    <p>• <strong className="text-cyan-400">P2 (Orta/Kozmetik):</strong> Kozmetik bozulma, edge-case → 2 haftada fix.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>C.6 Çıkış Kriterleri Kontrol Listesi</span>
                  </h4>
                  <div className="space-y-1 font-mono text-[11px] text-zinc-300">
                    <div>☑ Crash-free &gt; %99.5 (son 7 gün)</div>
                    <div>☑ Ortalama ilk yayın süresi &lt; 60 sn</div>
                    <div>☑ Failover ortalama &lt; 4 sn</div>
                    <div>☑ TalkBack senaryoları 5/5 geçti</div>
                    <div>☑ P0 / P1 açık hata sayısı = 0</div>
                    <div>☑ SUS memnuniyet puanı &gt; 80</div>
                    <div>☑ 5 dilde string taşması yok (DE taşması korundu)</div>
                  </div>
                </div>
              </div>

              {/* C.7 Zaman Çizelgesi */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="font-bold text-white block mb-2">C.7 4 Haftalık Beta Takvimi:</span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                  <div className="p-2 rounded-xl bg-white/[0.03]">Hafta 1: Hazırlık & Pilot (2 Kullanıcı)</div>
                  <div className="p-2 rounded-xl bg-white/[0.03]">Hafta 2: Tam Test (12 Kişi) + Triage</div>
                  <div className="p-2 rounded-xl bg-white/[0.03]">Hafta 3: P0/P1 Fix + SUS Analizi</div>
                  <div className="p-2 rounded-xl bg-(--accent-primary)/10 text-(--accent-primary) border border-(--accent-primary)/30">Hafta 4: Final Doğrulama & Release</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB D: 12 BÖLÜMLÜK MİMARİ ŞARTNAME                        */}
          {/* ========================================================= */}
          {mainTab === 'arch' && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Index Nav */}
              <nav className="w-full md:w-64 flex-none bg-[#16161A]/50 border-r border-white/5 p-3 overflow-x-auto md:overflow-y-auto no-scrollbar flex flex-row md:flex-col gap-1">
                {archSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveArchSection(sec.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all whitespace-nowrap md:whitespace-normal cursor-pointer ${
                      activeArchSection === sec.id
                        ? 'bg-(--accent-primary) text-black font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Content of Active Section */}
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">
                  {archSections.find((s) => s.id === activeArchSection)?.title}
                </h3>

                {activeArchSection === 1 && (
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                    <p>LegendStream XPlayer V2, tek kod tabanıyla Compact (&lt;600dp), Medium (600–839dp), Expanded (840–1279dp) ve TV (≥1280dp) ekran sınıflarını kusursuz şekilde yönetir.</p>
                    <p>Tüm sınıflar aynı içerik ve özellikleri paylaşır; yalnızca kart kolon sayıları, panel konumları ve tipografi ölçekleri adapte olur.</p>
                  </div>
                )}

                {activeArchSection === 6 && (
                  <div className="space-y-3 text-xs text-zinc-300">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-emerald-400 block mb-1">1. Otomatik Failover:</strong>
                      <span>Yayın kesildiğinde 3 saniye içinde M3U yedeğine kesintisiz geçiş ve 4 saniyelik OSD bildirimi.</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <strong className="text-amber-400 block mb-1">2. Çevrimdışı EPG Koruması:</strong>
                      <span>Ağ kesildiğinde ekran boş kalmaz; SQLite/IndexedDB önbelleğindeki son 7 günlük veri gösterilir.</span>
                    </div>
                  </div>
                )}

                {activeArchSection === 7 && (
                  <div className="space-y-3 text-xs text-zinc-300">
                    <p><strong>Kuyruk:</strong> Maksimum eşzamanlı 2 indirme; sıradaki içerikler 'Kuyrukta (Sırada)' bekler.</p>
                    <p><strong>Ağ & Depolama:</strong> Wi-Fi-only indirme koruması, %95 dolulukta otomatik duraklatma ve depolama çubuğu.</p>
                  </div>
                )}

                {activeArchSection === 8 && (
                  <div className="space-y-3 text-xs text-zinc-300">
                    <p><strong>Oynatmayı Güvenli Sonlandırma:</strong> Profil değiştirildiğinde aktif yayın arka planda bırakılmaz; bellek güvenle temizlenir.</p>
                    <p><strong>İzole Veriler:</strong> İzleme geçmişi, favoriler ve indirmeler her profile özeldir.</p>
                  </div>
                )}

                {activeArchSection === 9 && (
                  <div className="space-y-3 text-xs text-zinc-300">
                    <p>TalkBack tam haritası, %150 dinamik tipografi ölçeği, Reduce-motion animasyon kapatma ve Protanopia/Deuteranopia/4.5:1 Yüksek Kontrast modu.</p>
                  </div>
                )}

                {activeArchSection === 10 && (
                  <div className="space-y-3 text-xs text-zinc-300">
                    <p>Google Cast cihaz tarama + tek dokunuş aktarımı ve Google TV sesli asistan mikrofon entegrasyonu.</p>
                  </div>
                )}

                {activeArchSection !== 1 && activeArchSection !== 6 && activeArchSection !== 7 && activeArchSection !== 8 && activeArchSection !== 9 && activeArchSection !== 10 && (
                  <div className="text-xs text-zinc-400 leading-relaxed space-y-2">
                    <p>Bölüm detayları şartname dosyasında ve A/B/C sekmelerinde tam olarak mevcuttur.</p>
                    <p>Figma Handoff sekmesinden token ve bileşen anatomisini, JSON Matrix sekmesinden kabul kriterlerini inceleyebilirsiniz.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
