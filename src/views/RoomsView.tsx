import React, { useState } from 'react';
import { RoomHub } from '../types';

interface RoomsViewProps {
  rooms: RoomHub[];
  onOpenCreateRoomModal: () => void;
  onNavigateToGroupSettings: (roomId?: string) => void;
  onShowToast: (message: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  rooms,
  onOpenCreateRoomModal,
  onNavigateToGroupSettings,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hubs' | 'shortcuts'>('hubs');
  const [activeFilter, setActiveFilter] = useState<
    | 'all'
    | 'trending'
    | 'joined'
    | 'eco'
    | 'frontier'
    | 'motors'
    | 'space'
    | 'clean_energy'
    | 'biotech'
    | 'sports'
    | 'creative'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedRooms, setJoinedRooms] = useState<{ [id: string]: boolean }>(() => {
    const init: { [id: string]: boolean } = {};
    rooms.forEach((r) => {
      init[r.id] = r.isJoined || false;
    });
    return init;
  });

  // Share & QR Modal
  const [shareModalRoom, setShareModalRoom] = useState<RoomHub | null>(null);

  const toggleJoin = (roomId: string, title: string) => {
    setJoinedRooms((prev) => {
      const next = !prev[roomId];
      onShowToast(next ? `Joined '${title}' hub!` : `Left '${title}'`);
      return { ...prev, [roomId]: next };
    });
  };

