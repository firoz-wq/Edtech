import React, { useState, useEffect } from 'react';
import { LiveStage, SolutionNode, UpcomingAMA } from '../types';

interface LiveViewProps {
  stages: LiveStage[];
  solutions: SolutionNode[];
  upcomingAMA: UpcomingAMA;
  onJoinStage: (stage: LiveStage) => void;
  onShowToast: (message: string) => void;
}

export const LiveView: React.FC<LiveViewProps> = ({
  stages,
  solutions,
  upcomingAMA,
  onJoinStage,
  onShowToast,
}) => {
  // Live Countdown state
  const [cd, setCd] = useState({
    hrs: upcomingAMA.startsInHours,
    min: upcomingAMA.startsInMinutes,
    sec: upcomingAMA.startsInSeconds,
  });

  // Upvote counts
  const [nodeUpvotes, setNodeUpvotes] = useState<{ [id: string]: { count: number; isVoted: boolean } }>({
    'node-1': { count: 512, isVoted: false },
    'node-2': { count: 342, isVoted: false },
  });

  // RSVP state
  const [isRsvpd, setIsRsvpd] = useState(upcomingAMA.isRsvpd);

  // Pitch Solution drawer state
  const [isPitchDrawerOpen, setIsPitchDrawerOpen] = useState(false);
  const [pitchTitle, setPitchTitle] = useState('');
  const [pitchDesc, setPitchDesc] = useState('');

  // Ticking countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCd((prev) => {
        let { hrs, min, sec } = prev;
        sec--;
        if (sec < 0) {
          sec = 59;
          min--;
          if (min < 0) {
            min = 59;
            hrs--;
            if (hrs < 0) {
              hrs = 0;
              min = 0;
              sec = 0;
            }
          }
        }
        return { hrs, min, sec };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleUpvote = (nodeId: string) => {
    setNodeUpvotes((prev) => {
      const current = prev[nodeId] || { count: 500, isVoted: false };
      const nextVoted = !current.isVoted;
      const nextCount = nextVoted ? current.count + 1 : current.count - 1;
      if (nextVoted) onShowToast('Solution upvoted & highlighted on Syndicate board!');
      return {
        ...prev,
        [nodeId]: { count: nextCount, isVoted: nextVoted },
      };
    });
  };

  const handleToggleRsvp = () => {
    setIsRsvpd(!isRsvpd);
    onShowToast(!isRsvpd ? 'RSVP Confirmed for Stanford Bio-AI AMA!' : 'Reminder removed');
  };

  const handlePublishSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchTitle.trim()) return;
    setIsPitchDrawerOpen(false);
    setPitchTitle('');
    setPitchDesc('');
    onShowToast('Your Blueprint node was submitted to the Syndicate sprint!');
  };

  return (
    <div className="flex flex-col w-full pb-24">
      <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-6">
        {/* Live Pulse Status Sub-Banner */}
        <div className="flex items-center justify-between bg-[#f2f3ff] px-4 py-3 rounded-2xl shadow-xs border border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7675] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#a83639]" />
            </span>
            <span className="font-tech text-[12px] font-bold text-[#131b2e]">
              1,760 Scholars actively discussing now
            </span>
          </div>
          <button
            onClick={() => onShowToast('Filtered: Showing high-engagement audio and video stages first')}
            className="flex items-center gap-1 text-[#5341cd] hover:text-[#6c5ce7] font-tech text-[11px] font-bold cursor-pointer"
          >
            <span className="tracking-wider uppercase">Filter</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>

        {/* Section 1: Live Now Stages Carousel */}
        <section className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#ff7675] text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sensors
              </span>
              <h2 className="font-bold text-[18px] text-[#131b2e]">Live Stages</h2>
            </div>
            <span className="font-tech text-[11px] text-[#787586] uppercase tracking-wider">
              Swipe for more
            </span>
          </div>

          {/* Horizontal Swipeable Stage Cards */}
          <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
            {/* Live Card 1: Video Stream (Dr. Elena Vance) */}
            <div className="snap-start shrink-0 w-[88vw] max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-md border border-[#eaedff] flex flex-col justify-between">
              <div className="relative h-44 w-full bg-[#131b2e]">
                <img
                  src={stages[0]?.bannerUrl}
                  alt={stages[0]?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-[#a83639] text-white font-tech text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Live Streaming
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white font-tech text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">visibility</span>
                    1,420
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={stages[0]?.speaker.avatar}
                        alt={stages[0]?.speaker.name}
                        className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-[#5341cd]"
                      />
                      <span
                        className="material-symbols-outlined absolute -bottom-1 -right-1 text-[#6c5ce7] bg-white rounded-full text-[13px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[13px] leading-tight truncate">
                        {stages[0]?.speaker.name}
                      </span>
                      <span className="text-[11px] text-white/75 truncate font-tech">
                        {stages[0]?.speaker.title}
                      </span>
                    </div>
                  </div>

                  {/* Audio wave micro-visualizer */}
                  <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 bg-black/40 rounded">
                    <span className="w-1 bg-[#ff7675] h-3 rounded-full animate-bounce" />
                    <span className="w-1 bg-[#ff7675] h-4 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 bg-[#ff7675] h-2 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="bg-[#f2f3ff] text-[#5341cd] font-tech text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Zero-Waste
                    </span>
                    <span className="bg-[#f2f3ff] text-[#b05a03] font-tech text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Global Warming
                    </span>
                  </div>
                  <h3 className="font-bold text-[15px] text-[#131b2e] leading-snug line-clamp-2">
                    {stages[0]?.title}
                  </h3>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-[#eaedff]">
                  <div className="flex -space-x-2 overflow-hidden">
                    {stages[0]?.coHosts?.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="Co-host"
                        className="inline-block h-6 w-6 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => onJoinStage(stages[0])}
                    className="bg-[#5341cd] text-white font-tech text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:bg-[#6c5ce7] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">podium</span>
                    <span>Join Live Stage</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Card 2: Audio Room (Dr. Aris Chen) */}
            <div className="snap-start shrink-0 w-[88vw] max-w-[340px] bg-white rounded-2xl p-4 shadow-md border border-[#eaedff] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-[#f2f3ff] text-[#5341cd] font-tech text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      graphic_eq
                    </span>
                    Live Audio Room
                  </span>
                  <span className="bg-[#f2f3ff] text-[#787586] font-tech text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">headphones</span>
                    340 listening
                  </span>
                </div>

                <h3 className="font-bold text-[15px] text-[#131b2e] leading-snug mb-2">
                  Home Remedy & Science: Debunking Myths with Biotech Postdocs
                </h3>
                <p className="text-[12px] text-[#474554] line-clamp-2 mb-3 leading-relaxed">
                  Interactive debunking of trending viral nutrition hacks, gut-microbiome trends, and folk cures using peer-reviewed immunology metrics.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 bg-[#f2f3ff] p-2.5 rounded-xl mb-3">
                  <div className="relative">
                    <img
                      src={stages[1]?.speaker.avatar}
                      alt="Speaker"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#5341cd] rounded-full flex items-center justify-center text-[8px] text-white ring-1 ring-white">
                      <span className="material-symbols-outlined text-[10px]">mic</span>
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold text-[13px] text-[#131b2e] leading-tight truncate">
                      Dr. Aris Chen & Maya Sato
                    </span>
                    <span className="text-[11px] text-[#787586] font-tech truncate">
                      Hosting Q&A Session
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[#787586] font-tech text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-[#b05a03]">front_hand</span>
                    <span>12 hands raised</span>
                  </div>
                  <button
                    onClick={() => onJoinStage(stages[1])}
                    className="bg-[#ff7675] text-white font-tech text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:opacity-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    <span>Listen In</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Collaborative Brainstorming & Solution Boards */}
        <section className="flex flex-col space-y-4">
          {/* Challenge Spotlight Banner */}
          <div className="bg-gradient-to-br from-[#5341cd] via-[#6c5ce7] to-[#5847d2] p-4 rounded-2xl text-white shadow-lg flex flex-col space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-md font-tech text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Active Sprint Challenge
              </span>
              <span className="font-tech text-[11px] text-white/80 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">timer</span> 4 days left
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[18px] text-white leading-snug">
                Carbon Blueprints for High Schools & Universities
              </h3>
              <p className="text-[12px] text-white/85 mt-1 leading-relaxed">
                Open syndicate co-creation: Pitch modular implementations to offset academic institution emissions.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-tech text-[12px] bg-white/15 px-3 py-1 rounded-xl">
                84 solutions submitted
              </span>
              <button
                onClick={() => setIsPitchDrawerOpen(true)}
                className="bg-white text-[#5341cd] font-tech text-[11px] font-bold px-3.5 py-2 rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Pitch Idea</span>
              </button>
            </div>
          </div>

          {/* Solution Boards Title */}
          <div className="flex items-center justify-between pt-1">
            <h3 className="font-bold text-[16px] text-[#131b2e]">Trending Solution Nodes</h3>
            <span
              onClick={() => onShowToast('Sorted by: Highest Peer Upvotes')}
              className="font-tech text-[11px] text-[#5341cd] font-bold cursor-pointer hover:underline"
            >
              Sort by: Upvotes ▼
            </span>
          </div>

          {/* Solution Card 1: Lars van Dijk */}
          {solutions[0] && (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={solutions[0].author.avatar}
                    alt={solutions[0].author.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#131b2e]">
                        {solutions[0].author.name}
                      </span>
                      <span className="text-[12px]">{solutions[0].author.flag}</span>
                      <span className="bg-[#f2f3ff] text-[#5341cd] font-tech text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {solutions[0].author.university}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#787586] font-tech">
                      {solutions[0].postedAgo} • {solutions[0].author.track}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleUpvote(solutions[0].id)}
                  className={`flex flex-col items-center justify-center active:scale-90 transition-all rounded-xl px-2.5 py-1.5 cursor-pointer ${
                    nodeUpvotes[solutions[0].id]?.isVoted
                      ? 'bg-[#5341cd] text-white shadow-xs'
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#5341cd]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  <span className="font-tech text-[12px] font-bold">
                    {nodeUpvotes[solutions[0].id]?.count ?? solutions[0].upvotes}
                  </span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                  {solutions[0].title}
                </h4>
                <p className="text-[12px] text-[#474554] mt-1 line-clamp-2 leading-relaxed">
                  {solutions[0].description}
                </p>
              </div>

              {solutions[0].schematicUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#f2f3ff] border border-[#eaedff]">
                  <img
                    src={solutions[0].schematicUrl}
                    alt="Schematic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-white font-tech text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">architecture</span>
                    {solutions[0].schematicTag}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {solutions[0].tags.map((t) => (
                  <span
                    key={t}
                    className="bg-[#f2f3ff] text-[#474554] font-tech text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#eaedff]">
                <div className="flex items-center gap-3 text-[#787586] font-tech text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">forum</span>
                    {solutions[0].commentsCount} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">group_work</span>
                    {solutions[0].coCreatorsCount} co-creators
                  </span>
                </div>
                <button
                  onClick={() => onShowToast(`Joined co-creation team for ${solutions[0].author.name}'s node!`)}
                  className="bg-[#f2f3ff] text-[#5341cd] hover:bg-[#eaedff] font-tech text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Co-create</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Solution Card 2: Kofi Mensah */}
          {solutions[1] && (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={solutions[1].author.avatar}
                    alt={solutions[1].author.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#131b2e]">
                        {solutions[1].author.name}
                      </span>
                      <span className="text-[12px]">{solutions[1].author.flag}</span>
                      <span className="bg-[#f2f3ff] text-[#5341cd] font-tech text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {solutions[1].author.university}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#787586] font-tech">
                      {solutions[1].postedAgo} • {solutions[1].author.track}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleUpvote(solutions[1].id)}
                  className={`flex flex-col items-center justify-center active:scale-90 transition-all rounded-xl px-2.5 py-1.5 cursor-pointer ${
                    nodeUpvotes[solutions[1].id]?.isVoted
                      ? 'bg-[#5341cd] text-white shadow-xs'
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#5341cd]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  <span className="font-tech text-[12px] font-bold">
                    {nodeUpvotes[solutions[1].id]?.count ?? solutions[1].upvotes}
                  </span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                  {solutions[1].title}
                </h4>
                <p className="text-[12px] text-[#474554] mt-1 line-clamp-2 leading-relaxed">
                  {solutions[1].description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {solutions[1].tags.map((t) => (
                  <span
                    key={t}
                    className="bg-[#f2f3ff] text-[#474554] font-tech text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#eaedff]">
                <div className="flex items-center gap-3 text-[#787586] font-tech text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">forum</span>
                    {solutions[1].commentsCount} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">group_work</span>
                    {solutions[1].coCreatorsCount} co-creators
                  </span>
                </div>
                <button
                  onClick={() => onShowToast(`Joined co-creation team for ${solutions[1].author.name}'s node!`)}
                  className="bg-[#f2f3ff] text-[#5341cd] hover:bg-[#eaedff] font-tech text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Co-create</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Upcoming Expert Talks & AMAs */}
        <section className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b05a03] text-[22px]">calendar_month</span>
              <h2 className="font-bold text-[18px] text-[#131b2e]">Upcoming AMAs & Talks</h2>
            </div>
            <span
              onClick={() => onShowToast('Syncing with Campus Calendar')}
              className="font-tech text-[11px] text-[#5341cd] font-bold cursor-pointer hover:underline"
            >
              Calendar
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col space-y-3">
            {/* Countdown ticker header */}
            <div className="flex items-center justify-between bg-[#f2f3ff] px-3 py-2 rounded-xl">
              <div className="flex items-center gap-1.5 text-[#b05a03]">
                <span className="material-symbols-outlined text-[17px]">alarm</span>
                <span className="font-tech text-[11px] font-bold uppercase tracking-wider">Starts in:</span>
              </div>
              <div className="flex items-center gap-1 font-tech text-[12px] text-[#131b2e]">
                <span className="bg-white px-1.5 py-0.5 rounded font-bold shadow-2xs">
                  {cd.hrs < 10 ? `0${cd.hrs}` : cd.hrs}
                </span>
                h
                <span className="bg-white px-1.5 py-0.5 rounded font-bold shadow-2xs">
                  {cd.min < 10 ? `0${cd.min}` : cd.min}
                </span>
                m
                <span className="bg-white px-1.5 py-0.5 rounded font-bold text-[#5341cd] shadow-2xs">
                  {cd.sec < 10 ? `0${cd.sec}` : cd.sec}
                </span>
                s
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={upcomingAMA.speaker.avatar}
                  alt={upcomingAMA.speaker.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                />
                <span className="absolute -top-1.5 -left-1.5 bg-[#ffdcc5] text-[#301400] font-tech text-[9px] px-1.5 py-0.2 rounded-full font-bold shadow-xs">
                  AMA
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h4 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                  {upcomingAMA.title}
                </h4>
                <span className="text-[12px] text-[#5341cd] font-medium mt-0.5">
                  {upcomingAMA.speaker.name} • {upcomingAMA.speaker.affiliation}
                </span>
                <span className="text-[11px] text-[#787586] font-tech mt-1">
                  {upcomingAMA.timeText} • {upcomingAMA.stageName}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5341cd]/20 text-[9px] font-bold text-[#5341cd] flex items-center justify-center font-tech">
                  8k
                </span>
                <span className="text-[11px] text-[#787586] font-tech">
                  {isRsvpd ? upcomingAMA.attendeesCount + 1 : upcomingAMA.attendeesCount} attending
                </span>
              </div>

              <button
                onClick={handleToggleRsvp}
                className={`font-tech text-[12px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
                  isRsvpd
                    ? 'bg-[#eaedff] text-[#5341cd]'
                    : 'bg-[#5341cd] text-white hover:bg-[#6c5ce7]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isRsvpd ? 'check' : 'bookmark_add'}
                </span>
                <span>{isRsvpd ? 'Saved to Calendar' : 'RSVP Reminder'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Sticky Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              onJoinStage(stages[0]);
              onShowToast('Preparing camera and microphone permissions...');
            }}
            className="flex-1 bg-[#a83639] text-white py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 font-tech text-[13px] font-bold active:scale-95 transition-transform hover:bg-[#881d24] cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cell_tower
            </span>
            <span>Go Live / Start Room</span>
          </button>
          <button
            onClick={() => setIsPitchDrawerOpen(true)}
            className="bg-[#5341cd] text-white p-3 rounded-2xl shadow-md flex items-center justify-center active:scale-95 transition-transform hover:bg-[#6c5ce7] cursor-pointer"
            title="Pitch Solution Node"
          >
            <span className="material-symbols-outlined text-[24px]">lightbulb</span>
          </button>
        </div>
      </div>

      {/* Slide-up Mini Drawer for Solution Pitching */}
      {isPitchDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 flex flex-col space-y-4 animate-slide-up border-t border-[#dae2fd]">
            <div
              className="w-12 h-1 bg-[#dae2fd] rounded-full self-center cursor-pointer"
              onClick={() => setIsPitchDrawerOpen(false)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5341cd] text-[22px]">draw</span>
                <h3 className="font-bold text-[16px] text-[#131b2e]">Submit Solution Node</h3>
              </div>
              <button
                onClick={() => setIsPitchDrawerOpen(false)}
                className="text-[#787586] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePublishSolution} className="flex flex-col space-y-3">
              <div>
                <label className="font-tech text-[10px] text-[#787586] uppercase tracking-wider block mb-1 font-bold">
                  Concept Headline
                </label>
                <input
                  type="text"
                  value={pitchTitle}
                  onChange={(e) => setPitchTitle(e.target.value)}
                  placeholder="e.g. Gravity-fed Rainwater Graying..."
                  className="w-full bg-[#f2f3ff] rounded-xl px-3.5 py-2.5 text-[13px] text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
                />
              </div>

              <div>
                <label className="font-tech text-[10px] text-[#787586] uppercase tracking-wider block mb-1 font-bold">
                  Brief Technical Mechanism
                </label>
                <textarea
                  rows={3}
                  value={pitchDesc}
                  onChange={(e) => setPitchDesc(e.target.value)}
                  placeholder="Outline how students or faculties can execute this..."
                  className="w-full bg-[#f2f3ff] rounded-xl px-3.5 py-2 text-[13px] text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#5341cd] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => onShowToast('Schematic upload selector opened')}
                  className="flex items-center gap-1.5 text-[#5341cd] font-tech text-[12px] font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">attachment</span>
                  <span>Attach Schematic</span>
                </button>
                <button
                  type="submit"
                  className="bg-[#5341cd] text-white font-tech text-[12px] font-bold px-5 py-2.5 rounded-full active:scale-95 transition-transform hover:bg-[#6c5ce7] cursor-pointer shadow-xs"
                >
                  Publish to Syndicate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
