import React, { useState } from 'react';
import { AchievementBadge, OnlineFriend, RecommendationItem, ExpertProfile } from '../types';
import {
  CURRENT_USER,
  USER_ACHIEVEMENTS,
  ONLINE_FRIENDS,
  PROFILE_RECOMMENDATIONS,
} from '../data/mockData';

interface ProfileViewProps {
  onOpenDirectChatWith: (expert: ExpertProfile) => void;
  onNavigateToRoom: (roomId?: string) => void;
  onShowToast: (message: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenDirectChatWith,
  onNavigateToRoom,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'friends' | 'recommendations' | 'contributions'>('achievements');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'research' | 'syndicate' | 'mentorship'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [friendsList, setFriendsList] = useState<OnlineFriend[]>(ONLINE_FRIENDS);
  const [searchFriend, setSearchFriend] = useState('');

  const filteredBadges = USER_ACHIEVEMENTS.filter((b) => {
    if (badgeFilter === 'all') return true;
    if (badgeFilter === 'research') return b.category === 'research';
    if (badgeFilter === 'syndicate') return b.category === 'syndicate';
    if (badgeFilter === 'mentorship') return b.category === 'mentorship' || b.category === 'peer_review';
    return true;
  });

  const filteredFriends = friendsList.filter((f) => {
    if (!searchFriend.trim()) return true;
    const q = searchFriend.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.handle.toLowerCase().includes(q) ||
      f.university.toLowerCase().includes(q) ||
      f.statusActivity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full pb-24">
      {/* 1. Academic Profile Hero Card */}
      <div className="relative bg-white border-b border-[#eaedff]">
        {/* Cover Landscape */}
        <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-gradient-to-r from-[#5341cd] via-[#6c5ce7] to-[#ff7675]">
          <img
            src={CURRENT_USER.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-tech text-[10px] font-bold">
            <span className="material-symbols-outlined text-[13px] text-amber-300">verified</span>
            <span>{CURRENT_USER.stats.reputationScore}</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-4 pb-4 -mt-12 sm:-mt-14 relative z-10 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-white shadow-xl">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20 animate-pulse" />
            </div>

            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => onShowToast('Profile edit modal: You can update bio & research interests')}
                className="px-3.5 py-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-tech text-[12px] font-bold border border-[#eaedff] transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://sparknet.edu/scholar/${CURRENT_USER.handle}`);
                  onShowToast('Profile link copied to clipboard!');
                }}
                className="p-1.5 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#474554] cursor-pointer"
                title="Share Profile"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-[20px] sm:text-[22px] text-[#131b2e] leading-tight">
                {CURRENT_USER.name}
              </h1>
              <span
                className="material-symbols-outlined text-[#5341cd] text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <p className="text-[12px] font-tech text-[#5341cd] font-bold mt-0.5">
              {CURRENT_USER.handle} • {CURRENT_USER.syndicateId}
            </p>
            <p className="text-[13px] text-[#474554] mt-1 font-medium">
              {CURRENT_USER.major}
            </p>
            <p className="text-[12px] text-[#787586] mt-1.5 leading-relaxed">
              {CURRENT_USER.bio}
            </p>
          </div>

          {/* Academic Stats Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#eaedff]">
            <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-xl text-center">
              <span className="font-tech text-[14px] font-extrabold text-[#131b2e]">
                {CURRENT_USER.stats.contributions}
              </span>
              <span className="text-[10px] font-tech text-[#787586] uppercase font-semibold">
                Papers/Nodes
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-xl text-center">
              <span className="font-tech text-[14px] font-extrabold text-[#5341cd]">
                {USER_ACHIEVEMENTS.length}
              </span>
              <span className="text-[10px] font-tech text-[#787586] uppercase font-semibold">
                Badges
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-xl text-center">
              <span className="font-tech text-[14px] font-extrabold text-[#131b2e]">
                {CURRENT_USER.stats.syndicatesJoined}
              </span>
              <span className="text-[10px] font-tech text-[#787586] uppercase font-semibold">
                Syndicates
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#f2f3ff] p-2 rounded-xl text-center">
              <span className="font-tech text-[14px] font-extrabold text-orange-600 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                {CURRENT_USER.stats.streakDays}d
              </span>
              <span className="text-[10px] font-tech text-[#787586] uppercase font-semibold">
                Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#eaedff] bg-[#faf8ff] sticky top-16 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full">
          {[
            {
              id: 'achievements',
              label: 'Achievements & Badges',
              icon: 'military_tech',
              badgeCount: USER_ACHIEVEMENTS.length,
            },
            {
              id: 'friends',
              label: 'Online Friends',
              icon: 'group',
              badgeCount: ONLINE_FRIENDS.length,
            },
            {
              id: 'recommendations',
              label: 'Recommendations',
              icon: 'auto_awesome',
              badgeCount: PROFILE_RECOMMENDATIONS.length,
            },
            {
              id: 'contributions',
              label: 'Research Nodes',
              icon: 'science',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#5341cd] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badgeCount !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-white text-[#5341cd]'
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col space-y-4">
        {/* TAB 1: ACHIEVEMENTS & BADGES (Requested by User) */}
        {activeTab === 'achievements' && (
          <div className="flex flex-col space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'all', label: 'All Badges' },
                  { id: 'research', label: '🔬 Research' },
                  { id: 'syndicate', label: '🏛️ Syndicates' },
                  { id: 'mentorship', label: '🎓 Mentorship & Review' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setBadgeFilter(f.id as any)}
                    className={`px-3 py-1 rounded-full font-tech text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                      badgeFilter === f.id
                        ? 'bg-[#131b2e] text-white'
                        : 'bg-[#f2f3ff] text-[#474554] hover:bg-[#eaedff]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-tech text-[#787586] shrink-0 font-medium hidden sm:block">
                Showing {filteredBadges.length} earned
              </span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    {/* Badge Medallion */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${badge.tierColor} shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-[26px] text-white">
                        {badge.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[14px] text-[#131b2e] leading-snug truncate group-hover:text-[#5341cd]">
                          {badge.title}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full font-tech text-[9px] font-extrabold uppercase shrink-0 ${
                            badge.tier === 'Diamond'
                              ? 'bg-[#e4dfff] text-[#160066]'
                              : badge.tier === 'Gold'
                              ? 'bg-amber-100 text-amber-900'
                              : badge.tier === 'Silver'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-orange-100 text-orange-900'
                          }`}
                        >
                          {badge.tier}
                        </span>
                      </div>

                      <p className="text-[12px] text-[#474554] line-clamp-2 mt-0.5 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress or Rarity Row */}
                  <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-tech">
                    <span className="text-[#5341cd] font-bold">{badge.rarityText}</span>
                    <span className="text-[#787586]">{badge.dateEarned}</span>
                  </div>

                  {badge.progress && (
                    <div className="w-full bg-[#f2f3ff] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#5341cd] h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(badge.progress.current / badge.progress.total) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Participation Milestones Callout */}
            <div className="p-4 bg-gradient-to-r from-[#f2f3ff] via-[#eaedff] to-[#faf8ff] rounded-2xl border border-[#dae2fd] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#5341cd] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[13px] text-[#131b2e] truncate">
                    Next Milestone: "Grand Syndicate Chancellor"
                  </span>
                  <p className="text-[11px] text-[#474554] font-tech mt-0.5">
                    Lead 1 more collaborative research challenge sprint to unlock.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onShowToast('Requirements: Host 1 sprint & verify 10 peer node citations')}
                className="px-3 py-1.5 rounded-full bg-[#5341cd] text-white font-tech text-[11px] font-bold shrink-0 hover:bg-[#6c5ce7] cursor-pointer"
              >
                View Criteria
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ONLINE FRIENDS (Requested by User) */}
        {activeTab === 'friends' && (
          <div className="flex flex-col space-y-3">
            {/* Search Box */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#787586] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFriend}
                onChange={(e) => setSearchFriend(e.target.value)}
                placeholder="Search online peers, universities, or active rooms..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#787586] border border-[#eaedff] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="font-tech text-[11px] font-bold uppercase tracking-wider text-[#787586]">
                {filteredFriends.length} Scholars Online Now
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('https://sparknet.edu/invite?ref=SPK-9042');
                  onShowToast('Peer referral link copied! Invite fellow labmates.');
                }}
                className="text-[11px] font-tech text-[#5341cd] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">person_add</span>
                <span>Invite New Peers</span>
              </button>
            </div>

            {/* Online Friends List */}
            <div className="flex flex-col space-y-2.5">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#5341cd]/20"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[14px] text-[#131b2e] truncate">
                          {friend.name}
                        </span>
                        <span className="text-[10px] text-[#787586] font-tech">
                          {friend.handle}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#474554] truncate">
                        {friend.university}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 text-emerald-700 font-tech text-[10px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="truncate">{friend.statusActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {friend.currentRoom && (
                      <button
                        onClick={() => {
                          onNavigateToRoom();
                          onShowToast(`Jumped into '${friend.currentRoom}' with ${friend.name}`);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#5341cd] font-tech text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                        <span className="hidden sm:inline">Join Room</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenDirectChatWith({
                          id: friend.id,
                          name: friend.name,
                          handle: friend.handle,
                          avatar: friend.avatar,
                          countryFlag: '🇸🇬',
                          roleTitle: friend.university,
                          affiliation: friend.university,
                          isExpert: false,
                          isVerified: true,
                          matchPercentage: 94,
                          interests: ['#EcoFriendly'],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#5341cd] hover:bg-[#6c5ce7] text-white font-tech text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDATIONS (Requested by User) */}
        {activeTab === 'recommendations' && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[15px] text-[#131b2e]">
                  Personalized Academic Recommendations
                </h3>
                <p className="text-[11px] text-[#787586] font-tech">
                  Curated according to your computational bio-materials & CleanTech interest graph
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFILE_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  {rec.imageUrl && (
                    <div className="h-28 w-full relative overflow-hidden bg-[#131b2e]">
                      <img
                        src={rec.imageUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-tech text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-amber-300">
                          auto_awesome
                        </span>
                        <span>{rec.matchScore}% Match</span>
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 bg-[#5341cd] text-white px-2 py-0.5 rounded-md font-tech text-[9px] font-bold uppercase">
                        {rec.type === 'syndicate' ? 'Study Syndicate' : rec.type === 'paper' ? 'Open Dataset' : 'Expert Mentor'}
                      </span>
                    </div>
                  )}

                  <div className="p-3.5 flex flex-col gap-2">
                    <h4 className="font-bold text-[14px] text-[#131b2e] leading-snug line-clamp-2">
                      {rec.title}
                    </h4>
                    <p className="text-[11px] text-[#474554] line-clamp-1">
                      {rec.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.tags.map((t) => (
                        <span
                          key={t}
                          className="bg-[#f2f3ff] text-[#5341cd] font-tech text-[10px] font-semibold px-2 py-0.2 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between">
                      <span className="text-[11px] font-tech text-[#787586]">Recommended for you</span>
                      <button
                        onClick={() => {
                          if (rec.type === 'syndicate') {
                            onNavigateToRoom();
                            onShowToast(`Redirected to '${rec.title}'`);
                          } else if (rec.type === 'mentor') {
                            onShowToast(`Office hour invitation dispatched to ${rec.title}`);
                          } else {
                            onShowToast(`Opened research dataset for '${rec.title}'`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#5341cd] hover:bg-[#6c5ce7] text-white font-tech text-[11px] font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        {rec.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESEARCH CONTRIBUTIONS */}
        {activeTab === 'contributions' && (
          <div className="flex flex-col space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-tech text-[10px] text-[#5341cd] uppercase font-bold">
                  Published Node #1
                </span>
                <span className="text-[11px] font-tech text-[#787586]">3 weeks ago</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#131b2e]">
                Sub-Zero Mycorrhizal Inoculant Blend for Hokkaido Decarbonization
              </h4>
              <p className="text-[12px] text-[#474554] leading-relaxed">
                Peer-reviewed dataset documenting soil respiration, fungal glomalin crystallization, and root-mass density over 90 cold-climate cycles.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-tech text-[#787586] pt-1">
                <span>1.2k citations</span>
                <span>•</span>
                <span>89 peer notes</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">Open Access</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-tech text-[10px] text-[#5341cd] uppercase font-bold">
                  Published Node #2
                </span>
                <span className="text-[11px] font-tech text-[#787586]">2 months ago</span>
              </div>
              <h4 className="font-bold text-[15px] text-[#131b2e]">
                IoT Low-Power Electrochemical pH Probe Calibration Protocol v1.4
              </h4>
              <p className="text-[12px] text-[#474554] leading-relaxed">
                Open hardware firmware files and temperature-compensation algorithms for aeroponic agricultural mist units.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-tech text-[#787586] pt-1">
                <span>420 forks</span>
                <span>•</span>
                <span>34 reviews</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">MIT CleanTech</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#dae2fd] flex flex-col items-center text-center gap-3 animate-slide-up">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-tr ${selectedBadge.tierColor} shadow-xl mt-2`}
            >
              <span className="material-symbols-outlined text-[42px] text-white">
                {selectedBadge.icon}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span
                className={`font-tech text-[11px] font-bold uppercase tracking-wider ${
                  selectedBadge.tier === 'Diamond'
                    ? 'text-[#5341cd]'
                    : selectedBadge.tier === 'Gold'
                    ? 'text-amber-600'
                    : 'text-slate-600'
                }`}
              >
                {selectedBadge.tier} Tier Award
              </span>
              <h3 className="font-extrabold text-[18px] text-[#131b2e] leading-snug">
                {selectedBadge.title}
              </h3>
              <p className="text-[13px] text-[#474554] mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="w-full bg-[#f2f3ff] rounded-2xl p-3 flex flex-col gap-1 text-[11px] font-tech">
              <div className="flex justify-between text-[#787586]">
                <span>Date Earned</span>
                <span className="font-bold text-[#131b2e]">{selectedBadge.dateEarned}</span>
              </div>
              <div className="flex justify-between text-[#787586]">
                <span>Rarity</span>
                <span className="font-bold text-[#5341cd]">{selectedBadge.rarityText}</span>
              </div>
              {selectedBadge.progress && (
                <div className="flex justify-between text-[#787586] pt-1 border-t border-[#eaedff]">
                  <span>Next Level</span>
                  <span className="font-bold text-[#131b2e]">{selectedBadge.progress.label}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#5341cd] text-white font-tech text-[12px] font-bold hover:bg-[#6c5ce7] cursor-pointer shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
