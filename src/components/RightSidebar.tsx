import React, { useState, useEffect } from 'react';
import { LiveStage, ExpertProfile, UpcomingAMA } from '../types';

interface RightSidebarProps {
  stages: LiveStage[];
  upcomingAMA: UpcomingAMA;
  experts: ExpertProfile[];
  onJoinStage: (stage: LiveStage) => void;
  onOpenDirectChat: (expert: ExpertProfile) => void;
  onShowToast: (message: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  stages,
  upcomingAMA,
  experts,
  onJoinStage,
  onOpenDirectChat,
  onShowToast,
}) => {
  const [isRsvpd, setIsRsvpd] = useState(upcomingAMA.isRsvpd);
  const [cd, setCd] = useState({
    hrs: upcomingAMA.startsInHours,
    min: upcomingAMA.startsInMinutes,
    sec: upcomingAMA.startsInSeconds,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCd((prev) => {
        let { hrs, min, sec } = prev;
        sec--;
        if (sec < 0) {
          sec = 59;
          min--;
          if (min < 0) {
            min = 59;
            hrs--;
            if (hrs < 0) {
              hrs = 0;
              min = 0;
              sec = 0;
            }
          }
        }
        return { hrs, min, sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const trendingTopics = [
    { tag: '#GrowTrees', count: '2.4k sparks', category: 'Afforestation', change: '+32%' },
    { tag: '#QuantumBio', count: '1.8k sparks', category: 'Bio-Computing', change: '+45%' },
    { tag: '#MicroForests', count: '940 sparks', category: 'Architecture', change: '+18%' },
    { tag: '#JamesWebbSpectra', count: '820 sparks', category: 'Astrophysics', change: '+12%' },
    { tag: '#BokashiFerment', count: '512 sparks', category: 'Soil Science', change: '+8%' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-72 lg:w-80 shrink-0 border-l border-[#dae2fd]/70 bg-white/60 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto no-scrollbar p-4 space-y-5 z-20">
      {/* 1. Trending Today Section */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ff7675] text-[18px]">
              local_fire_department
            </span>
            <h3 className="font-bold text-[14px] text-[#131b2e]">Trending Today</h3>
          </div>
          <span className="text-[10px] font-tech text-[#5341cd] font-bold">Campus Radar</span>
        </div>

        <div className="divide-y divide-[#eaedff]">
          {trendingTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => onShowToast(`Filtered feed by ${topic.tag}`)}
              className="py-2 first:pt-1 last:pb-0 flex items-center justify-between hover:bg-[#faf8ff] rounded-lg px-1 transition-colors cursor-pointer group"
            >
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[13px] text-[#131b2e] group-hover:text-[#5341cd] truncate">
                  {topic.tag}
                </span>
                <span className="text-[11px] text-[#787586] font-tech">
                  {topic.category} • {topic.count}
                </span>
              </div>
              <span className="font-tech text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                {topic.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Live Rooms Spotlight */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff7675] animate-ping" />
            <h3 className="font-bold text-[14px] text-[#131b2e]">Active Live Stages</h3>
          </div>
          <span className="bg-[#a83639] text-white font-tech text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
            Live Now
          </span>
        </div>

        <div className="flex flex-col space-y-2">
          {stages.slice(0, 2).map((stage) => (
            <div
              key={stage.id}
              onClick={() => onJoinStage(stage)}
              className="p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] transition-all cursor-pointer group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={stage.speaker.avatar}
                    alt={stage.speaker.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <span className="font-bold text-[12px] text-[#131b2e] truncate">
                    {stage.speaker.name}
                  </span>
                </div>
                <span className="text-[10px] font-tech text-[#787586] flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[13px]">visibility</span>
                  {stage.viewersCount}
                </span>
              </div>

              <p className="text-[11px] text-[#474554] font-medium line-clamp-1 leading-snug">
                {stage.title}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                <span className="font-tech text-[10px] text-[#5341cd] font-bold">
                  {stage.type === 'video' ? 'Video Stage' : 'Audio Q&A'}
                </span>
                <span className="text-[10px] font-tech text-[#5341cd] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Join</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Event / AMA Countdown Widget */}
      <div className="bg-gradient-to-br from-[#5341cd] to-[#6c5ce7] text-white rounded-2xl p-4 shadow-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] font-tech">
          <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">Stanford Bio-AI AMA</span>
          <span className="text-white/80">6:00 PM CET</span>
        </div>

        <div>
          <h4 className="font-bold text-[13px] leading-snug line-clamp-2">
            {upcomingAMA.title}
          </h4>
          <span className="text-[11px] text-white/80 block mt-0.5">
            {upcomingAMA.speaker.name}
          </span>
        </div>

        {/* Live Countdown */}
        <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl text-center font-tech">
          <div>
            <span className="text-[14px] font-bold block">{cd.hrs < 10 ? `0${cd.hrs}` : cd.hrs}</span>
            <span className="text-[9px] text-white/70">HOURS</span>
          </div>
          <span className="font-bold">:</span>
          <div>
            <span className="text-[14px] font-bold block">{cd.min < 10 ? `0${cd.min}` : cd.min}</span>
            <span className="text-[9px] text-white/70">MINUTES</span>
          </div>
          <span className="font-bold">:</span>
          <div>
            <span className="text-[14px] font-bold text-[#ffdcc5] block">
              {cd.sec < 10 ? `0${cd.sec}` : cd.sec}
            </span>
            <span className="text-[9px] text-white/70">SECONDS</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsRsvpd(!isRsvpd);
            onShowToast(!isRsvpd ? 'RSVP Confirmed! Added to calendar.' : 'RSVP Removed');
          }}
          className={`w-full py-2 rounded-xl font-tech text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isRsvpd
              ? 'bg-white text-[#5341cd]'
              : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {isRsvpd ? 'check' : 'bookmark_add'}
          </span>
          <span>{isRsvpd ? 'Saved to Calendar' : 'RSVP Reminder'}</span>
        </button>
      </div>

      {/* 4. Suggested Scholars & Peers */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[14px] text-[#131b2e]">Suggested Scholars</h3>
          <span
            onClick={() => onShowToast('Synced with peer registry')}
            className="text-[10px] font-tech text-[#5341cd] font-bold cursor-pointer hover:underline"
          >
            See All
          </span>
        </div>

        <div className="flex flex-col space-y-2.5">
          {experts.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between gap-2">
              <div
                onClick={() => onOpenDirectChat(exp)}
                className="flex items-center gap-2 min-w-0 cursor-pointer group"
              >
                <img
                  src={exp.avatar}
                  alt={exp.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#5341cd]/20 group-hover:ring-[#5341cd]"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[12px] text-[#131b2e] truncate group-hover:text-[#5341cd]">
                      {exp.name}
                    </span>
                    {exp.isExpert && (
                      <span className="material-symbols-outlined text-[#5341cd] text-[13px]">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#787586] font-tech truncate">
                    {exp.matchPercentage}% match • {exp.affiliation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenDirectChat(exp)}
                className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#5341cd] hover:text-white text-[#5341cd] font-tech text-[10px] font-bold transition-all shrink-0 cursor-pointer"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="px-1 text-[11px] text-[#787586] font-tech flex flex-col gap-1">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="hover:underline cursor-pointer">About</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Help Center</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Syndicate Rules</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">API</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
        </div>
        <span>© 2026 Spark Net • Global Academic & Research Network</span>
      </div>
    </aside>
  );
};
