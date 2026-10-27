import React, { useState } from 'react';

interface PeerCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  peerName: string;
  peerAvatar: string;
  isVideo: boolean;
}

export const PeerCallModal: React.FC<PeerCallModalProps> = ({
  isOpen,
  onClose,
  peerName,
  peerAvatar,
  isVideo,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-sm h-[75vh] max-h-[620px] bg-[#131b2e] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10 text-white">
        {/* Call Status Header */}
        <div className="p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-tech text-[12px] uppercase tracking-wider text-emerald-400 font-bold">
              Connected • 00:48
            </span>
          </div>
          <span className="text-[11px] font-tech text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
            E2E Encrypted
          </span>
        </div>

        {/* Center Peer Representation */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#5341cd] to-[#ff7675] shadow-xl">
              <img
                src={peerAvatar}
                alt={peerName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#131b2e] flex items-center justify-center text-[14px]">
              <span className="material-symbols-outlined text-[16px] text-white">graphic_eq</span>
            </div>
          </div>

          <h3 className="font-bold text-[20px] mt-4 mb-1 text-white">{peerName}</h3>
          <p className="text-[13px] text-white/70">
            NUS • Environmental Engineering Mentor
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-tech text-[#c6bfff]">
            🌿 Study Room: #EcoFriendly Living
          </span>
        </div>

        {/* Call Controls Footer */}
        <div className="p-6 bg-black/40 backdrop-blur-md flex items-center justify-around z-10 border-t border-white/10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isVideoOff ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isVideoOff ? 'videocam_off' : 'videocam'}
            </span>
          </button>

          <button
            onClick={onClose}
            aria-label="End Call"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">call_end</span>
          </button>
        </div>
      </div>
    </div>
  );
};
