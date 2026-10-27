import React, { useState } from 'react';
import { FeedPost } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface CreateSparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: FeedPost) => void;
}

export const CreateSparkModal: React.FC<CreateSparkModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [activeType, setActiveType] = useState<'text' | 'clip' | 'poll' | 'paper'>('text');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('#EcoFriendly');
  const [pollQ, setPollQ] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !pollQ.trim()) return;

    let newPost: FeedPost;

    if (activeType === 'poll' && pollQ.trim()) {
      newPost = {
        id: `post-${Date.now()}`,
        author: {
          name: CURRENT_USER.name,
          handle: CURRENT_USER.handle,
          avatar: CURRENT_USER.avatar,
          flag: '🇺🇸',
          affiliation: CURRENT_USER.university,
          tag: selectedTag,
          isVerified: true,
        },
        timeAgo: 'Just now',
        content: content.trim() || pollQ,
        postType: 'poll',
        pollData: {
          question: pollQ,
          subtitle: 'Active community inquiry poll',
          options: [
            { id: 'opt-1', label: pollOpt1 || 'Option A: Primary Hypothesis', letter: 'A', percent: 60 },
            { id: 'opt-2', label: pollOpt2 || 'Option B: Control Benchmark', letter: 'B', percent: 40 },
          ],
          totalVotes: 1,
          expiryText: '3 days left',
        },
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          isBookmarked: false,
        },
      };
    } else {
      newPost = {
        id: `post-${Date.now()}`,
        author: {
          name: CURRENT_USER.name,
          handle: CURRENT_USER.handle,
          avatar: CURRENT_USER.avatar,
          flag: '🇺🇸',
          affiliation: CURRENT_USER.university,
          tag: selectedTag,
          isVerified: true,
        },
        timeAgo: 'Just now',
        content,
        postType: activeType === 'clip' ? 'video' : 'photo',
        photoData: {
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQhiCWxIEWHmISFjS3pHKM2R1Kt2EehzusHnHOf38r1rQcMqWOwxHP_mZEiiL2we5-WQtj-OI6mZFdDy7EFVRG-iO1ww6zccuagZ0_JiNn4iY0Dn_m4LISGd4pilm9ehJHLN-YewI67aGOroNi7_NbQb28hTkTpFvijAHyKvoqNnnAsOB6ADXxpTeuPluRwJMnJSB1B1CDdwyHj-wzpSllX0beRZ0BqhK1roAZWmzYcTQw97RlCGSi',
          tags: [selectedTag, '#PeerResearch'],
        },
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          isBookmarked: false,
        },
      };
    }

    onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-[#ffffff] rounded-3xl shadow-2xl overflow-hidden border border-[#dae2fd] animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-[#eaedff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5341cd] text-[22px]">spark</span>
            <span className="font-bold text-[16px] text-[#131b2e]">Create a Spark Discovery</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#474554] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Type Tabs */}
        <div className="flex border-b border-[#eaedff] p-2 bg-[#faf8ff] gap-1.5 overflow-x-auto">
          {[
            { id: 'text', label: 'Field Note', icon: 'edit_note' },
            { id: 'clip', label: 'Clip', icon: 'videocam' },
            { id: 'poll', label: 'Inquiry Poll', icon: 'how_to_vote' },
            { id: 'paper', label: 'Paper Node', icon: 'description' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-tech text-[12px] font-bold transition-all cursor-pointer ${
                activeType === t.id
                  ? 'bg-[#5341cd] text-white shadow-xs'
                  : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={CURRENT_USER.avatar}
              alt="You"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#5341cd]/20"
            />
            <div>
              <span className="font-bold text-[13px] text-[#131b2e] block leading-tight">
                {CURRENT_USER.name}
              </span>
              <span className="text-[11px] text-[#787586] font-tech">
                Posting to Spark Net Public Syndicate
              </span>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share a discovery, field observation, or question with your peer community..."
            className="w-full bg-[#f2f3ff] rounded-2xl p-3 text-[14px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none focus:ring-1 focus:ring-[#5341cd] resize-none"
          />

          {activeType === 'poll' && (
            <div className="p-3 rounded-2xl bg-[#eaedff]/60 border border-[#dae2fd] flex flex-col gap-2">
              <span className="font-tech text-[11px] font-bold text-[#5341cd] uppercase">
                Poll Configuration
              </span>
              <input
                type="text"
                value={pollQ}
                onChange={(e) => setPollQ(e.target.value)}
                placeholder="Question prompt..."
                className="w-full bg-white rounded-xl px-3 py-2 text-[13px] text-[#131b2e] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={pollOpt1}
                  onChange={(e) => setPollOpt1(e.target.value)}
                  placeholder="Option A..."
                  className="bg-white rounded-xl px-3 py-2 text-[12px] text-[#131b2e] focus:outline-none"
                />
                <input
                  type="text"
                  value={pollOpt2}
                  onChange={(e) => setPollOpt2(e.target.value)}
                  placeholder="Option B..."
                  className="bg-white rounded-xl px-3 py-2 text-[12px] text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tag Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-tech text-[#787586] uppercase font-bold shrink-0">
              Syndicate Tag:
            </span>
            {['#EcoFriendly', '#GrowTrees', '#EarthAndGalaxy', '#Robotics', '#BioAI'].map(
              (tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-tech transition-all cursor-pointer shrink-0 ${
                    selectedTag === tag
                      ? 'bg-[#5341cd] text-white font-bold'
                      : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
                  }`}
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-[#eaedff]">
            <div className="flex items-center gap-1 text-[#787586]">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-colors cursor-pointer"
                title="Attach photo/clip"
              >
                <span className="material-symbols-outlined text-[20px]">image</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-colors cursor-pointer"
                title="Attach code snippet"
              >
                <span className="material-symbols-outlined text-[20px]">code_blocks</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-colors cursor-pointer"
                title="Attach open PDF"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#eaedff] text-[#474554] font-tech text-[12px] font-bold hover:bg-[#dae2fd] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#5341cd] text-white font-tech text-[12px] font-bold hover:bg-[#6c5ce7] shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Publish Spark</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
