import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  RotateCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit3, 
  Check, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { IptvSource } from '../types/tv';

interface SourcesScreenProps {
  sources: IptvSource[];
  activeSourceId: string;
  onSetActiveSource: (id: string) => void;
  onAddSource: (source: IptvSource) => void;
  onUpdateSource: (source: IptvSource) => void;
  onDeleteSource: (id: string) => void;
  onReorderSource: (id: string, direction: 'up' | 'down') => void;
}

export const SourcesScreen: React.FC<SourcesScreenProps> = ({
  sources,
  activeSourceId,
  onSetActiveSource,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onReorderSource,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSource, setEditingSource] = useState<IptvSource | null>(null);

  // New source form state
  const [sourceType, setSourceType] = useState<'xtream' | 'm3u' | 'stalker'>('xtream');
  const [sourceName, setSourceName] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  const handleTestConnection = (source: IptvSource) => {
    setTestingId(source.id);
    setTestResult(null);

    setTimeout(() => {
      setTestingId(null);
      if (source.type === 'stalker' && source.status === 'warning') {
        setTestResult({
          id: source.id,
          success: false,
          message: 'Portal yanıt süresi yüksek (142ms) — MAC adresi yetkilendirme yenilemesi gerekebilir.',
        });
      } else {
        setTestResult({
          id: source.id,
          success: true,
          message: `Bağlantı başarılı! ${source.channelsCount.toLocaleString()} Kanal, ${source.vodCount.toLocaleString()} VOD eşleştirildi (${source.latencyMs}ms).`,
        });
      }
    }, 1200);
  };

  const handleSaveSource = () => {
    if (!sourceName.trim() || !serverUrl.trim()) return;

    if (editingSource) {
      const updated: IptvSource = {
        ...editingSource,
        name: sourceName,
        type: sourceType,
        serverUrl,
        username,
        password,
        macAddress,
        serialNumber,
      };
      onUpdateSource(updated);
      setEditingSource(null);
    } else {
      const newSrc: IptvSource = {
        id: `src_${Date.now()}`,
        name: sourceName,
        type: sourceType,
        serverUrl,
        username,
        password,
        macAddress,
        serialNumber,
        status: 'active',
        channelsCount: sourceType === 'm3u' ? 240 : 3800,
        vodCount: sourceType === 'm3u' ? 0 : 9400,
        seriesCount: sourceType === 'm3u' ? 0 : 1200,
        lastSyncTime: 'Şimdi',
        latencyMs: 42,
        priorityOrder: sources.length + 1,
      };
      onAddSource(newSrc);
      setShowAddModal(false);
    }

    // Reset form
    setSourceName('');
    setServerUrl('');
    setUsername('');
    setPassword('');
    setMacAddress('');
    setSerialNumber('');
  };

  const openEditModal = (src: IptvSource) => {
    setEditingSource(src);
    setSourceName(src.name);
    setSourceType(src.type);
    setServerUrl(src.serverUrl);
    setUsername(src.username || '');
    setPassword(src.password || '');
    setMacAddress(src.macAddress || '');
    setSerialNumber(src.serialNumber || '');
  };

  return (
    <div className="flex flex-col gap-6 select-none pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-(--accent-primary)" />
            <span>IPTV Sağlayıcı Yönetimi</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Xtream Codes, M3U/M3U8 ve Stalker Portal kaynaklarınızı tek merkezden yönetin
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSource(null);
            setSourceName('');
            setServerUrl('');
            setUsername('');
            setPassword('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--accent-primary) text-black font-semibold text-xs hover:opacity-95 transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kaynak Ekle</span>
        </button>
      </div>

      {/* Sources Table / List */}
      <div className="flex flex-col gap-3">
        {sources.map((src, index) => {
          const isActive = src.id === activeSourceId;
          const isTesting = testingId === src.id;
          const result = testResult && testResult.id === src.id ? testResult : null;

          return (
            <div
              key={src.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                isActive
                  ? 'bg-white/[0.05] border-(--accent-primary)/60 shadow-lg shadow-black/40'
                  : 'bg-[#16161A] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Type Badge, Name, Status */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-mono font-bold uppercase text-(--accent-primary)">
                      {src.type}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">{src.name}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-md bg-(--accent-primary) text-black text-[10px] font-bold uppercase">
                          Aktif Kaynak
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-zinc-400 mt-0.5 font-mono">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            src.status === 'active'
                              ? 'bg-emerald-400'
                              : src.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <span className="capitalize">{src.status}</span>
                      </span>
                      <span>·</span>
                      <span>{src.latencyMs}ms</span>
                      <span>·</span>
                      <span>{src.channelsCount} Kanal</span>
                      {src.vodCount > 0 && <span>· {src.vodCount} VOD</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {/* Set Active Button */}
                  {!isActive && (
                    <button
                      onClick={() => onSetActiveSource(src.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 border border-white/5 transition-all"
                    >
                      Aktif Yap
                    </button>
                  )}

                  {/* Test Connection Button */}
                  <button
                    onClick={() => handleTestConnection(src)}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 border border-white/5 transition-all disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-(--accent-primary)' : ''}`} />
                    <span>{isTesting ? 'Test Ediliyor...' : 'Test Et'}</span>
                  </button>

                  {/* Priority Reordering */}
                  <div className="flex items-center gap-0.5 bg-white/5 rounded-lg border border-white/5 p-0.5">
                    <button
                      onClick={() => onReorderSource(src.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Önceliği Yükselt"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onReorderSource(src.id, 'down')}
                      disabled={index === sources.length - 1}
                      className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Önceliği Azalt"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(src)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    title="Düzenle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  {sources.length > 1 && (
                    <button
                      onClick={() => onDeleteSource(src.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                      title="Kaynağı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Test Connection Result Box */}
              {result && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in ${
                    result.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {result.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Source Modal */}
      {(showAddModal || editingSource) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">
              {editingSource ? 'Kaynağı Düzenle' : 'Yeni IPTV Kaynağı Ekle'}
            </h3>

            {/* Type Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/5">
              {[
                { id: 'xtream', label: 'Xtream Codes' },
                { id: 'm3u', label: 'M3U / M3U8' },
                { id: 'stalker', label: 'Stalker Portal' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSourceType(t.id as any)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    sourceType === t.id
                      ? 'bg-(--accent-primary) text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Inputs based on type */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Kaynak Başlığı</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Örn: Ev IPTV VIP Sunucu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary)"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  {sourceType === 'm3u' ? 'M3U / M3U8 URL veya Dosya Yolu' : 'Sunucu / Portal URL'}
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder={
                    sourceType === 'xtream'
                      ? 'http://line.server.com:8080'
                      : sourceType === 'm3u'
                      ? 'https://example.com/playlist.m3u8'
                      : 'http://portal.stalker.tv/c/'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary) font-mono"
                />
              </div>

              {sourceType === 'xtream' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Kullanıcı adı"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary)"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Şifre</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary)"
                    />
                  </div>
                </div>
              )}

              {sourceType === 'stalker' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">MAC Adresi</label>
                    <input
                      type="text"
                      value={macAddress}
                      onChange={(e) => setMacAddress(e.target.value)}
                      placeholder="00:1A:79:..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary) font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Seri Numarası (Opsiyonel)</label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="SN-12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-(--accent-primary) font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5 mt-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSource(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveSource}
                disabled={!sourceName.trim() || !serverUrl.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-(--accent-primary) text-black hover:opacity-90 disabled:opacity-40 transition-all shadow-md"
              >
                {editingSource ? 'Değişiklikleri Kaydet' : 'Kaynağı Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
