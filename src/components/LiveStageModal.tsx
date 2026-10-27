import React, { useState } from 'react';
import { LiveStage } from '../types';

interface LiveStageModalProps {
  stage: LiveStage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveStageModal: React.FC<LiveStageModalProps> = ({
  stage,
  isOpen,
  onClose,
}) => {
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [comments, setComments] = useState<string[]>([
    'Dr. Vance: Are the rooftop soil fungal mixtures tolerant to high wind speeds?',
    'Fascinating metrics on sub-zero seedling survival!',
    'Can high school student syndicates request test samples?',
    'Joined from TU Delft, this aligns with our urban forestry workshop.',
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);

  if (!isOpen || !stage) return null;

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [...prev, commentInput]);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-lg h-[92vh] max-h-[820px] bg-[#131b2e] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10 text-white">
        {/* Floating animated reactions layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {reactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-28 right-8 text-3xl animate-bounce"
              style={{
                transform: `translateY(-${Math.random() * 120}px) translateX(${
                  (Math.random() - 0.5) * 80
                }px)`,
                opacity: 0.9,
              }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#131b2e]/90 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff7675] animate-ping" />
            <span className="bg-[#ff7675] text-white font-tech text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
              Live Stage
            </span>
            <div className="flex items-center gap-1 text-[12px] text-white/80 font-tech">
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>{stage.viewersCount + 14}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stage Media Display */}
        <div className="relative h-56 bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
          {stage.bannerUrl ? (
            <img
              src={stage.bannerUrl}
              alt={stage.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5341cd]/30 to-[#a83639]/30 flex items-center justify-center p-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#5341cd] to-[#ff7675] animate-pulse">
                  <img
                    src={stage.speaker.avatar}
                    alt={stage.speaker.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="font-bold text-[15px]">{stage.speaker.name}</span>
                <span className="text-[12px] text-white/70">Broadcasting Audio Stage</span>
              </div>
            </div>
          )}

          {/* Speaker Overlay Card */}
          <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={stage.speaker.avatar}
                alt={stage.speaker.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#5341cd]"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-white truncate leading-tight">
                  {stage.speaker.name}
                </span>
                <span className="text-[11px] text-white/70 truncate">
                  {stage.speaker.title}
                </span>
              </div>
            </div>

            {/* Speaking audio wave indicator */}
            <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 bg-white/10 rounded">
              <span className="w-1 bg-[#ff7675] h-3 rounded-full animate-bounce" />
              <span className="w-1 bg-[#ff7675] h-4 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 bg-[#ff7675] h-2 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        </div>

        {/* Stage Title & Tags */}
        <div className="px-4 py-2.5 border-b border-white/10 bg-[#131b2e]">
          <h3 className="font-bold text-[15px] leading-snug line-clamp-2">
            {stage.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {stage.tags.map((t) => (
              <span
                key={t}
                className="bg-white/10 text-[#c6bfff] text-[11px] font-tech px-2 py-0.5 rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Live Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-[13px]">
          <div className="p-2 rounded-xl bg-[#5341cd]/20 border border-[#5341cd]/30 text-white/90 text-[12px]">
            ⚡ Stage Moderator: Welcome scholars! Use the reactions below or raise your hand to speak on mic with {stage.speaker.name}.
          </div>

          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-white/90">
              <span className="w-2 h-2 rounded-full bg-[#5341cd] mt-1.5 shrink-0" />
              <span className="leading-snug">{c}</span>
            </div>
          ))}
        </div>

        {/* Quick Reactions Bar */}
        <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between gap-1 bg-[#131b2e]/90">
          <div className="flex items-center gap-2">
            {['👏', '⚡', '🔥', '🌿', '💡'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-125 transition-all flex items-center justify-center text-[18px] cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-tech font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isHandRaised
                  ? 'bg-[#ff7675] text-white'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">front_hand</span>
              <span>{isHandRaised ? 'Hand Raised' : 'Raise'}</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isMuted
                  ? 'bg-white/10 text-white/60 hover:bg-white/20'
                  : 'bg-[#5341cd] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'mic_off' : 'mic'}
              </span>
            </button>
          </div>
        </div>

        {/* Chat input form */}
        <form
          onSubmit={handleSendComment}
          className="p-3 bg-[#131b2e] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Ask speaker a question or drop peer note..."
            className="flex-1 bg-white/10 rounded-full px-4 py-2 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-[#5341cd] text-white flex items-center justify-center shrink-0 hover:bg-[#6c5ce7] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
