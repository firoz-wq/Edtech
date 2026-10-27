import React, { useState } from 'react';
import { ExpertProfile } from '../types';

interface PeopleViewProps {
  experts: ExpertProfile[];
  onOpenDirectChatWith: (expert: ExpertProfile) => void;
  onShowToast: (message: string) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  experts,
  onOpenDirectChatWith,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'matched' | 'experts' | 'students' | 'near'>('all');
  const [connectedMap, setConnectedMap] = useState<{ [id: string]: boolean }>({
    'exp-2': true, // Sofia is connected
  });
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://sparknet.edu/join?ref=SPK-9042');
    setCopiedInvite(true);
    onShowToast('Personal invite link copied to clipboard!');
    setTimeout(() => setCopiedInvite(false), 2400);
  };

  const toggleConnect = (expert: ExpertProfile) => {
    setConnectedMap((prev) => {
      const next = !prev[expert.id];
      onShowToast(next ? `Connected with ${expert.name}!` : `Connection request canceled`);
      return { ...prev, [expert.id]: next };
    });
  };

  const filteredExperts = experts.filter((exp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        exp.name.toLowerCase().includes(q) ||
        exp.handle.toLowerCase().includes(q) ||
        exp.affiliation.toLowerCase().includes(q) ||
        exp.interests.some((i) => i.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeFilter === 'matched') return exp.matchPercentage >= 90;
    if (activeFilter === 'experts') return exp.isExpert;
    if (activeFilter === 'students') return !exp.isExpert;
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-24">
      <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-5">
        {/* Referral & Growth Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5341cd] via-[#6c5ce7] to-[#5847d2] p-4 shadow-md text-white border border-white/10">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                <span className="material-symbols-outlined text-[14px] text-[#ffdcc5]">celebration</span>
                <span className="font-tech text-[10px] uppercase tracking-wider text-[#ffdcc5] font-bold">
                  Referral Perks Active
                </span>
              </div>
              <h2 className="font-bold text-[17px] leading-tight">
                Invite Peers, Unlock Fast-Track Mentorship
              </h2>
              <p className="text-[12px] opacity-90 leading-relaxed">
                Bring 2 coursemates from your university domain to unlock 1-on-1 priority AMA passes.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 flex items-center gap-2 relative z-10 border-t border-white/15">
            <button
              onClick={handleCopyInvite}
              className="flex-1 py-2 px-3 rounded-full bg-white text-[#5341cd] font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedInvite ? 'check' : 'link'}
              </span>
              <span>{copiedInvite ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
            <button
              onClick={() => onShowToast('Opened campus email invitation composer')}
              className="px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md font-tech text-[12px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Campus Mail</span>
            </button>
          </div>
        </div>

        {/* Deep Search & Filter Suite */}
        <div className="flex flex-col space-y-2.5">
          {/* Omnisearch Bar */}
          <div className="relative flex items-center bg-white rounded-2xl px-3.5 py-2.5 shadow-xs border border-[#eaedff] focus-within:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-[#787586] text-[22px] shrink-0">
              manage_search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try @alex_mit, #SPK-9042, Oxford, Carbon..."
              className="bg-transparent w-full ml-2 text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none"
            />
            <button
              onClick={() => onShowToast('Advanced directory search parameters')}
              className="p-1 rounded-full text-[#787586] hover:text-[#5341cd] transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Filter Chips Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'matched', label: 'Matched to My Interests', sparkle: true },
              { id: 'experts', label: 'Verified Industrial Experts' },
              { id: 'students', label: 'Students' },
              { id: 'near', label: 'Near Me', icon: 'near_me' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id as any)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  activeFilter === chip.id
                    ? 'bg-[#5341cd] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
                }`}
              >
                {chip.sparkle && (
                  <span
                    className="material-symbols-outlined text-[15px] text-amber-300"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                )}
                {chip.icon && (
                  <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
                )}
                <span>{chip.label}</span>
                {chip.sparkle && activeFilter === 'matched' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Profiles Roster */}
        <div className="flex flex-col space-y-4">
          {filteredExperts.map((exp) => {
            const isConnected = connectedMap[exp.id];

            return (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={exp.avatar}
                      alt={exp.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#5341cd]/20"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-[16px] text-[#131b2e] truncate">
                          {exp.name}
                        </h3>
                        {exp.isExpert ? (
                          <span className="material-symbols-outlined text-[#6c5ce7] text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Expert">
                            verified
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-emerald-600 text-[17px] shrink-0" title="Verified Student">
                            school
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-tech text-[#474554] shrink-0 font-bold">
                        {exp.countryFlag}
                      </span>
                    </div>

                    <p className="text-[12px] text-[#474554] truncate mt-0.5">
                      {exp.roleTitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1 font-tech text-[10px]">
                      <span className="text-[#5341cd] font-bold">{exp.handle}</span>
                      {exp.mentorshipStatus && (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          {exp.mentorshipStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Score Callout */}
                <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-start gap-2 border border-[#eaedff]">
                  <span
                    className="material-symbols-outlined text-[#5341cd] text-[18px] shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    insights
                  </span>
                  <div className="min-w-0">
                    <span className="font-tech text-[11px] font-bold text-[#5341cd] block">
                      {exp.matchPercentage}% Interest Match
                    </span>
                    <p className="text-[12px] text-[#474554] truncate">
                      {exp.interests.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Badges / Mutuals */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {exp.projectFocus && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad8] text-[#410006] font-tech text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[13px]">military_tech</span>
                      {exp.projectFocus}
                    </span>
                  )}
                  {exp.sharedRoomsCount && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#474554] font-tech text-[10px]">
                      <span className="material-symbols-outlined text-[13px]">group_work</span>
                      {exp.sharedRoomsCount} shared study rooms
                    </span>
                  )}
                </div>

                {/* Action Suite */}
                <div className="pt-2 flex items-center gap-2 border-t border-[#eaedff]">
                  {exp.isExpert ? (
                    <button
                      onClick={() => onOpenDirectChatWith(exp)}
                      className="flex-1 py-2 px-3 rounded-full bg-[#5341cd] text-white font-tech text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all hover:bg-[#6c5ce7] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">forum</span>
                      <span>Talk to Expert (1:1)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleConnect(exp)}
                      className={`flex-1 py-2 px-3 rounded-full font-tech text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
                        isConnected
                          ? 'bg-[#eaedff] text-[#5341cd]'
                          : 'bg-[#5341cd] text-white hover:bg-[#6c5ce7]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {isConnected ? 'check' : 'person_add'}
                      </span>
                      <span>{isConnected ? 'Connected' : 'Connect'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenDirectChatWith(exp)}
                    className="py-2 px-3 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-tech text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => onShowToast(`Profile link for ${exp.name} copied!`)}
                    className="p-2 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#474554] hover:text-[#5341cd] active:scale-95 transition-all cursor-pointer"
                    title="Share profile"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discovery Footer */}
        <div className="py-3 flex flex-col items-center justify-center space-y-1.5 text-center">
          <div className="w-8 h-8 rounded-full bg-[#eaedff] flex items-center justify-center text-[#5341cd]">
            <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
          </div>
          <p className="font-tech text-[10px] text-[#787586] uppercase tracking-wider">
            Syncing global peers matching your study tracks...
          </p>
        </div>
      </div>
    </div>
  );
};
