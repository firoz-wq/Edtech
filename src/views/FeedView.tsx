import React, { useState } from 'react';
import { FeedPost, Story, LiveStage } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface FeedViewProps {
  posts: FeedPost[];
  stories: Story[];
  onOpenStory: (index: number) => void;
  onOpenCreateModal: () => void;
  onOpenStage: (stage: LiveStage) => void;
  onNavigateToRoom: (roomId?: string) => void;
  onShowToast: (message: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  stories,
  onOpenStory,
  onOpenCreateModal,
  onOpenStage,
  onNavigateToRoom,
  onShowToast,
}) => {
  const [feedMode, setFeedMode] = useState<'all' | 'visual'>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<{ [postId: string]: number }>({
    'post-2': 0,
  });
  const [votedPolls, setVotedPolls] = useState<{ [postId: string]: string }>({});
  const [postLikes, setPostLikes] = useState<{ [postId: string]: { count: number; isLiked: boolean } }>(
    () => {
      const initial: { [key: string]: { count: number; isLiked: boolean } } = {};
      posts.forEach((p) => {
        initial[p.id] = { count: p.metrics.likes, isLiked: p.metrics.isLiked || false };
      });
      return initial;
    }
  );
  const [savedPosts, setSavedPosts] = useState<{ [postId: string]: boolean }>({});
  const [quickComments, setQuickComments] = useState<{ [postId: string]: string }>({});
  const [openCommentsForPost, setOpenCommentsForPost] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    setPostLikes((prev) => {
      const current = prev[postId] || { count: 0, isLiked: false };
      const nextLiked = !current.isLiked;
      const nextCount = nextLiked ? current.count + 1 : current.count - 1;
      if (nextLiked) onShowToast('Liked! Added to your research trail.');
      return {
        ...prev,
        [postId]: { count: nextCount, isLiked: nextLiked },
      };
    });
  };

  const toggleBookmark = (postId: string) => {
    setSavedPosts((prev) => {
      const next = !prev[postId];
      onShowToast(next ? 'Saved to your research notebook' : 'Removed from saved notebook');
      return { ...prev, [postId]: next };
    });
  };

  const handleVote = (postId: string, optionId: string) => {
    if (votedPolls[postId]) return;
    setVotedPolls((prev) => ({ ...prev, [postId]: optionId }));
    onShowToast('Vote recorded! 483 student researchers voted.');
  };

  const handleAddComment = (postId: string) => {
    const text = quickComments[postId]?.trim();
    if (!text) return;
    onShowToast('Comment posted to peer thread!');
    setQuickComments((prev) => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = feedMode === 'visual'
    ? posts.filter((p) => p.postType === 'photo' || p.postType === 'carousel')
    : posts;

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Feed Sub-Mode Selector */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#eaedff] p-1 rounded-full">
          <button
            onClick={() => setFeedMode('all')}
            className={`px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              feedMode === 'all'
                ? 'bg-[#5341cd] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#5341cd]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">auto_stories</span>
            <span>Journal Sparks</span>
          </button>
          <button
            onClick={() => setFeedMode('visual')}
            className={`px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              feedMode === 'visual'
                ? 'bg-[#5341cd] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#5341cd]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">scatter_plot</span>
            <span>Figures & Lab Data</span>
          </button>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-tech text-[11.5px] font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[15px]">publish</span>
          <span>Submit Preprint</span>
        </button>
      </div>

      {/* Institutional Research Excellence Banner */}
      <div className="px-4 pt-1 pb-1">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-3 sm:p-4 text-white shadow-sm border border-indigo-400/20 flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-tech font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">school</span>
              Frontier Research & Innovation Journal
            </div>
            <h2 className="text-xs sm:text-sm font-bold font-academic text-white truncate">
              Peer-Reviewed Student Research & Open Syllabi
            </h2>
            <p className="text-[11px] text-slate-300/85 truncate">
              Replicated laboratory findings, Olympiad problem sets, and FSAE EV telemetry.
            </p>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-tech font-bold border border-emerald-400/30">
            Vol. 24 Issue 2
          </span>
        </div>
      </div>

      {/* Interactive Sparks Creation Bar */}
      <section className="px-4 pt-2 pb-2">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-left px-4 py-2.5 rounded-xl text-slate-600 text-[12.5px] transition-all flex items-center justify-between cursor-pointer border border-slate-200/60"
            >
              <span className="truncate">Publish a peer research note, lab figure, or inquiry...</span>
              <span className="material-symbols-outlined text-[#5341cd] text-[18px] shrink-0">
                edit_note
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 px-1">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-rose-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-rose-500">videocam</span>
              <span className="font-tech text-[11.5px] font-semibold">Lab Clip</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-[#5341cd] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-[#5341cd]">image</span>
              <span className="font-tech text-[11.5px] font-semibold">Figure / Chart</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-amber-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-amber-600">how_to_vote</span>
              <span className="font-tech text-[11.5px] font-semibold">Peer Inquiry</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 hover:text-emerald-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-emerald-600">description</span>
              <span className="font-tech text-[11.5px] font-semibold">Preprint DOI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Learning Snippets & Stories Track */}
      <section className="py-2 overflow-hidden">
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[19px]">sensors</span>
            <span className="font-tech text-[11.5px] font-bold uppercase tracking-wider text-[#0f172a]">
              24h Lab Logs & Field Telemetry
            </span>
          </div>
          <span className="font-tech text-[11px] text-[#5341cd] font-bold">Live Stream</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-1">
          {/* Create Snippet Node */}
          <div
            onClick={onOpenCreateModal}
            className="flex flex-col items-center gap-1.5 shrink-0 w-20 text-center cursor-pointer group"
          >
            <div className="relative w-16 h-16 rounded-full bg-[#e2e7ff] flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#f2f3ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#5341cd] text-[26px]">add</span>
              </div>
            </div>
            <span className="font-tech text-[10px] text-[#474554] truncate w-full">Your Story</span>
          </div>

          {/* Stories List */}
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 w-20 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#5341cd] via-[#6c5ce7] to-[#ff7675] group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-full h-full rounded-full p-0.5 bg-white">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="font-tech text-[11px] text-[#131b2e] font-semibold truncate w-full">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Feed Posts List */}
      <div className="flex flex-col gap-4 px-4 pt-2">
        {filteredPosts.map((post) => {
          const currentLike = postLikes[post.id] || { count: post.metrics.likes, isLiked: false };
          const isBookmarked = savedPosts[post.id] || false;
          const currentSlide = activeSlideIndex[post.id] || 0;
          const userVoted = votedPolls[post.id];

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3 transition-shadow hover:shadow-md"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-black/5"
                    />
                    {post.author.flag && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 text-[11px] leading-none shadow-xs">
                        {post.author.flag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[16px] text-[#131b2e] truncate">
                        {post.author.name}
                      </span>
                      {post.author.affiliation && (
                        <span className="bg-[#5341cd]/10 text-[#5341cd] px-2 py-0.5 rounded-full font-tech text-[10px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">school</span>
                          {post.author.affiliation}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#787586] font-tech text-[11px]">
                      <span className="text-[#5341cd] font-bold">{post.author.tag}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onShowToast(`Options for ${post.author.name}'s post`)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#787586] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>

              {/* Text Content */}
              <p className="text-[14px] text-[#131b2e] leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* VIDEO POST PREVIEW */}
              {post.postType === 'video' && post.videoPreview && (
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden bg-[#131b2e] aspect-[16/10] group">
                    <img
                      src={post.videoPreview.thumbnailUrl}
                      alt="Field clip preview"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Ambient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#ff7675]/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-tech text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          {post.videoPreview.badge}
                        </span>
                        <span className="bg-white/85 backdrop-blur-md text-[#131b2e] px-2.5 py-0.5 rounded-full font-tech text-[11px] font-bold">
                          {post.videoPreview.duration}
                        </span>
                      </div>

                      {/* Play Button Trigger */}
                      <div className="self-center">
                        <button
                          type="button"
                          aria-label="Play video"
                          onClick={() => {
                            onOpenStage({
                              id: 'stage-1',
                              title: post.content,
                              speaker: {
                                name: post.author.name,
                                title: post.author.affiliation,
                                avatar: post.author.avatar,
                                isVerified: true,
                              },
                              bannerUrl: post.videoPreview?.thumbnailUrl || '',
                              viewersCount: 1420,
                              isLive: true,
                              tags: ['GrowTrees', 'Hokkaido'],
                              type: 'video',
                            });
                          }}
                          className="w-14 h-14 rounded-full bg-[#6c5ce7]/95 text-white flex items-center justify-center shadow-xl transform transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          <span
                            className="material-symbols-outlined text-[32px] translate-x-0.5"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            play_arrow
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-white/90">
                        <span className="font-tech text-[11px] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#ff7675] text-[16px]">sensors</span>
                          {post.videoPreview.liveChannelNotice}
                        </span>
                        <span className="font-tech text-[10px] text-white/70">4K HDR</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Join Banner */}
                  {post.videoPreview.roomBanner && (
                    <div
                      onClick={() => onNavigateToRoom('room-5')}
                      className="bg-[#f2f3ff] hover:bg-[#eaedff] rounded-2xl p-2.5 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#5341cd]/10 text-[#5341cd] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">forum</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-tech text-[12px] font-bold text-[#131b2e] truncate">
                            {post.videoPreview.roomBanner.title}
                          </span>
                          <span className="font-tech text-[10px] text-[#474554]">
                            {post.videoPreview.roomBanner.subtitle}
                          </span>
                        </div>
                      </div>
                      <span className="bg-[#5341cd] text-white font-tech text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 shadow-xs">
                        Enter Room
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CAROUSEL POST PREVIEW */}
              {post.postType === 'carousel' && post.carouselSlides && (
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden bg-[#f2f3ff] aspect-[4/3] group">
                    <img
                      src={post.carouselSlides[currentSlide].imageUrl}
                      alt={post.carouselSlides[currentSlide].title}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    {/* Bottom Caption Pill */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-2.5 py-1 text-[#131b2e] font-tech text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[#5341cd] text-[15px]">
                        {post.carouselSlides[currentSlide].icon}
                      </span>
                      <span>{post.carouselSlides[currentSlide].title}</span>
                    </div>

                    {/* Slide Indicator Badge */}
                    <div className="absolute top-3 right-3 bg-[#131b2e]/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-tech text-[10px] font-bold">
                      {currentSlide + 1} / {post.carouselSlides.length}
                    </div>

                    {/* Carousel Nav Arrows */}
                    {post.carouselSlides.length > 1 && (
                      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlideIndex((prev) => ({
                              ...prev,
                              [post.id]: (currentSlide - 1 + post.carouselSlides!.length) % post.carouselSlides!.length,
                            }));
                          }}
                          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#131b2e] flex items-center justify-center pointer-events-auto shadow-md transition-transform active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlideIndex((prev) => ({
                              ...prev,
                              [post.id]: (currentSlide + 1) % post.carouselSlides!.length,
                            }));
                          }}
                          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#131b2e] flex items-center justify-center pointer-events-auto shadow-md transition-transform active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Academic Paper Snippet Link */}
                  {post.paperAttachment && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[#5341cd] text-[22px]">
                          description
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-tech text-[12px] font-bold text-[#131b2e] truncate">
                            {post.paperAttachment.title}
                          </span>
                          <span className="font-tech text-[10px] text-[#787586]">
                            {post.paperAttachment.meta}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onShowToast(`Opened ${post.paperAttachment?.title} in Research Reader`)}
                        className="text-[#5341cd] hover:text-[#6c5ce7] font-tech text-[12px] font-bold px-2 py-1 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Read</span>
                        <span className="material-symbols-outlined text-[16px]">north_east</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* POLL POST PREVIEW */}
              {post.postType === 'poll' && post.pollData && (
                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex flex-col gap-2">
                    {post.pollData.options.map((opt) => {
                      const isSelected = userVoted === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleVote(post.id, opt.id)}
                          className={`relative overflow-hidden w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer ${
                            userVoted
                              ? isSelected
                                ? 'bg-[#5341cd]/10 ring-1 ring-[#5341cd]'
                                : 'bg-[#f2f3ff]'
                              : 'bg-[#f2f3ff] hover:bg-[#eaedff]'
                          }`}
                        >
                          {/* Animated Progress Bar */}
                          {userVoted && (
                            <div
                              className="absolute inset-y-0 left-0 bg-[#5341cd]/20 transition-all duration-700 ease-out"
                              style={{ width: `${opt.percent}%` }}
                            />
                          )}

                          <div className="relative z-10 flex items-center justify-between">
                            <span className="font-semibold text-[13px] text-[#131b2e] flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isSelected
                                    ? 'bg-[#5341cd] text-white'
                                    : 'border border-[#5341cd] text-[#5341cd]'
                                }`}
                              >
                                {opt.letter}
                              </span>
                              <span>{opt.label}</span>
                            </span>

                            {userVoted && (
                              <span className="font-tech text-[12px] font-bold text-[#5341cd]">
                                {opt.percent}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[#787586] font-tech text-[11px] px-1">
                    <span className={userVoted ? 'text-[#5341cd] font-bold' : ''}>
                      {userVoted
                        ? `${post.pollData.totalVotes + 1} student researchers voted • Response recorded!`
                        : `${post.pollData.totalVotes} student researchers voted`}
                    </span>
                    <button
                      onClick={() => onShowToast('Loading Lab Whitepaper...')}
                      className="text-[#5341cd] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Lab Whitepaper</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PHOTO POST PREVIEW (Visual Sparks) */}
              {post.postType === 'photo' && post.photoData && (
                <div className="flex flex-col gap-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                    <img
                      src={post.photoData.imageUrl}
                      alt="Research visual"
                      className="w-full h-full object-cover"
                    />

                    {post.photoData.badge && (
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-tech text-[10px]">
                        {post.photoData.badge}
                      </div>
                    )}

                    {post.photoData.efficiencyBadge && (
                      <div className="absolute bottom-3 right-3 bg-[#00b894] text-white px-2.5 py-1 rounded-full font-tech text-[11px] font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>{post.photoData.efficiencyBadge}</span>
                      </div>
                    )}
                  </div>

                  {post.photoData.paperUrl && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f3ff] text-[12px] font-tech">
                      <div className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-[#5341cd] text-[18px]">code</span>
                        <span className="font-bold text-[#131b2e] truncate">{post.photoData.paperUrl}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {post.photoData.codeForkable && (
                          <button
                            onClick={() => onShowToast('Forked simulation notebook to your workspace!')}
                            className="px-2.5 py-1 rounded-lg bg-[#5341cd] text-white font-bold hover:bg-[#6c5ce7] cursor-pointer text-[11px]"
                          >
                            Fork Code
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Bar & Reactions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                <div className="flex items-center gap-1">
                  {/* Upvote / Like Button */}
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-[#f2f3ff] transition-all text-[#474554] active:scale-110 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-colors ${
                        currentLike.isLiked ? 'text-[#ff7675]' : ''
                      }`}
                      style={currentLike.isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {currentLike.isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                    <span
                      className={`font-tech text-[12px] ${
                        currentLike.isLiked ? 'font-bold text-[#a83639]' : ''
                      }`}
                    >
                      {currentLike.count}
                    </span>
                  </button>

                  {/* Comment Toggle Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCommentsForPost(openCommentsForPost === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-[#f2f3ff] transition-colors text-[#474554] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
                    <span className="font-tech text-[12px]">{post.metrics.comments}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={() => onShowToast('Copied syndicate share link to clipboard!')}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-[#f2f3ff] transition-colors text-[#474554] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">reply</span>
                    <span className="font-tech text-[12px]">{post.metrics.shares}</span>
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(post.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f2f3ff] transition-all cursor-pointer ${
                    isBookmarked ? 'text-[#5341cd]' : 'text-[#787586]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {isBookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Collapsible / Quick Comment Input */}
              <div className="pt-1">
                <div className="flex items-center gap-2 bg-[#f2f3ff] rounded-2xl p-1.5">
                  <img
                    src={CURRENT_USER.avatar}
                    alt="You"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <input
                    type="text"
                    value={quickComments[post.id] || ''}
                    onChange={(e) =>
                      setQuickComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    placeholder="Add field observation or question..."
                    className="bg-transparent text-[13px] text-[#131b2e] placeholder:text-[#787586] w-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(post.id)}
                    className="w-7 h-7 rounded-full bg-[#5341cd] text-white flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>

                {/* Expanded Comments List */}
                {openCommentsForPost === post.id && post.commentsList && (
                  <div className="mt-3 pt-2 border-t border-[#eaedff] flex flex-col gap-2">
                    <span className="font-tech text-[11px] font-bold text-[#787586] uppercase">
                      Discussion ({post.commentsList.length})
                    </span>
                    {post.commentsList.map((comm) => (
                      <div key={comm.id} className="flex items-start gap-2 text-[13px] bg-[#faf8ff] p-2 rounded-xl">
                        <img
                          src={comm.avatar}
                          alt={comm.author}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[12px] text-[#131b2e]">{comm.author}</span>
                            <span className="text-[10px] text-[#787586] font-tech">{comm.timestamp}</span>
                          </div>
                          <p className="text-[12px] text-[#474554] mt-0.5">{comm.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
