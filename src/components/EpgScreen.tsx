import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Play, 
  Bell, 
  RotateCcw, 
  Tv, 
  Search,
  Check
} from 'lucide-react';
import { Channel, EpgProgram } from '../types/tv';
import { EPG_SCHEDULE_DATA } from '../data/mockIptvData';

interface EpgScreenProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const EpgScreen: React.FC<EpgScreenProps> = ({
  channels,
  onSelectChannel,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<EpgProgram | null>(null);
  const [reminders, setReminders] = useState<string[]>([]);

  const days = [
    { label: 'Bugün (Cumartesi)', date: '17 Ekim' },
    { label: 'Pazar', date: '18 Ekim' },
    { label: 'Pazartesi', date: '19 Ekim' },
    { label: 'Salı', date: '20 Ekim' },
    { label: 'Çarşamba', date: '21 Ekim' },
    { label: 'Perşembe', date: '22 Ekim' },
    { label: 'Cuma', date: '23 Ekim' },
  ];

  const timeRuler = [
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00'
  ];

  const toggleReminder = (progId: string) => {
    if (reminders.includes(progId)) {
      setReminders(reminders.filter((id) => id !== progId));
    } else {
      setReminders([...reminders, progId]);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none pb-20">
      {/* Header & 7-Day Day Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-(--accent-primary)" />
            <span>7 Günlük EPG TV Rehberi</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Yayın akışını inceleyin, hatırlatıcı kurun veya geçmiş yayınları (catch-up) izleyin
          </p>
        </div>

        {/* 7-Day Horizontal Bar */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/5 overflow-x-auto no-scrollbar">
          {days.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedDayIndex === idx
                  ? 'bg-(--accent-primary) text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{day.label}</span>
              <span className={`text-[10px] ${selectedDayIndex === idx ? 'text-black/70' : 'text-zinc-500'}`}>
                {day.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Timeline Ruler Header */}
      <div className="flex items-center border-b border-white/10 pb-2 pl-44 text-xs font-mono text-zinc-400">
        {timeRuler.map((t) => (
          <div key={t} className="flex-1 text-center font-semibold text-zinc-400">
            {t}
          </div>
        ))}
      </div>

      {/* Channel Rows with Program Timeline Cells */}
      <div className="flex flex-col gap-3">
        {channels.slice(0, 6).map((channel) => {
          return (
            <div
              key={channel.id}
              className="flex items-stretch rounded-2xl bg-[#16161A]/60 border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
            >
              {/* Channel Header (Left) */}
              <div
                onClick={() => onSelectChannel(channel)}
                className="w-44 flex-none p-3.5 bg-white/[0.02] border-r border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-mono font-bold text-(--accent-primary)">#{channel.number}</span>
                  <span className="text-xs font-semibold text-white truncate">{channel.name}</span>
                </div>
              </div>

              {/* Timeline Programs Row */}
              <div className="flex-1 flex items-center p-2 gap-2 overflow-x-auto no-scrollbar">
                {EPG_SCHEDULE_DATA.map((prog) => {
                  const hasReminder = reminders.includes(prog.id);
                  return (
                    <div
                      key={prog.id}
                      onClick={() => setSelectedProgramDetail(prog)}
                      className={`flex-1 min-w-[200px] p-3 rounded-xl border transition-all cursor-pointer tv-card-focus flex flex-col justify-between h-20 ${
                        prog.isLive
                          ? 'bg-(--accent-primary)/15 border-(--accent-primary)/50 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{prog.title}</span>
                        {prog.isLive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        )}
                        {hasReminder && (
                          <Bell className="w-3 h-3 text-amber-400 fill-current shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mt-1">
                        <span>{prog.startTime} - {prog.endTime}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-zinc-400">
                          {prog.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Detail Popup Modal */}
      {selectedProgramDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#16161A] border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-(--accent-primary)/20 text-(--accent-primary) font-semibold">
                {selectedProgramDetail.startTime} - {selectedProgramDetail.endTime}
              </span>
              <span className="text-xs text-zinc-400">{selectedProgramDetail.category}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">{selectedProgramDetail.title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedProgramDetail.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  toggleReminder(selectedProgramDetail.id);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  reminders.includes(selectedProgramDetail.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>
                  {reminders.includes(selectedProgramDetail.id) ? 'Hatırlatıcı Kuruldu' : 'Hatırlatıcı Kur'}
                </span>
              </button>

              {selectedProgramDetail.hasCatchup && (
                <button
                  onClick={() => {
                    const ch = channels.find((c) => c.id === selectedProgramDetail.channelId) || channels[0];
                    onSelectChannel(ch);
                    setSelectedProgramDetail(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-black hover:opacity-90 transition-all shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Geriye Sar (Catch-up)</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedProgramDetail(null)}
              className="w-full py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 transition-all mt-1"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
