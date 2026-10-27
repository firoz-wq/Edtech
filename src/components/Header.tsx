import React, { useState } from 'react';
import { TabType } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface HeaderProps {
  currentTab: TabType;
  subView?: string;
  onNavigate: (tab: TabType, subView?: string) => void;
  onBack?: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  subView,
  onNavigate,
  onBack,
  onOpenNotifications,
  notificationCount,
  onOpenMobileMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Determine Academic Title & Focus according to view
  let title = 'Spark Academia';
  let subtitle = 'Institute of Frontier Research & Learning Excellence';

  if (subView === 'group-settings') {
    title = 'Syndicate Governance & Research Protocols';
    subtitle = 'Syndicate #SPK-8842 • Stanford CleanTech Guild';
  } else if (subView === 'direct-chat') {
    title = 'Sofia Chen';
    subtitle = 'Active in #EcoFriendly • Environmental Engineering Fellow';
  } else {
    switch (currentTab) {
      case 'feed':
        title = 'Scholarly Journal & Sparks';
        subtitle = 'Peer-Reviewed Discoveries & Field Telemetry';
        break;
      case 'academy':
        title = 'Academic Academy & Incubator';
        subtitle = 'Accredited Syllabi, Grants & Career Trajectories';
        break;
      case 'rooms':
        title = 'Research Syndicates & Labs';
        subtitle = 'Synchronous Study Desks & Collective Vaults';
        break;
      case 'live':
        title = 'Colloquiums & Live Stages';
        subtitle = 'Active Faculty Symposia & AMAs';
        break;
      case 'people':
        title = 'Faculty & Global Mentors';
        subtitle = 'Peer Fellows & Research Leads Directory';
        break;
      case 'chat':
        title = 'Scholarly Messenger';
        subtitle = 'Direct Research Channels & Group Sprints';
        break;
      case 'profile':
        title = 'Fellowship Honors & Badges';
        subtitle = 'Academic Citations & Research Syndicates';
        break;
    }
  }

  const showBackButton = subView === 'group-settings' || subView === 'direct-chat' || currentTab === 'profile';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Trigger + Brand or Back */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Mobile hamburger menu toggle */}
          {!showBackButton && (
            <button
              onClick={onOpenMobileMenu}
              aria-label="Open Navigation Drawer"
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#0f172a] hover:bg-slate-100 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          {showBackButton ? (
            <button
              onClick={onBack}
              aria-label="Back"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0f172a] hover:bg-slate-100 active:scale-95 transition-all shrink-0 -ml-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <div
              onClick={() => onNavigate('feed')}
              className="flex items-center gap-2 cursor-pointer shrink-0 md:hidden"
              title="Spark Academia Home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#160066] to-[#5341cd] flex items-center justify-center text-amber-300 shadow-xs">
                <span className="material-symbols-outlined text-[19px]">school</span>
              </div>
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] sm:text-[17px] text-[#0f172a] truncate leading-tight font-academic">
                {title}
              </span>
              {subView === 'direct-chat' ? (
                <span
                  className="material-symbols-outlined text-[#5341cd] text-[16px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[9px] font-tech font-bold uppercase tracking-wider">
                  Veritas
                </span>
              )}
            </div>
            <span className="text-[10.5px] text-slate-500 font-tech font-medium leading-none truncate hidden sm:block mt-0.5">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Center: Desktop Quick Omnisearch with Academic Pulse */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-md mx-2 gap-2">
          <div
            className={`w-full relative flex items-center bg-slate-50 rounded-xl px-3.5 py-1.5 transition-all duration-300 border border-slate-200 ${
              searchFocused ? 'ring-2 ring-[#5341cd]/30 bg-white shadow-xs border-[#5341cd]' : ''
            }`}
          >
            <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search research papers, syllabus, incubator grants, faculty..."
              className="bg-transparent w-full ml-1.5 text-[12.5px] text-[#0f172a] placeholder:text-slate-400 focus:outline-none"
            />
            <span className="text-[10px] font-tech text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-bold shrink-0">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#474554] hover:text-[#5341cd] hover:bg-[#eaedff] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#a83639] text-white font-tech text-[9px] font-bold leading-none ring-2 ring-[#faf8ff]">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Quick Chat Switcher */}
          {!showBackButton && (
            <button
              onClick={() => onNavigate('chat')}
              aria-label="Direct Messages"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#474554] hover:text-[#5341cd] hover:bg-[#eaedff] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[15px] h-3.5 px-0.5 rounded-full bg-[#5341cd] text-white font-tech text-[8px] font-bold leading-none ring-2 ring-[#faf8ff]">
                2
              </span>
            </button>
          )}

          {/* User Profile Avatar: Clicking navigates directly to Profile & Achievements view! */}
          <div
            onClick={() => onNavigate('profile')}
            className={`w-9 h-9 rounded-full ring-2 transition-all ml-1 cursor-pointer overflow-hidden shrink-0 ${
              currentTab === 'profile'
                ? 'ring-[#5341cd] shadow-sm'
                : 'ring-[#5341cd]/25 hover:ring-[#5341cd]'
            }`}
            title={`View ${CURRENT_USER.name}'s Profile & Achievements`}
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={CURRENT_USER.avatar}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
