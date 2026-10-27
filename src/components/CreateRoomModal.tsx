import React, { useState } from 'react';
import { RoomHub } from '../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (newRoom: RoomHub) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onRoomCreated,
}) => {
  const [accessLevel, setAccessLevel] = useState<'public' | 'private'>('public');
  const [roomName, setRoomName] = useState('');
  const [domain, setDomain] = useState<'eco' | 'frontier' | 'living'>('eco');
  const [tags, setTags] = useState('ecology, peer-review, oceanography');
  const [bannerTheme, setBannerTheme] = useState<'violet' | 'emerald' | 'coral' | 'slate'>('violet');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const bannerUrls = {
      violet:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB8D5HUzPsDt4WAp2Shf1c8PrjjQwdYullZZC89mTKWpk8POpG5t61g-4_JJNf1dNZtkl5KqFN--tWKiuIzdET0tWwcENqkillJFQRCLZZPdV-dXhEaRaWdDCEYU-Yjq_xleruMTSvxgHCuMETvTBFQDsUjo9-30nFB6csm8KhHicdJB3-XMNrtvtE3U6PRIlQx2u1tVop0EfkU343R7qZSYPh5ACbO3qwJLX08ZCTV5VPU7PFahWxt',
      emerald:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCY3xbDFcUoKAtqYPzdjsYyqDks-fel0aUlcWbXiLkwxNTri-i7J5QJZkf7ozRzwD2TmncjStsy6iKzQMa_hrLmFKyDrjlmrwwSxhxYROGNNor1LHLrTg9dEIrtSBOMglCwewqcLbmWGYZZ1HY1HAQUf5WyMFnNV7v1vo0tYZNTsLcJmTMw2JKvdl6BCeK0qdcC4R6Gd3mF1XLxAkiHqvJvAOCaIqaHsktiTkDwV5IYO157AmBTcCs2',
      coral:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArG31wbwTEkG0MgEGX0T9QB6BcnieKOLNQTa54fv8_BgNoJa0cCdkuSBEXDG00mnVBCRlo5n6B29oF5BkBk-FiRgkb9Oi7yGML2rNIyw2ZN10bwUF2sWTnjPBH-w5QhJjG_RKgcgilHxN4Ng9ai0bYn6tOLSmkum7S8RUkuqrdVR8E2VGa0EJSXAQAZtbX9u_GuZRPxySPUc6H6kqwo_2xjd3X8_GOTe4AsqCpRX0S9_PWYWwWxspD',
      slate:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC8AEF1-Nx0KWRZ0p8-zZ630sxciVyz05bkMoAv8CfInGaFWbKJ8olJv1aX6ct2daChfNWdmVsyQvEKgYRJt-I_waD8G0LFrBhi248bpjpUehu-FYa4Lmufg6uFKbTSKIkf8Pc-fe6NjmikjLr3b49pBWUtOYYzBpq0CwodQWnS601t7fyyuPhTamwYWBPaM5nVTg88gkFyOsohQn2C2MTUbwkY3OxhwfY5shQqRgzWMHcodhIEMskS',
    };

    const newRoom: RoomHub = {
      id: `room-${Date.now()}`,
      title: roomName.trim(),
      category: domain,
      categoryLabel:
        domain === 'eco'
          ? 'Environment & Sustainability'
          : domain === 'frontier'
          ? 'Science & Frontier Ideas'
          : 'Home, Living & Health',
      description: `Active collaborative forum for ${roomName.trim()} with peer research documents and daily discussions.`,
      bannerUrl: bannerUrls[bannerTheme],
      badge: accessLevel === 'public' ? 'Public Hub' : 'Restricted',
      membersCount: '1 scholar',
      activityText: 'Just created',
      isJoined: true,
      isPrivate: accessLevel === 'private',
      adminRole: 'CREATOR',
      tags: tags.split(',').map((t) => t.trim()),
    };

    onRoomCreated(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
      <div className="w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border-t border-[#dae2fd]">
        <div className="w-12 h-1 bg-[#dae2fd] rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={onClose} />

        <div className="px-5 pb-3 flex items-center justify-between border-b border-[#eaedff]">
          <div>
            <h3 className="font-bold text-[17px] text-[#131b2e]">Start a Community Hub</h3>
            <p className="text-[12px] text-[#787586] font-tech">
              Host conversations, build notes, and organize study sessions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center text-[#474554] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Access Level Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="font-tech text-[11px] font-bold text-[#787586] uppercase tracking-wider">
              Access Level
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setAccessLevel('public')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-tech text-[12px] font-bold transition-all cursor-pointer ${
                  accessLevel === 'public'
                    ? 'bg-white text-[#5341cd] shadow-xs'
                    : 'text-[#474554]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">public</span>
                <span>Public Hub</span>
              </button>
              <button
                type="button"
                onClick={() => setAccessLevel('private')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-tech text-[12px] font-bold transition-all cursor-pointer ${
                  accessLevel === 'private'
                    ? 'bg-white text-[#5341cd] shadow-xs'
                    : 'text-[#474554]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Restricted</span>
              </button>
            </div>
          </div>

          {/* Room Name */}
          <div className="flex flex-col gap-1">
            <label className="font-tech text-[11px] font-bold text-[#787586] uppercase tracking-wider">
              Room Name
            </label>
            <input
              type="text"
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Marine Ecology Field Syndicate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
            />
          </div>

          {/* Topic Category */}
          <div className="flex flex-col gap-1">
            <label className="font-tech text-[11px] font-bold text-[#787586] uppercase tracking-wider">
              Primary Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
            >
              <option value="eco">Environment & Sustainability</option>
              <option value="frontier">Science & Frontier Ideas</option>
              <option value="living">Home, Living & Health</option>
            </select>
          </div>

          {/* Tags Input */}
          <div className="flex flex-col gap-1">
            <label className="font-tech text-[11px] font-bold text-[#787586] uppercase tracking-wider">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ecology, peer-review, oceanography"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
            />
          </div>

          {/* Banner Theme */}
          <div className="flex flex-col gap-1.5">
            <label className="font-tech text-[11px] font-bold text-[#787586] uppercase tracking-wider">
              Cover Banner Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'violet', label: 'Violet', bg: 'bg-[#5341cd] text-white' },
                { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600 text-white' },
                { id: 'coral', label: 'Coral', bg: 'bg-[#ff7675] text-white' },
                { id: 'slate', label: 'Slate', bg: 'bg-[#283044] text-white' },
              ].map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setBannerTheme(theme.id as any)}
                  className={`h-12 rounded-xl flex items-center justify-center font-tech text-[11px] font-bold cursor-pointer transition-all ${
                    theme.bg
                  } ${bannerTheme === theme.id ? 'ring-3 ring-offset-2 ring-[#5341cd] scale-105' : 'opacity-80'}`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#5341cd] text-white font-tech text-[13px] font-bold shadow-md active:scale-95 transition-all hover:bg-[#6c5ce7] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Publish Community Hub</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </div>
  );
};
