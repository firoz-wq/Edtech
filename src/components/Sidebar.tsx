import React from 'react';
import { TabType } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface SidebarProps {
  currentTab: TabType;
  subView?: string;
  onSelectTab: (tab: TabType, subView?: string) => void;
  onOpenCreateModal: () => void;
  onOpenCreateRoomModal: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  unreadChatCount?: number;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  onOpenDirectChatSofia: () => void;
  onSelectCategoryFilter?: (category: 'eco' | 'frontier' | 'living') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  subView,
  onSelectTab,
  onOpenCreateModal,
  onOpenCreateRoomModal,
  onOpenNotifications,
  notificationCount,
  unreadChatCount = 2,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  onOpenDirectChatSofia,
  onSelectCategoryFilter,
}) => {
  const mainNavItems: {
    tab: TabType;
    sub?: string;
    label: string;
    icon: string;
    badge?: number | string;
    badgeColor?: string;
    pulse?: boolean;
  }[] = [
    { tab: 'feed', label: 'Scholarly Journal & Sparks', icon: 'auto_stories' },
    { tab: 'academy', label: 'Academy & Incubator', icon: 'school', badge: 'Grants', badgeColor: 'bg-amber-600' },
    { tab: 'rooms', label: 'Research Syndicates & Labs', icon: 'hub' },
    {
      tab: 'live',
      label: 'Symposia & Colloquiums',
      icon: 'sensors',
      badgeColor: 'bg-[#ff7675]',
      pulse: true,
    },
    { tab: 'people', label: 'Faculty & Global Mentors', icon: 'verified_user' },
    {
      tab: 'chat',
      label: 'Scholarly Messenger',
      icon: 'chat_bubble',
      badge: unreadChatCount,
      badgeColor: 'bg-[#5341cd]',
    },
    {
      tab: 'profile',
      label: 'Fellowship Honors & Badges',
      icon: 'military_tech',
      badge: '98.4 GPA',
      badgeColor: 'bg-amber-500',
    },
  ];

  const mySyndicates = [
    {
      id: 'room-5',
      name: 'Carbon Blueprints',
      tag: '#SPK-8842',
      role: 'Admin',
      badge: '5 online',
      icon: 'eco',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'room-12',
      name: 'Fullstack Builders',
      tag: '#SPK-3109',
      role: 'Admin',
      badge: '142 devs',
      icon: 'terminal',
      color: 'bg-[#e4dfff] text-[#160066]',
    },
    {
      id: 'room-13',
      name: 'Renewable Energy',
      tag: '#SPK-5520',
      role: 'Creator',
      badge: '18 lounge',
      icon: 'solar_power',
      color: 'bg-[#ffdcc5] text-[#8c4600]',
    },
  ];

  const quickChats = [
    {
      id: 'sofia',
      name: 'Sofia Chen',
      handle: '@sofia_eco',
      university: 'NUS SG',
      online: true,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuACSXuGakkOPwicLhzwgL0UuQ7aGy_rc5o5Og9ZXbwzPkYvc9zg79jHw9R31PuQWPC7Yt53X0aG5fK92NIO-PzSmI1V-NPy7kY14VdTaFXRgjUImf7M_LwbYPo5M9w_L1HHCGgsqiR4xF-GVr7JUBYtvq264Nqz1iQWrq45r2zrq0YQvUaLzv_oepfJCtb4sdM1n3boxS9e9e_Xssmv1A-Rgdimpi4-B-0F8b7_e37TQbPgk8DJfRXv',
    },
    {
      id: 'aris',
      name: 'Dr. Aris Thorne',
      handle: '@aris_thorne',
      university: 'Oxford UK',
      isExpert: true,
      online: true,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkFp8JlbYfBPGhlpgdaYQtoGRlsbviBf_C6faxCByh7NeVxffSx9_Aw-HSNwKFZG4wieKzB_5QcFaOP-1J_UTLJIw4Vm3szJeeuX6h7tkXtzwsegv4ClVHJP0csa1OiR0m3epnhVAp_V8_gfDLmdbY90ZruAMyoO04DCRIYxokmhLjL7p8iop7CX9OjzAKRr5sAdBr085QLgHVZ4m9h8ntA7Ir6Sbt1hajdPs85K3NUhX_weG-hInX',
    },
    {
      id: 'kwame',
      name: 'Kwame Mensah',
      handle: '@kwame_tech',
      university: 'Ashesi GH',
      online: false,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5vYUOYF1JTdImoS_LWidCjlYKvBJYtLtrD9azQCw1dhvtpgKBF9zVoAcn6RTZqbOAziDHGeFw1ecSMkGho6_hQbmjQLPt3CVrKORP3X_4v6kLrMmQI3qdrTyVOlVbRfry6b7VJj3fOzPLh85ZfdOYxLNRmdJqSZZuTIjIhh8Rn0QYwtuzqBIWbO_wwPv-2F_fnb-I6cN1bzbPl50xywx0ZST8Sl2-iWYHmWOUy69fQ6LdMtGMd_az',
    },
  ];

  const categories = [
    {
      id: 'eco' as const,
      name: 'Environment & Sustainability',
      icon: 'eco',
      count: '5 Groups',
      color: 'text-emerald-600',
    },
    {
      id: 'frontier' as const,
      name: 'Science & Frontier Ideas',
      icon: 'rocket_launch',
      count: '4 Groups',
      color: 'text-[#5341cd]',
    },
    {
      id: 'living' as const,
      name: 'Home, Living & Health',
      icon: 'cottage',
      count: '3 Groups',
      color: 'text-[#ff7675]',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-1">
          <div
            onClick={() => {
              onSelectTab('feed');
              onCloseMobileDrawer?.();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#160066] via-[#2c1a84] to-[#5341cd] flex items-center justify-center text-amber-300 shadow-md ring-1 ring-amber-400/30 group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] text-[#0f172a] leading-tight font-academic">
                  Spark Academia
                </span>
              </div>
              <span className="font-tech text-[9.5px] text-indigo-700 tracking-wider uppercase font-bold leading-none mt-0.5">
                Institute of Frontier Research
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {isMobileDrawerOpen && (
            <button
              onClick={onCloseMobileDrawer}
              className="md:hidden w-8 h-8 rounded-full bg-slate-100 text-[#474554] flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Academic Excellence Cohort Seal Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xs border border-indigo-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-tech font-bold uppercase tracking-wider text-amber-300">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
              Academic Excellence
            </span>
            <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
              Honors
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-bold font-academic text-white">
              Summa Cum Laude
            </span>
            <span className="text-[11px] font-tech text-emerald-400 font-bold">
              98.4 / 100
            </span>
          </div>
          <p className="text-[10px] text-slate-300/80 leading-tight">
            Class of 2026 • 18 Syndicate Contributions • 4 Grants Awarded
          </p>
        </div>

        {/* Primary Navigation Menu */}
        <div className="flex flex-col space-y-1">
          {mainNavItems.map((item) => {
            const isActive = currentTab === item.tab && !subView;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  onCloseMobileDrawer?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#5341cd] text-white shadow-xs font-bold'
                    : 'text-[#474554] hover:bg-[#f2f3ff] hover:text-[#5341cd]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[21px] transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#787586] group-hover:text-[#5341cd]'
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7675] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7675]" />
                    </span>
                  )}
                  {item.badge !== undefined && item.badge !== '' && item.badge !== 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full font-tech text-[9px] font-bold text-white leading-none ${
                        isActive ? 'bg-white/30 text-white' : item.badgeColor || 'bg-[#5341cd]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Notifications in Sidebar */}
          <button
            onClick={() => {
              onOpenNotifications();
              onCloseMobileDrawer?.();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-[13.5px] font-semibold text-[#474554] hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[21px] text-[#787586]">
                notifications
              </span>
              <span>Notifications</span>
            </div>
            {notificationCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full font-tech text-[9px] font-bold bg-[#a83639] text-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Button: Create Post & New Forum */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              onOpenCreateModal();
              onCloseMobileDrawer?.();
            }}
            className="w-full py-2.5 px-2 rounded-2xl bg-gradient-to-r from-[#5341cd] to-[#6c5ce7] text-white font-tech text-[11px] font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ New Post</span>
          </button>
          <button
            onClick={() => {
              onOpenCreateRoomModal();
              onCloseMobileDrawer?.();
            }}
            className="w-full py-2.5 px-2 rounded-2xl bg-[#eaedff] text-[#5341cd] hover:bg-[#dae2fd] font-tech text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">groups_2</span>
            <span>+ New Forum</span>
          </button>
        </div>

        {/* My Groups / Syndicates */}
        <div className="flex flex-col space-y-1.5 pt-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between px-1">
            <span className="font-tech text-[10px] font-bold uppercase tracking-wider text-[#787586]">
              My Syndicates & Groups
            </span>
            <span
              onClick={() => {
                onSelectTab('rooms', 'group-settings');
                onCloseMobileDrawer?.();
              }}
              className="text-[10px] font-tech text-[#5341cd] font-bold hover:underline cursor-pointer"
            >
              Manage
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            {mySyndicates.map((syn) => (
              <div
                key={syn.id}
                onClick={() => {
                  onSelectTab('rooms', 'group-settings');
                  onCloseMobileDrawer?.();
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f3ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${syn.color}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{syn.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[12px] text-[#131b2e] truncate group-hover:text-[#5341cd]">
                      {syn.name}
                    </span>
                    <span className="text-[10px] text-[#787586] font-tech">{syn.tag}</span>
                  </div>
                </div>
                <span className="font-tech text-[9px] px-1.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#474554] shrink-0 font-semibold">
                  {syn.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Active Chats (Quick 1:1) */}
        <div className="flex flex-col space-y-1.5 pt-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between px-1">
            <span className="font-tech text-[10px] font-bold uppercase tracking-wider text-[#787586]">
              Direct Chats (1:1)
            </span>
            <span
              onClick={() => {
                onSelectTab('chat');
                onCloseMobileDrawer?.();
              }}
              className="text-[10px] font-tech text-[#5341cd] font-bold hover:underline cursor-pointer"
            >
              Inbox
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            {quickChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  onOpenDirectChatSofia();
                  onCloseMobileDrawer?.();
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f3ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[12px] text-[#131b2e] truncate group-hover:text-[#5341cd]">
                      {chat.name}
                    </span>
                    <span className="text-[10px] text-[#787586] font-tech truncate">
                      {chat.university}
                    </span>
                  </div>
                </div>
                {chat.isExpert && (
                  <span className="material-symbols-outlined text-[#5341cd] text-[14px]">
                    verified
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Explorer */}
        <div className="flex flex-col space-y-1.5 pt-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between px-1">
            <span className="font-tech text-[10px] font-bold uppercase tracking-wider text-[#787586]">
              Explore Categories
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectTab('rooms');
                  onSelectCategoryFilter?.(cat.id);
                  onCloseMobileDrawer?.();
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f3ff] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[17px] shrink-0 ${cat.color}`}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-[12px] font-semibold text-[#131b2e] truncate group-hover:text-[#5341cd]">
                    {cat.name}
                  </span>
                </div>
                <span className="text-[10px] font-tech text-[#787586] shrink-0">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile Lockup: Jumps directly to Profile & Achievements view */}
      <div className="pt-3 mt-3 border-t border-[#eaedff] flex items-center justify-between">
        <div
          onClick={() => {
            onSelectTab('profile');
            onCloseMobileDrawer?.();
          }}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#5341cd]/20 group-hover:ring-[#5341cd]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[13px] text-[#131b2e] truncate leading-tight group-hover:text-[#5341cd]">
              {CURRENT_USER.name}
            </span>
            <span className="text-[10px] text-[#5341cd] font-tech font-bold truncate">
              View Achievements (7)
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            onSelectTab('profile');
            onCloseMobileDrawer?.();
          }}
          className="p-1.5 rounded-lg text-[#787586] hover:text-[#5341cd] hover:bg-[#f2f3ff] cursor-pointer"
          title="Account & Achievements"
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-[#dae2fd]/70 bg-white/80 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto no-scrollbar p-4 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-[84vw] max-w-xs bg-white h-full p-4 overflow-y-auto no-scrollbar shadow-2xl animate-slide-right flex flex-col">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobileDrawer} />
        </div>
      )}
    </>
  );
};
