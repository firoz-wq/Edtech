import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionType: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: "Dr. Elena Vance started a Live Stage",
      desc: "'How to Reduce Global Warming & Zero-Waste Campus Architectures'",
      time: 'Just now',
      icon: 'sensors',
      iconColor: 'bg-[#ff7675]/15 text-[#a83639]',
      action: 'live',
      actionLabel: 'Join Live Stage',
    },
    {
      id: 'n2',
      title: 'Sofia Chen shared a new lab note',
      desc: "Field experiment notes: Urban micro-composting in student dorms in #EcoFriendly",
      time: '12m ago',
      icon: 'description',
      iconColor: 'bg-[#5341cd]/15 text-[#5341cd]',
      action: 'direct-chat',
      actionLabel: 'Open Chat',
    },
    {
      id: 'n3',
      title: 'Referral perk unlocked!',
      desc: 'You unlocked 1-on-1 priority AMA passes with Dr. Aris Thorne (@aris_thorne)',
      time: '1h ago',
      icon: 'school',
      iconColor: 'bg-[#b05a03]/15 text-[#b05a03]',
      action: 'people',
      actionLabel: 'View Expert',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-3 animate-fade-in">
      <div className="w-full max-w-md bg-[#ffffff] rounded-2xl shadow-2xl border border-[#dae2fd] overflow-hidden flex flex-col">
        <div className="p-3.5 border-b border-[#eaedff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5341cd] text-[20px]">notifications_active</span>
            <span className="font-bold text-[15px] text-[#131b2e]">Notifications</span>
            <span className="bg-[#a83639] text-white font-tech text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              3 new
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#474554] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="divide-y divide-[#eaedff] max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 hover:bg-[#faf8ff] transition-colors flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.iconColor}`}>
                <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-[13px] text-[#131b2e] leading-snug truncate">
                    {n.title}
                  </span>
                  <span className="text-[11px] text-[#787586] font-tech shrink-0">{n.time}</span>
                </div>
                <p className="text-[12px] text-[#474554] mt-0.5 line-clamp-2 leading-relaxed">
                  {n.desc}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectAction(n.action);
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#5341cd] text-white font-tech text-[11px] font-bold hover:bg-[#6c5ce7] active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    {n.actionLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-[#f2f3ff] text-center border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="text-[12px] font-tech text-[#5341cd] font-bold hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
