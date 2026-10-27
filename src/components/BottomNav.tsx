import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadChatCount = 2,
}) => {
  const navItems: { tab: TabType; label: string; icon: string; badge?: number }[] = [
    { tab: 'feed', label: 'Journal', icon: 'auto_stories' },
    { tab: 'academy', label: 'Academy', icon: 'school' },
    { tab: 'rooms', label: 'Labs', icon: 'hub' },
    { tab: 'live', label: 'Symposia', icon: 'sensors' },
    { tab: 'people', label: 'Faculty', icon: 'verified_user' },
    { tab: 'chat', label: 'Chat', icon: 'chat_bubble', badge: unreadChatCount },
    { tab: 'profile', label: 'Honors', icon: 'military_tech' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-2px_16px_rgba(15,23,42,0.06)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] min-h-[48px] py-1 transition-all cursor-pointer relative group ${
                isActive
                  ? 'text-[#5341cd] font-bold scale-105'
                  : 'text-[#474554] hover:text-[#5341cd]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px] transition-transform group-active:scale-90"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>

                {item.badge && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-[#5341cd] text-white font-tech text-[8px] font-bold leading-none ring-2 ring-[#faf8ff]">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="font-tech text-[9.5px] tracking-tight leading-none">
                {item.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#5341cd] -mb-1 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