  const filteredRooms = rooms.filter((room) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        room.title.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        room.categoryLabel.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeFilter === 'joined') return joinedRooms[room.id];
    if (activeFilter === 'eco') return room.category === 'eco' || room.categoryLabel.toLowerCase().includes('eco');
    if (activeFilter === 'frontier') return room.category === 'frontier' || room.categoryLabel.toLowerCase().includes('frontier') || room.categoryLabel.toLowerCase().includes('ai');
    if (activeFilter === 'motors') return room.title.toLowerCase().includes('motor') || room.title.toLowerCase().includes('energy') || room.description.toLowerCase().includes('car') || room.description.toLowerCase().includes('powertrain');
    if (activeFilter === 'space') return room.title.toLowerCase().includes('galaxy') || room.title.toLowerCase().includes('earth') || room.description.toLowerCase().includes('space') || room.description.toLowerCase().includes('astrophysics');
    if (activeFilter === 'clean_energy') return room.title.toLowerCase().includes('renewable') || room.title.toLowerCase().includes('energy') || room.description.toLowerCase().includes('clean');
    if (activeFilter === 'biotech') return room.title.toLowerCase().includes('bio') || room.title.toLowerCase().includes('living') || room.description.toLowerCase().includes('health');
    if (activeFilter === 'sports') return room.title.toLowerCase().includes('sport') || room.description.toLowerCase().includes('athletic');
    if (activeFilter === 'creative') return room.title.toLowerCase().includes('creative') || room.description.toLowerCase().includes('game') || room.description.toLowerCase().includes('vfx');
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-24">
      {/* View Switcher: Collective Hubs vs My Rooms & Shortcuts */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#eaedff] p-1 rounded-full">
          <button
            onClick={() => setActiveSubTab('hubs')}
            className={`px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold transition-all cursor-pointer ${
              activeSubTab === 'hubs'
                ? 'bg-[#5341cd] text-white shadow-xs'
                : 'text-[#474554] hover:text-[#5341cd]'
            }`}
          >
            Collective Hubs
          </button>
          <button
            onClick={() => setActiveSubTab('shortcuts')}
            className={`px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeSubTab === 'shortcuts'
                ? 'bg-[#5341cd] text-white shadow-xs'
                : 'text-[#474554] hover:text-[#5341cd]'
            }`}
          >
            <span>My Rooms & Shortcuts</span>
          </button>
        </div>

        <button
          onClick={onOpenCreateRoomModal}
          className="w-9 h-9 rounded-full bg-[#5341cd]/10 text-[#5341cd] hover:bg-[#5341cd] hover:text-white transition-all flex items-center justify-center cursor-pointer"
          title="Create Hub"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>

      {/* SUB-VIEW 1: COLLECTIVE HUBS (Image 8 & 9) */}
      {activeSubTab === 'hubs' && (
        <div className="flex flex-col gap-4 px-4 pt-1">
          {/* Search bar & Filter Pills */}
          <div className="flex flex-col gap-2.5">
            <div className="relative w-full flex items-center bg-white rounded-xl shadow-xs border border-[#eaedff] px-3.5 py-2.5">
              <span className="material-symbols-outlined text-[#787586] text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 350+ interest communities..."
                className="w-full bg-transparent ml-2 text-[14px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onShowToast('Filter settings')}
                className="p-1 rounded-full text-[#474554] hover:text-[#5341cd] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>

            {/* Filter Pills Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: 'All Hubs' },
                { id: 'trending', label: 'Trending', icon: 'local_fire_department', iconColor: 'text-[#ff7675]' },
                { id: 'joined', label: 'My Groups (4)' },
                { id: 'eco', label: 'Eco & Earth', icon: 'eco' },
                { id: 'frontier', label: 'Frontier AI & Sci', icon: 'smart_toy' },
                { id: 'motors', label: 'Motors & EV', icon: 'directions_car' },
                { id: 'space', label: 'Space & Astro', icon: 'rocket_launch' },
                { id: 'clean_energy', label: 'Clean Energy', icon: 'bolt' },
                { id: 'biotech', label: 'BioTech & Health', icon: 'biotech' },
                { id: 'sports', label: 'Sports Science', icon: 'sports_volleyball' },
                { id: 'creative', label: 'Creative Tech', icon: 'movie_filter' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id as any)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    activeFilter === pill.id
                      ? 'bg-[#5341cd] text-white shadow-xs'
                      : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
                  }`}
                >
                  {pill.icon && (
                    <span className={`material-symbols-outlined text-[15px] ${pill.iconColor || ''}`}>
                      {pill.icon}
                    </span>
                  )}
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Highlight / Live Synergy Radar */}
          <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#5341cd]/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7675] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff7675]" />
                </span>
                <span className="font-tech text-[11px] uppercase tracking-wider text-[#5341cd] font-bold">
                  Live Synergy Radar
                </span>
              </div>
              <span className="font-tech text-[12px] text-[#787586]">2,481 active scholars</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#131b2e] leading-snug">Spark Collective Hubs</h3>
            <p className="text-[13px] text-[#474554] leading-relaxed">
              Jump into active audio channels, synchronous study desks, and curated research vaults.
            </p>
          </div>

          {/* Categories Sections */}
          {(['eco', 'frontier', 'living'] as const).map((cat) => {
            const catRooms = filteredRooms.filter((r) => r.category === cat);
            if (catRooms.length === 0) return null;

            const categoryTitle =
              cat === 'eco'
                ? 'Environment & Sustainability'
                : cat === 'frontier'
                ? 'Science & Frontier Ideas'
                : 'Home, Living & Health';

            const categoryIcon =
              cat === 'eco' ? 'eco' : cat === 'frontier' ? 'rocket_launch' : 'cottage';

            return (
              <section key={cat} className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#5341cd]">
                      <span className="material-symbols-outlined text-[18px]">{categoryIcon}</span>
                    </div>
                    <h2 className="font-bold text-[16px] text-[#131b2e]">{categoryTitle}</h2>
                  </div>
                  <span className="font-tech text-[11px] text-[#787586] px-2 py-0.5 rounded-full bg-[#f2f3ff]">
                    {catRooms.length} Groups
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {catRooms.map((room) => {
                    const isJoined = joinedRooms[room.id];

                    if (room.bannerUrl) {
                      return (
                        <article
                          key={room.id}
                          className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden flex flex-col group transition-all hover:shadow-md"
                        >
                          <div
                            className="h-28 w-full relative bg-cover bg-center"
                            style={{ backgroundImage: `url(${room.bannerUrl})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {room.badge && (
                              <div className="absolute top-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-tech font-bold text-[#131b2e]">
                                <span>{room.badge}</span>
                              </div>
                            )}

                            {room.activeChatters && (
                              <div className="absolute top-2.5 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs font-tech text-[10px] font-bold text-[#131b2e]">
                                <span className="w-2 h-2 rounded-full bg-[#5341cd] animate-pulse" />
                                <span>{room.activeChatters} chatting</span>
                              </div>
                            )}
                          </div>

                          <div className="p-3.5 flex flex-col gap-2">
                            <h3 className="font-bold text-[16px] text-[#131b2e] leading-snug">
                              {room.title}
                            </h3>
                            <p className="text-[12px] text-[#474554] leading-relaxed">
                              {room.description}
                            </p>

                            <div className="flex items-center gap-3 pt-1 text-[#787586] font-tech text-[11px]">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[15px]">groups</span>
                                {room.membersCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[15px]">forum</span>
                                {room.activityText}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setShareModalRoom(room)}
                                className="p-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#474554] hover:text-[#5341cd] transition-colors cursor-pointer"
                                title="Share & QR Code"
                              >
                                <span className="material-symbols-outlined text-[18px]">share</span>
                              </button>

                              {room.adminRole === 'ADMIN' ? (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToGroupSettings(room.id)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-[#5341cd] text-white font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">settings</span>
                                  <span>Manage Syndicate</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleJoin(room.id, room.title)}
                                  className={`flex-1 py-2 px-3 rounded-xl font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer ${
                                    isJoined
                                      ? 'bg-[#eaedff] text-[#5341cd]'
                                      : 'bg-[#5341cd] text-white hover:bg-[#6c5ce7]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    {isJoined ? 'check' : 'add'}
                                  </span>
                                  <span>{isJoined ? 'Joined' : 'Join Room'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    }

                    // Compact / Advisory style card
                    return (
                      <article
                        key={room.id}
                        className="bg-white rounded-2xl shadow-xs border border-[#eaedff] p-3.5 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-[#5341cd] flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[22px]">
                                {room.icon || 'group'}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                                {room.title}
                              </h3>
                              <p className="text-[12px] text-[#474554] mt-0.5 line-clamp-2">
                                {room.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Medical or Info Disclaimers */}
                        {room.disclaimer && (
                          <div
                            className={`p-2 rounded-xl flex items-start gap-2 text-[11px] leading-snug ${
                              room.disclaimer.type === 'warning'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-[#f2f3ff] text-[#474554] border border-[#eaedff]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                              {room.disclaimer.type === 'warning' ? 'report_problem' : 'info'}
                            </span>
                            <span className="font-medium">{room.disclaimer.text}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-tech text-[11px] text-[#787586]">
                            {room.membersCount} • {room.activityText}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShareModalRoom(room)}
                              className="p-1.5 rounded-lg text-[#787586] hover:text-[#5341cd] cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">share</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleJoin(room.id, room.title)}
                              className={`px-3 py-1.5 rounded-xl font-tech text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isJoined
                                  ? 'bg-[#eaedff] text-[#5341cd]'
                                  : 'bg-[#5341cd] text-white hover:bg-[#6c5ce7]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {isJoined ? 'check' : 'add'}
                              </span>
                              <span>{isJoined ? 'Joined' : 'Join'}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Sticky Floating CTA */}
          <div className="sticky bottom-20 z-30 flex justify-center pt-2">
            <button
              onClick={onOpenCreateRoomModal}
              className="shadow-xl flex items-center gap-2 px-5 py-3 rounded-full bg-[#5341cd] text-white font-tech text-[13px] font-bold hover:bg-[#6c5ce7] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Create Public Forum or Group</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY ROOMS & PINNED SHORTCUTS (Image 14 & 15) */}
      {activeSubTab === 'shortcuts' && (
        <div className="flex flex-col gap-4 px-4 pt-1">
          {/* Shortcuts Horizontal Scroll */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#5341cd] text-[18px]">push_pin</span>
                <h3 className="font-bold text-[15px] text-[#131b2e]">Your Pinned Shortcuts</h3>
              </div>
              <span className="text-[11px] font-tech text-[#5341cd] font-bold cursor-pointer hover:underline">
                Edit
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {[
                {
                  title: 'Eco-Friendly Living',
                  meta: '12 new posts',
                  avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDL7G8J88CYz5K_MnnDLGk7FJ74ipQ_UFheJMFow9DNFVCOmc6tOHg-NfYoUSGiX4lu-YQpqSaLonyGf3PyXV4s8lAlusRzd0GCMH2JDm-rOd7r29uLGPU0cDv8wDZ4xFAMn2t9CeTQP3_Ku5XvsdpC_mhljmqV6EkXFPdcp8ThOGNcvwUpXqi5YzgpeaTK24zZnfSz6DC6Cv1RqoH1T7-imek7obSnkrcQnluacK70pUzuquur_Ynd',
                },
                {
                  title: 'Robotics & AI',
                  meta: '5 unread',
                  avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA7L5_hC16ntTgIwkPnGaDL3onwQq2SeceEwMuXiIv0zHxxGyzORNlHd2Jufbb73y4bWehzFKlLXx_TD5w9DdEYla0qy29m44WUjQBSZCbFGxZSCvD-KNFrrJtfUPg7CjnSMaVQcx7q1ofIkWE1c9obm-_KfCK8q7pHZ5Sq2OzWLtGhZFNKTupJ-1R1AqPfxYIO4ffovJwBTBVQtrGpsv4u3nV7B4BwldsYQPBiHgjlD-RQI6IHypxQ',
                },
                {
                  title: 'Earth & Galaxy',
                  meta: 'Quiet',
                  avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCBDndGjPBqDJ_aEqGThuyXEV7A73YeBC0fZ3F06k_XskXjAwTUtZWqxMN2dJW5gCFhQ3Bv277k46LVfeytqi1LF_jXduhs_kc8Qvw81pjQqFkmwASLu8BzQBqe7qC4cByN2M8xnONkBJsMNb0y6unrVf8qe-57fHUS0uAmbtPPCJ7qdWsTV3hZWlpw6KjzNySIo2fDU9I4fyi0_WdZB3lp4LrVHD-EKG4RmUqvPTJACuKRjQgWZar-',
                },
                {
                  title: 'Dorm Hacks 101',
                  meta: 'Voice Live',
                  avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuClUnn_LTqY87v357bzNVm1O_HMcrIbm5dETx-nvjMGssD5SbrPE1-_EPRI5z2WjOkmVxowG5bpn9SzKqFO5XTDk4ysPHSpxlf9A6Ujb9GP3L4YTnh6_fsNTIygXzjBBMba_U-y-SwLB70FTiHj1MP-25y8cidYqeBzOHWaIc86f8mGXcKvub6t37TjW-Fgm7we_iP7XGwr_l2iE0_Tw7ofl6MXWoBqnMm4w7QK4jek02aMjn5d7Ig3',
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => onShowToast(`Opened ${s.title}`)}
                  className="shrink-0 flex items-center gap-2 bg-[#f2f3ff] hover:bg-[#eaedff] rounded-full pl-1.5 pr-3 py-1 shadow-xs transition-all cursor-pointer"
                >
                  <img src={s.avatar} alt={s.title} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-tech text-[11px] font-bold text-[#131b2e] truncate max-w-[110px]">
                      {s.title}
                    </span>
                    <span className="font-tech text-[9px] text-[#a83639] font-semibold">{s.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenCreateRoomModal}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-gradient-to-br from-[#5341cd] via-[#6c5ce7] to-[#5847d2] text-white shadow-md text-left transition-transform active:scale-95 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </div>
              <div>
                <span className="font-bold text-[14px] leading-tight block">Create Room</span>
                <span className="text-[10px] text-white/80 font-tech">Public or syndicate hub</span>
              </div>
            </button>

            <div
              onClick={() => setActiveSubTab('hubs')}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-left transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#5341cd]/10 text-[#5341cd] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">explore</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#131b2e] leading-tight block">Discover Hubs</span>
                <span className="text-[10px] text-[#787586] font-tech">Trending peer groups</span>
              </div>
            </div>

            <div
              onClick={() => onShowToast('14 unread mentions in your research syndicates')}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-left transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#ff7675]/15 text-[#a83639] flex items-center justify-center mb-2 relative">
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#ff7675]" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[14px] text-[#131b2e] leading-tight">Feed Activity</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#ff7675]/20 text-[#a83639] font-tech text-[9px] font-bold">
                    14
                  </span>
                </div>
                <span className="text-[10px] text-[#787586] font-tech">Mentions & invites</span>
              </div>
            </div>

            <div
              onClick={() => onShowToast('Loaded 8 saved papers and archived datasets')}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#eaedff] text-left transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#ffdcc5] text-[#8c4600] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[18px]">bookmark</span>
              </div>
              <div>
                <span className="font-bold text-[14px] text-[#131b2e] leading-tight block">Saved Links</span>
                <span className="text-[10px] text-[#787586] font-tech">Archived notes & PDF</span>
              </div>
            </div>
          </div>

          {/* Manage & Created by You Section */}
          <section className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#5341cd] text-[19px]">shield_person</span>
                <h3 className="font-bold text-[15px] text-[#131b2e]">Manage & Created by You</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#eaedff] font-tech text-[10px] text-[#5341cd] font-bold">
                3 Rooms
              </span>
            </div>

            {/* Admin Syndicate Card 1: Fullstack Builders Cohort */}
            <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8AEF1-Nx0KWRZ0p8-zZ630sxciVyz05bkMoAv8CfInGaFWbKJ8olJv1aX6ct2daChfNWdmVsyQvEKgYRJt-I_waD8G0LFrBhi248bpjpUehu-FYa4Lmufg6uFKbTSKIkf8Pc-fe6NjmikjLr3b49pBWUtOYYzBpq0CwodQWnS601t7fyyuPhTamwYWBPaM5nVTg88gkFyOsohQn2C2MTUbwkY3OxhwfY5shQqRgzWMHcodhIEMskS"
                    alt="Cohort"
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#131b2e] truncate">
                        Fullstack Builders Cohort
                      </span>
                      <span className="material-symbols-outlined text-[#787586] text-[14px]">lock</span>
                    </div>
                    <span className="text-[11px] text-[#787586] font-tech">
                      Private Syndicate • 142 builders
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e4dfff] text-[#160066] font-tech text-[9px] font-bold shrink-0">
                  ADMIN
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                <div className="flex items-center gap-1 text-[#787586] font-tech text-[11px]">
                  <span className="material-symbols-outlined text-[15px] text-[#5341cd]">pending_actions</span>
                  <span>4 requests pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onNavigateToGroupSettings('room-12')}
                    className="px-3 py-1.5 rounded-lg bg-[#5341cd] text-white hover:bg-[#6c5ce7] font-tech text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">settings</span>
                    <span>Manage</span>
                  </button>
                  <button
                    onClick={() => onShowToast('Syndicate invite link copied!')}
                    className="p-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#474554] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Syndicate Card 2: Carbon Blueprints (Click to open Group Settings) */}
            <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#5341cd] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">eco</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#131b2e] truncate">
                        Carbon Blueprints & Sustainable Campus
                      </span>
                      <span className="material-symbols-outlined text-[#787586] text-[14px]">lock</span>
                    </div>
                    <span className="text-[11px] text-[#787586] font-tech">
                      Syndicate ID: #SPK-8842 • Stanford CleanTech
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e4dfff] text-[#160066] font-tech text-[9px] font-bold shrink-0">
                  ADMIN
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                <div className="flex items-center gap-1.5 text-[#787586] font-tech text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>5 members active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onNavigateToGroupSettings('room-5')}
                    className="px-3 py-1.5 rounded-lg bg-[#5341cd] text-white hover:bg-[#6c5ce7] font-tech text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    <span>Manage & Permissions</span>
                  </button>
                  <button
                    onClick={() => setShareModalRoom(rooms[4])}
                    className="p-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#474554] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Share Group & QR Code Modal */}
      {shareModalRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#dae2fd] flex flex-col gap-3 text-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5341cd] text-[22px]">qr_code_2</span>
                <h3 className="font-bold text-[16px] text-[#131b2e]">Share Syndicate Hub</h3>
              </div>
              <button
                onClick={() => setShareModalRoom(null)}
                className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center text-[#474554] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="font-bold text-[15px] text-[#131b2e]">{shareModalRoom.title}</p>
            <p className="text-[12px] text-[#474554]">
              Scan with mobile camera to join with immediate peer access pass.
            </p>

            {/* Stylized QR Code */}
            <div className="w-44 h-44 mx-auto bg-[#f2f3ff] rounded-2xl p-3 flex flex-col items-center justify-center border border-[#eaedff]">
              <svg className="w-full h-full text-[#131b2e]" fill="currentColor" viewBox="0 0 100 100">
                <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="16" width="12" height="12" rx="1" />
                <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="72" y="16" width="12" height="12" rx="1" />
                <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="72" width="12" height="12" rx="1" />
                <rect x="42" y="12" width="6" height="6" rx="1" />
                <rect x="52" y="12" width="6" height="18" rx="1" />
                <rect x="42" y="42" width="16" height="16" rx="2" className="text-[#5341cd] fill-current" />
                <rect x="12" y="42" width="10" height="6" rx="1" />
                <rect x="66" y="42" width="12" height="6" rx="1" />
                <rect x="66" y="56" width="6" height="18" rx="1" />
                <rect x="76" y="64" width="14" height="6" rx="1" />
                <rect x="42" y="66" width="16" height="6" rx="1" />
                <rect x="52" y="78" width="6" height="12" rx="1" />
              </svg>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f2f3ff]">
              <input
                type="text"
                readOnly
                value={`https://spark.edu/syndicate/${shareModalRoom.id}`}
                className="bg-transparent text-[12px] font-tech text-[#131b2e] flex-1 min-w-0 px-2 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://spark.edu/syndicate/${shareModalRoom.id}`);
                  onShowToast('Syndicate invite link copied!');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#5341cd] text-white font-tech text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
