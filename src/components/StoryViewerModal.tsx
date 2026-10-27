import React, { useState, useEffect } from 'react';
import { Story } from '../types';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSendReply?: (text: string, storyTitle: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onSendReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, isPaused, stories.length, onClose]);

  if (!isOpen) return null;

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply?.(replyText, currentStory.title);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 select-none">
      <div className="relative w-full max-w-md h-full max-h-[850px] bg-[#131b2e] flex flex-col justify-between overflow-hidden sm:rounded-3xl shadow-2xl">
        {/* Story Background Image */}
        <img
          src={currentStory.imageUrl}
          alt={currentStory.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/70 pointer-events-none" />

        {/* Top Header: Progress Bar + Author Row */}
        <div className="relative z-10 px-4 pt-4 pb-2 flex flex-col gap-3">
          {/* Progress Segments */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx === currentIndex
                        ? `${progress}%`
                        : idx < currentIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Details & Close */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#5341cd] to-[#ff7675]">
                <img
                  src={currentStory.avatar}
                  alt={currentStory.author}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] leading-tight">
                    {currentStory.author}
                  </span>
                  <span className="text-[11px] font-tech text-[#c6bfff] bg-white/10 px-2 py-0.5 rounded-full">
                    {currentStory.tag}
                  </span>
                </div>
                <span className="text-[11px] text-white/70">{currentStory.timeAgo}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume' : 'Pause'}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPaused ? 'play_arrow' : 'pause'}
                </span>
              </button>
              <button
                onClick={onClose}
                aria-label="Close Story"
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Tap Areas for navigation */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="Previous Story"
          />
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={() => setIsPaused(!isPaused)}
          />
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handleNext}
            title="Next Story"
          />
        </div>

        {/* Bottom Details & Quick Reply Bar */}
        <div className="relative z-10 p-4 flex flex-col gap-3">
          {currentStory.caption && (
            <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-white">
              <div className="flex items-center gap-1.5 text-[#ffdcc5] font-tech text-[11px] font-bold uppercase mb-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>{currentStory.title}</span>
              </div>
              <p className="text-[13px] text-white/95 leading-relaxed">
                {currentStory.caption}
              </p>
            </div>
          )}

          {/* Quick Reply Composer */}
          <form onSubmit={handleSubmitReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Send reply to ${currentStory.author}...`}
              className="flex-1 bg-white/15 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/50"
            />
            <button
              type="submit"
              aria-label="Send Story Reply"
              className="w-10 h-10 rounded-full bg-[#5341cd] text-white flex items-center justify-center shrink-0 hover:bg-[#6c5ce7] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
