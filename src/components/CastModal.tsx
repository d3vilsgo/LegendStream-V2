import React, { useState } from 'react';
import { Cast, Tv, Smartphone, Check, X, Wifi, Radio } from 'lucide-react';
import { CastDevice } from '../types/tv';
import { CAST_DEVICES } from '../data/mockIptvData';

interface CastModalProps {
  onClose: () => void;
  activeCastDevice: CastDevice | null;
  onConnectDevice: (device: CastDevice) => void;
  onDisconnectDevice: () => void;
}

export const CastModal: React.FC<CastModalProps> = ({
  onClose,
  activeCastDevice,
  onConnectDevice,
  onDisconnectDevice,
}) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleDeviceClick = (dev: CastDevice) => {
    if (activeCastDevice?.id === dev.id) {
      onDisconnectDevice();
    } else {
      setConnectingId(dev.id);
      setTimeout(() => {
        onConnectDevice(dev);
        setConnectingId(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-md rounded-3xl bg-[#16161A] border border-white/10 p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Cast / Ekran Yansıt</h3>
              <p className="text-xs text-zinc-400">Yayınları yakındaki TV veya ekrana aktarın</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Devices List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            Bulunan Cihazlar
          </span>

          {CAST_DEVICES.map((device) => {
            const isConnected = activeCastDevice?.id === device.id;
            const isConnecting = connectingId === device.id;

            return (
              <button
                key={device.id}
                onClick={() => handleDeviceClick(device)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isConnected
                    ? 'bg-blue-500/15 border-blue-500 text-white shadow-md'
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? 'bg-blue-500 text-black' : 'bg-white/5 text-zinc-400'}`}>
                    <Tv className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{device.name}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">{device.ip} · {device.type.toUpperCase()}</span>
                  </div>
                </div>

                {isConnecting ? (
                  <span className="text-xs text-blue-400 font-medium">Bağlanıyor...</span>
                ) : isConnected ? (
                  <span className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
                    <Check className="w-4 h-4" /> Bağlı
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500">Aktar</span>
                )}
              </button>
            );
          })}
        </div>

        {activeCastDevice && (
          <button
            onClick={() => {
              onDisconnectDevice();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            Yayını Sonlandır ({activeCastDevice.name})
          </button>
        )}
      </div>
    </div>
  );
};
