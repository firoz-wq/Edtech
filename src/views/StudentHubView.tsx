import React, { useState } from 'react';
import {
  GradeLevel,
  InterestCategory,
  LectureItem,
  AssignmentProject,
  AIStudyRecommendation,
  StudentExpert,
  UpcomingHackathon,
  CountryRecommendation,
  CareerPathRecommendation,
  IndustryProfessional,
} from '../studentTypes';
import {
  GRADE_LEVELS,
  INTEREST_CATEGORIES,
  MOCK_STUDENT_LECTURES,
  MOCK_STUDENT_PROJECTS,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_STUDENT_EXPERTS,
  MOCK_HACKATHONS,
  MOCK_COUNTRY_RECOMMENDATIONS,
  MOCK_CAREER_PATHS,
  MOCK_INDUSTRY_PROFESSIONALS,
} from '../data/studentMockData';

interface StudentHubViewProps {
  onShowToast: (message: string) => void;
  onNavigateToRoom?: () => void;
  onOpenDirectChatWith?: (expert: any) => void;
}

export const StudentHubView: React.FC<StudentHubViewProps> = ({
  onShowToast,
  onNavigateToRoom,
  onOpenDirectChatWith,
}) => {
  // Navigation & Filters State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<InterestCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabSection, setActiveTabSection] = useState<
    'all' | 'hackathons' | 'countries' | 'careers' | 'professionals' | 'lectures' | 'projects'
  >('all');

  // Modals State
  const [activeLecture, setActiveLecture] = useState<LectureItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<AssignmentProject | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<UpcomingHackathon | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<IndustryProfessional | null>(null);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isTaskDecomposerOpen, setIsTaskDecomposerOpen] = useState(false);
  const [decomposerInput, setDecomposerInput] = useState('');
  const [decomposedResult, setDecomposedResult] = useState<{ step: string; tip: string }[] | null>(null);

  // Hackathon registration form state
  const [incubatorSquadName, setIncubatorSquadName] = useState('');
  const [incubatorProjectPitch, setIncubatorProjectPitch] = useState('');
  const [incubatorFundingAsk, setIncubatorFundingAsk] = useState('$25,000 Seed Grant');

  // Professional mentorship modal state
  const [selectedOffering, setSelectedOffering] = useState<string>('');
  const [mentorshipTopic, setMentorshipTopic] = useState('');

  // New room form state
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomType, setNewRoomType] = useState('Study Desk');
  const [newRoomGrade, setNewRoomGrade] = useState<GradeLevel>('Undergraduate');
  const [newRoomCategory, setNewRoomCategory] = useState<InterestCategory>('academic_ai');

  // Dynamic project task checklist state
  const [projectTasks, setProjectTasks] = useState<Record<string, { id: string; text: string; done: boolean }[]>>({
    'proj-1': [
      { id: 't1', text: 'Design 400V battery module enclosure CAD', done: true },
      { id: 't2', text: 'Benchmark liquid cooling channel flow in OpenFOAM', done: true },
      { id: 't3', text: 'Source NTC thermistors & calibrate CAN telemetry', done: false },
      { id: 't4', text: 'Assemble mock high-voltage safety interlock', done: false },
    ],
    'proj-2': [
      { id: 't1', text: 'Flash ESP32 with moisture sensor sampling loops', done: true },
      { id: 't2', text: 'Calibrate thermophilic bacterial heat probe', done: true },
      { id: 't3', text: 'Deploy solar-battery power regulator in dining hall garden', done: false },
      { id: 't4', text: 'Build real-time student campus dashboard', done: false },
    ],
    'proj-3': [
      { id: 't1', text: 'Annotate 450 canine resting and pacing frames', done: true },
      { id: 't2', text: 'Train YOLOv8-nano with bounding box export', done: false },
      { id: 't3', text: 'Optimize on Raspberry Pi 4 with TensorRT / ONNX', done: false },
    ],
  });

  // Filter Lectures
  const filteredLectures = MOCK_STUDENT_LECTURES.filter((lec) => {
    const matchesGrade = selectedGrade === 'all' || lec.gradeLevel === selectedGrade;
    const matchesCategory = selectedCategory === 'all' || lec.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesCategory && matchesQuery;
  });

  // Filter Projects
  const filteredProjects = MOCK_STUDENT_PROJECTS.filter((proj) => {
    const matchesGrade = selectedGrade === 'all' || proj.gradeLevel === selectedGrade;
    const matchesCategory = selectedCategory === 'all' || proj.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesCategory && matchesQuery;
  });

  // Filter Hackathons
  const filteredHackathons = MOCK_HACKATHONS.filter((hack) => {
    const matchesCategory = selectedCategory === 'all' || hack.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      hack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hack.partnerIncubator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Filter Countries
  const filteredCountries = MOCK_COUNTRY_RECOMMENDATIONS.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.field === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      c.topCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fieldLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whyBest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topUniversities.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Filter Career Paths
  const filteredCareerPaths = MOCK_CAREER_PATHS.filter((cp) => {
    const matchesCategory = selectedCategory === 'all' || cp.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      cp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.topEmployers.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Filter Professionals
  const filteredProfessionals = MOCK_INDUSTRY_PROFESSIONALS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Filter AI Recommendations
  const filteredRecommendations = MOCK_AI_RECOMMENDATIONS.filter((rec) => {
    return selectedCategory === 'all' || rec.interestCategory === selectedCategory;
  });

  const handleToggleTask = (projectId: string, taskId: string) => {
    setProjectTasks((prev) => {
      const list = prev[projectId] || [];
      const updated = list.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
      return { ...prev, [projectId]: updated };
    });
    onShowToast('Task progress synced with student syndicate!');
  };

  const handleJoinProject = (project: AssignmentProject) => {
    onShowToast(`Joined team for "${project.title}"! Project workspace synced.`);
    setSelectedProject(null);
  };

  const handleRegisterHackathonSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathon || !incubatorSquadName.trim()) return;
    onShowToast(`Syndicate "${incubatorSquadName}" registered as incubator squad for ${selectedHackathon.title}! Grant proposal submitted.`);
    setSelectedHackathon(null);
    setIncubatorSquadName('');
    setIncubatorProjectPitch('');
  };

  const handleBookProfessionalMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessional) return;
    onShowToast(`Research mentorship session booked with ${selectedProfessional.name} (${selectedOffering || '1:1 Research Strategy'})!`);
    setSelectedProfessional(null);
    setSelectedOffering('');
    setMentorshipTopic('');
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;
    onShowToast(`Created student room: "${newRoomTitle}" [${newRoomGrade} • ${newRoomType}]`);
    setIsCreateRoomOpen(false);
    setNewRoomTitle('');
  };

  const handleRunTaskDecomposer = () => {
    if (!decomposerInput.trim()) return;
    setDecomposedResult([
      { step: 'Phase 1: Academic Literature & Baseline Dataset', tip: 'Gather 3 open-access papers and define variable constraints.' },
      { step: 'Phase 2: Hardware/Model Prototype Scaffold', tip: 'Spin up a modular branch with unit tests before adding telemetry.' },
      { step: 'Phase 3: Peer Cross-Validation & Peer Review', tip: 'Share notes with a student from an adjacent grade to check assumptions.' },
      { step: 'Phase 4: Synthesis & Campus Showcase Submission', tip: 'Package slide deck and 2-minute video walkthrough.' },
    ]);
    onShowToast('AI decomposed your project into 4 actionable milestones!');
  };

  return (
    <div className="pb-24 space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* 1. HERO BANNER: Academic Innovation & Educational Excellence Council */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a0ca3] text-white p-5 sm:p-7 shadow-2xl border border-indigo-400/30">
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-tech font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                <span className="material-symbols-outlined text-[15px] text-amber-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
                Academy of Learning & Innovation Excellence
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-tech font-semibold">
                Accredited 2026/27
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTaskDecomposerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border border-white/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">psychology</span>
                Milestone Slicer
              </button>
              <button
                onClick={() => setIsCreateRoomOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                New Study Room
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-tech uppercase tracking-widest text-amber-300/90 font-bold mb-1">
              Veritas • Inventio • Excellentia
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-academic">
              Educational Mastery, Research Syndicates & Innovation Grants
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl mt-1.5">
              Empowering students through verified curriculum lectures by grade, equity-free incubator grants, world destination fellowships, and collaborative research teams driving scientific excellence.
            </p>
          </div>

          {/* CURRICULUM LEVEL SELECTOR */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-tech font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-300">verified</span>
              Curriculum & Academic Level:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-3 py-1 rounded-lg text-xs font-tech font-bold transition-all cursor-pointer ${
                  selectedGrade === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/60'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
              >
                All Levels
              </button>
              {GRADE_LEVELS.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-tech font-bold transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/60'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXPANDED CATEGORIES CAROUSEL ACROSS ALL HUBS */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#dae2fd]/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-tech">
          <span className="text-[#474554] font-bold flex items-center gap-1.5 uppercase tracking-wide">
            <span className="material-symbols-outlined text-[16px] text-[#5341cd]">category</span>
            Expanded Field Categories ({INTEREST_CATEGORIES.length - 1} Tracks)
          </span>
          <span className="text-[11px] text-[#787586]">
            {selectedCategory === 'all'
              ? 'Showing all categories'
              : `Filtered: ${selectedCategory.replace('_', ' ')}`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {INTEREST_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#5341cd] text-white border-[#5341cd] shadow-md shadow-[#5341cd]/20 scale-102'
                    : 'bg-[#faf8ff] text-[#474554] border-[#dae2fd]/70 hover:bg-[#ece7ff] hover:text-[#5341cd]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN SECTION SWITCHER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#dae2fd] pb-2">
        {(
          [
            { key: 'all', label: 'Overview', icon: 'dashboard' },
            { key: 'hackathons', label: `Hackathons & Grants (${filteredHackathons.length})`, icon: 'trophy', badge: 'Incubator' },
            { key: 'countries', label: `Best Country Guide (${filteredCountries.length})`, icon: 'public' },
            { key: 'careers', label: `Career Roadmaps (${filteredCareerPaths.length})`, icon: 'trending_up' },
            { key: 'professionals', label: `Industry Mentors (${filteredProfessionals.length})`, icon: 'supervisor_account' },
            { key: 'lectures', label: `Lectures (${filteredLectures.length})`, icon: 'play_lesson' },
            { key: 'projects', label: `Group Work (${filteredProjects.length})`, icon: 'assignment' },
          ] as {
            key: 'all' | 'hackathons' | 'countries' | 'careers' | 'professionals' | 'lectures' | 'projects';
            label: string;
            icon: string;
            badge?: string;
          }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTabSection(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-tech font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTabSection === tab.key
                ? 'bg-[#5341cd] text-white shadow-xs'
                : 'bg-white text-[#474554] border border-[#dae2fd]/60 hover:bg-[#ece7ff] hover:text-[#5341cd]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#160066] text-[9px] font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. AI STUDY & INCUBATOR RECOMMENDATIONS */}
      {filteredRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-[#f0edff] to-[#e7f7f4] rounded-2xl p-4 border border-[#cfc4ff]/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#5341cd] animate-pulse">
                auto_awesome
              </span>
              <span className="font-tech text-xs sm:text-sm font-bold text-[#160066] uppercase tracking-wider">
                AI Knowledge Sharing & Incubator Matchmaker
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5341cd]/10 text-[#5341cd]">
              Synergy Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl p-3 border border-[#dae2fd] shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00b894]" />
                    <h2 className="text-xs font-bold text-[#131b2e] leading-snug font-tech">
                      {rec.headline}
                    </h2>
                  </div>
                  <p className="text-[11.5px] text-[#474554] leading-relaxed line-clamp-2">
                    {rec.aiRationale}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between mt-2 border-t border-[#f0f0f5]">
                  <div className="flex items-center gap-1">
                    {rec.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#f4f2ff] text-[#5341cd] font-tech font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      onShowToast(`Action triggered: ${rec.actionText}`);
                      if (rec.headline.includes('Grant Incubator') || rec.tags.includes('Incubator')) {
                        setActiveTabSection('hackathons');
                      } else if (rec.promptType === 'group_study' && onNavigateToRoom) {
                        onNavigateToRoom();
                      }
                    }}
                    className="text-[11px] font-tech font-bold text-[#5341cd] hover:text-[#3d2e9e] flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{rec.actionText}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. UPCOMING HACKATHONS & INCUBATOR GRANTS SECTION */}
      {(activeTabSection === 'all' || activeTabSection === 'hackathons') && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-amber-500">
                  emoji_events
                </span>
                Upcoming Hackathons & Incubator Grants
              </h2>
              <p className="text-[11px] text-[#787586]">
                Form student syndicates, participate as incubators, and win equity-free seed grants.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-tech font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {filteredHackathons.length} Active Challenges
            </span>
          </div>

          <div className="space-y-4">
            {filteredHackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="bg-white rounded-2xl border border-[#dae2fd] p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all space-y-3.5 relative overflow-hidden group"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={hackathon.logo}
                      alt={hackathon.organizer}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#5341cd]/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-tech font-bold px-2 py-0.5 rounded-full bg-[#ece7ff] text-[#5341cd]">
                          {hackathon.categoryLabel}
                        </span>
                        <span className="text-[11px] font-tech font-bold text-rose-600 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">alarm</span>
                          {hackathon.daysLeft} days left
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#131b2e] leading-snug mt-1 font-tech">
                        {hackathon.title}
                      </h3>
                      <p className="text-xs text-[#787586]">
                        Organized by {hackathon.organizer} • {hackathon.location}
                      </p>
                    </div>
                  </div>

                  {/* Grant Pool Badge */}
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-tech font-bold text-xs shadow-sm">
                      {hackathon.grantPool}
                    </span>
                    <p className="text-[10px] text-[#787586] mt-0.5">
                      First Prize: {hackathon.firstPrize}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#474554] leading-relaxed">
                  {hackathon.description}
                </p>

                {/* Incubator Perks */}
                <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#e4dfff] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-tech font-bold text-[#160066]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#5341cd]">rocket_launch</span>
                      Incubator Program Perks ({hackathon.partnerIncubator}):
                    </span>
                    <span className="text-[#00b894]">{hackathon.participatingSyndicatesCount} syndicates entered</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#474554]">
                    {hackathon.incubatorPerks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[13px] text-[#00b894]">check_circle</span>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f0f5]">
                  <div className="flex items-center gap-1.5">
                    {hackathon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-tech px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedHackathon(hackathon)}
                      className="px-4 py-2 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                      Enter as Incubator Squad
                    </button>
                    <button
                      onClick={() => onShowToast(`Opened ${hackathon.title} RFP and grant rubric guidelines`)}
                      className="px-3 py-2 rounded-xl bg-[#faf8ff] hover:bg-[#ece7ff] text-[#5341cd] border border-[#dae2fd] text-xs font-tech font-bold transition-all cursor-pointer"
                    >
                      Grant Rubric
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. BEST COUNTRY FOR STUDENTS BY FIELD/COURSE */}
      {(activeTabSection === 'all' || activeTabSection === 'countries') && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#00b894]">
                  public
                </span>
                Global Study & Course Country Advisor
              </h2>
              <p className="text-[11px] text-[#787586]">
                Best countries for your field, post-study work visas, tuition fees, and top universities.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-tech font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified 2026/27 Intake
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCountries.map((country) => (
              <div
                key={country.id}
                className="bg-white rounded-2xl border border-[#dae2fd] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-tech font-bold text-[#5341cd] bg-[#ece7ff] px-2 py-0.5 rounded-full">
                        {country.fieldLabel}
                      </span>
                      <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-1.5 mt-1 font-tech">
                        <span className="text-xl">{country.countryFlag}</span>
                        <span>{country.topCountry}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          #{country.ranking} Choice
                        </span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-tech font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {country.studentFriendlyScore}/100 Score
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#474554] leading-relaxed">
                    {country.whyBest}
                  </p>

                  {/* Top Universities */}
                  <div className="space-y-1">
                    <span className="text-[10.5px] font-tech font-bold text-[#160066] uppercase tracking-wide">
                      Top Target Universities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {country.topUniversities.map((uni, idx) => (
                        <span
                          key={idx}
                          className="text-[10.5px] px-2 py-0.5 rounded-md bg-[#faf8ff] text-[#2c1a84] border border-[#e4dfff]"
                        >
                          {uni}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Stats: Visa & Tuition */}
                  <div className="bg-[#faf8ff] p-2.5 rounded-xl border border-[#e4dfff] space-y-1.5 text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#5341cd] shrink-0">badge</span>
                      <div>
                        <span className="font-bold text-[#131b2e]">Work Visa: </span>
                        <span className="text-[#474554]">{country.postStudyWorkVisa}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#00b894] shrink-0">payments</span>
                      <div>
                        <span className="font-bold text-[#131b2e]">Tuition: </span>
                        <span className="text-[#474554]">{country.averageAnnualTuition}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#f0f0f5]">
                  <span className="text-[10.5px] text-[#787586] font-tech">
                    Hubs: {country.topIndustryHubs.join(', ')}
                  </span>
                  <button
                    onClick={() => onShowToast(`Downloaded full international student guide for ${country.topCountry} (${country.fieldLabel})`)}
                    className="text-xs font-tech font-bold text-[#5341cd] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Country Guide</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BEST CAREER PATH RECOMMENDATIONS & ROADMAP */}
      {(activeTabSection === 'all' || activeTabSection === 'careers') && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#5341cd]">
                  trending_up
                </span>
                Tailored Career Paths & Trajectories
              </h2>
              <p className="text-[11px] text-[#787586]">
                Salary benchmarks, 5-year growth outlook, and step-by-step academic progression roadmaps.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-tech font-bold bg-[#ece7ff] text-[#5341cd]">
              High Growth Trajectories
            </span>
          </div>

          <div className="space-y-4">
            {filteredCareerPaths.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-2xl border border-[#dae2fd] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-tech font-bold px-2 py-0.5 rounded-full bg-[#ece7ff] text-[#5341cd]">
                      {career.categoryLabel}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#131b2e] font-tech mt-1">
                      {career.roleTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-tech font-bold border border-emerald-200">
                      {career.growthOutlook}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#474554] leading-relaxed">
                  {career.description}
                </p>

                {/* Salary Benchmarks */}
                <div className="grid grid-cols-2 gap-2 bg-[#faf8ff] p-3 rounded-xl border border-[#e4dfff]">
                  <div>
                    <span className="text-[10px] font-tech uppercase font-bold text-[#787586]">
                      Starting Compensation
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#131b2e] font-tech">
                      {career.averageStartingSalary}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-tech uppercase font-bold text-[#787586]">
                      Senior / Principal Level
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#5341cd] font-tech">
                      {career.seniorSalary}
                    </p>
                  </div>
                </div>

                {/* Top Employers */}
                <div>
                  <span className="text-[10.5px] font-tech font-bold text-[#160066] uppercase tracking-wide">
                    Top Global Employers:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {career.topEmployers.map((emp, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-800 font-medium"
                      >
                        {emp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Academic & Career Milestones Roadmap */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-tech font-bold text-[#160066] uppercase tracking-wide flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#5341cd]">route</span>
                    Academic Progression Roadmap:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {career.academicMilestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-[#faf8ff] border border-[#e4dfff] flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#5341cd] text-white flex items-center justify-center font-tech text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-[10.5px] font-tech font-bold text-[#131b2e]">
                            {m.level}
                          </p>
                          <p className="text-[11px] text-[#474554] leading-tight mt-0.5">
                            {m.milestone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Skills */}
                <div className="pt-2 border-t border-[#f0f0f5] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {career.requiredSkills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-tech px-2 py-0.5 rounded-md bg-[#ece7ff] text-[#5341cd] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      onShowToast(`Mapped personal curriculum roadmap for "${career.roleTitle}"!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold cursor-pointer transition-all"
                  >
                    Adopt Career Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CONNECT WITH INDUSTRY PROFESSIONALS FOR RESEARCH & GUIDANCE */}
      {(activeTabSection === 'all' || activeTabSection === 'professionals') && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#5341cd]">
                  supervisor_account
                </span>
                Industry Professionals & Research Mentors
              </h2>
              <p className="text-[11px] text-[#787586]">
                Connect with principal engineers, incubator directors, and research fellows for grant pitch prep and career strategy.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-tech font-bold bg-[#ece7ff] text-[#5341cd]">
              Free Syndicate Mentorship
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredProfessionals.map((prof) => (
              <div
                key={prof.id}
                className="bg-white rounded-2xl border border-[#dae2fd] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#5341cd]/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="text-xs sm:text-sm font-bold text-[#131b2e] truncate">
                          {prof.name}
                        </h3>
                        {prof.isVerified && (
                          <span className="material-symbols-outlined text-[14px] text-[#5341cd]">
                            verified
                          </span>
                        )}
                        {prof.incubatorPartner && (
                          <span className="text-[9px] font-tech font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Incubator Partner
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5341cd] font-semibold truncate font-tech">
                        {prof.title}
                      </p>
                      <p className="text-[10px] text-[#787586] truncate">
                        {prof.company} • {prof.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-[#474554] line-clamp-2 leading-relaxed">
                    {prof.bio}
                  </p>

                  {/* Mentorship Offerings */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-tech font-bold text-[#787586] uppercase tracking-wider">
                      Mentorship Offerings:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {prof.mentorshipOfferings.map((off, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-tech px-2 py-0.5 rounded-md bg-[#faf8ff] text-[#2c1a84] border border-[#e4dfff]"
                        >
                          {off}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f0f0f5] flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-tech text-[#00b894] font-bold">
                    {prof.availableSlots} mentorship slots open
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedProfessional(prof)}
                      className="px-3 py-1.5 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Book Guidance
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenDirectChatWith) {
                          onOpenDirectChatWith(prof);
                        } else {
                          onShowToast(`Opened direct research discussion with ${prof.name}`);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#faf8ff] hover:bg-[#ece7ff] text-[#5341cd] border border-[#dae2fd] text-xs font-tech font-bold transition-all cursor-pointer"
                      title="Direct Chat"
                    >
                      <span className="material-symbols-outlined text-[15px]">chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. LECTURES BY GRADE LEVEL SECTION */}
      {(activeTabSection === 'all' || activeTabSection === 'lectures') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#5341cd]">
                  play_lesson
                </span>
                School Lectures & Video Masterclasses
              </h2>
              <p className="text-[11px] text-[#787586]">
                Organized by syllabus grade and verified university faculties.
              </p>
            </div>
            <span className="text-[11px] font-tech font-bold text-[#5341cd] bg-[#ece7ff] px-2.5 py-0.5 rounded-full">
              {filteredLectures.length} Lectures Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="bg-white rounded-2xl border border-[#dae2fd]/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    <img
                      src={lecture.videoThumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#131b2e]/80 backdrop-blur-md text-white font-tech font-bold text-[10px] border border-white/20">
                      {lecture.gradeLevel}
                    </span>

                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white font-tech text-[10px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {lecture.duration}
                    </span>

                    <button
                      onClick={() => setActiveLecture(lecture)}
                      className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#5341cd] flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#787586] font-tech">
                      <span className="text-[#5341cd] font-bold">{lecture.subject}</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        {lecture.studentRating} ({lecture.enrolledCount})
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveLecture(lecture)}
                      className="text-xs sm:text-sm font-bold text-[#131b2e] leading-snug line-clamp-2 hover:text-[#5341cd] cursor-pointer"
                    >
                      {lecture.title}
                    </h3>

                    <p className="text-[11.5px] text-[#474554] line-clamp-2 leading-relaxed">
                      {lecture.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#f0f0f5]">
                      <img
                        src={lecture.instructor.avatar}
                        alt={lecture.instructor.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-[#5341cd]/30"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#131b2e] truncate flex items-center gap-1">
                          {lecture.instructor.name}
                          {lecture.instructor.isVerified && (
                            <span className="material-symbols-outlined text-[12px] text-[#5341cd]">verified</span>
                          )}
                        </p>
                        <p className="text-[9.5px] text-[#787586] truncate">
                          {lecture.instructor.affiliation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveLecture(lecture)}
                    className="flex-1 py-1.5 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    Watch Lecture
                  </button>
                  <button
                    onClick={() => {
                      onShowToast(`Downloading syllabus notes for "${lecture.title}"`);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#faf8ff] hover:bg-[#ece7ff] text-[#5341cd] border border-[#dae2fd] text-xs font-tech font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Download Slide Deck"
                  >
                    <span className="material-symbols-outlined text-[15px]">description</span>
                    Slides
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. GROUP WORK & ASSIGNMENTS SECTION */}
      {(activeTabSection === 'all' || activeTabSection === 'projects') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-tech text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00b894]">
                  groups_3
                </span>
                Group Work & Assignment Sprints
              </h2>
              <p className="text-[11px] text-[#787586]">
                Academic & passion projects: Motors, Clean Energy, Space, Nature, Pets, Sports, AI & Social.
              </p>
            </div>
            <button
              onClick={() => setIsCreateRoomOpen(true)}
              className="text-xs font-tech font-bold text-[#5341cd] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Post Project
            </button>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const tasks = projectTasks[project.id] || [
                { id: '1', text: 'Define problem scope and literature review', done: true },
                { id: '2', text: 'Build simulation/prototype harness', done: false },
                { id: '3', text: 'Peer code review and campus presentation', done: false },
              ];
              const completedCount = tasks.filter((t) => t.done).length;
              const progressPct = Math.round((completedCount / tasks.length) * 100);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-[#dae2fd] p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold bg-[#ece7ff] text-[#5341cd]">
                          {project.categoryLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-tech font-semibold bg-[#faf8ff] text-[#787586] border border-[#dae2fd]">
                          {project.gradeLevel}
                        </span>
                        <span className="text-[11px] font-tech font-bold text-rose-600 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">alarm</span>
                          {project.deadline}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e] leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-tech font-bold border border-emerald-200">
                        {project.slotsOpen} open slots
                      </span>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1 rounded-lg bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all cursor-pointer"
                      >
                        Join Team
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#474554] leading-relaxed">
                    {project.description}
                  </p>

                  {project.aiAssistanceNotes && (
                    <div className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e4dfff] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#5341cd] shrink-0 mt-0.5">
                        psychology
                      </span>
                      <p className="text-[11px] text-[#2c1a84] font-medium leading-relaxed">
                        {project.aiAssistanceNotes}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#f0f0f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.teamMembers.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.avatar}
                            alt={m.name}
                            title={`${m.name} (${m.role})`}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#787586] font-tech">
                        {project.teamMembers.map((m) => m.name.split(' ')[0]).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-[11px] font-tech font-bold text-[#131b2e]">
                          <span>{completedCount}/{tasks.length} tasks</span>
                          <span className="text-[#5341cd]">({progressPct}%)</span>
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-[#f0f0f5] overflow-hidden">
                          <div
                            className="h-full bg-[#00b894] rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-2.5 py-1 rounded-lg bg-[#faf8ff] hover:bg-[#ece7ff] text-[#5341cd] text-xs font-tech font-bold border border-[#dae2fd] cursor-pointer"
                      >
                        Tasks
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODAL 1: ENTER AS INCUBATOR SQUAD FOR HACKATHON & GRANTS */}
      {selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd]">
            <div className="p-4 bg-gradient-to-r from-[#160066] to-[#5341cd] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-300">rocket_launch</span>
                <div>
                  <h3 className="font-tech text-sm font-bold truncate max-w-xs sm:max-w-md">
                    Incubator Squad Entry: {selectedHackathon.title}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Grant Pool: {selectedHackathon.grantPool} • {selectedHackathon.partnerIncubator}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHackathon(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterHackathonSquad} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Syndicate / Incubator Squad Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carbon Blueprints Lab / Formula Aero Syndicate"
                  value={incubatorSquadName}
                  onChange={(e) => setIncubatorSquadName(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                />
              </div>

              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Requested Grant Tranche / Funding Ask
                </label>
                <select
                  value={incubatorFundingAsk}
                  onChange={(e) => setIncubatorFundingAsk(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                >
                  <option value="$10,000 Micro-Grant">$10,000 Micro-Grant (Prototype Materials)</option>
                  <option value="$25,000 Seed Grant">$25,000 Seed Grant (Bench testing + Cloud credits)</option>
                  <option value="$50,000 Full Accelerator">$50,000 Full Accelerator (Residency + Hardware lab)</option>
                  <option value="$100,000 Grand Prize">$100,000 Grand Prize (Pilot commercial deployment)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  1-Paragraph Project Abstract & Scientific Novelty
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize your team's approach, technical architecture, and how incubator mentorship will accelerate development..."
                  value={incubatorProjectPitch}
                  onChange={(e) => setIncubatorProjectPitch(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd] resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold font-tech flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">verified</span>
                  Incubator Squad Entitlements:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Your student syndicate receives immediate access to verified compute credits, sandbox repos, and priority review from {selectedHackathon.partnerIncubator}.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHackathon(null)}
                  className="px-3 py-2 rounded-xl text-xs font-tech font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  Submit Syndicate Grant Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK INDUSTRY PROFESSIONAL GUIDANCE */}
      {selectedProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd]">
            <div className="p-4 bg-[#160066] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedProfessional.avatar}
                  alt={selectedProfessional.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
                />
                <div>
                  <h3 className="font-tech text-sm font-bold">
                    Mentorship with {selectedProfessional.name}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    {selectedProfessional.title} • {selectedProfessional.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfessional(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleBookProfessionalMentorship} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Select Mentorship Focus
                </label>
                <select
                  required
                  value={selectedOffering}
                  onChange={(e) => setSelectedOffering(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                >
                  <option value="">Choose an offering...</option>
                  {selectedProfessional.mentorshipOfferings.map((off, idx) => (
                    <option key={idx} value={off}>{off}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Research Topic or Question for Mentor
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your project, grant proposal, or career decision you want feedback on..."
                  value={mentorshipTopic}
                  onChange={(e) => setMentorshipTopic(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-2.5 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd] resize-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold font-tech flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#00b894]">verified</span>
                  Free Academic Tier:
                </span>
                <p className="text-[11px] mt-0.5">
                  100% sponsored for verified university and secondary students in research syndicates.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProfessional(null)}
                  className="px-3 py-2 rounded-xl text-xs font-tech font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold shadow-md cursor-pointer"
                >
                  Confirm Mentorship Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LECTURE PLAYER & SYLLABUS VIEWER */}
      {activeLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd] max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#160066] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-300">smart_display</span>
                <div>
                  <h3 className="font-tech text-sm font-bold truncate max-w-xs sm:max-w-md">
                    {activeLecture.title}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    {activeLecture.gradeLevel} • {activeLecture.subject} • {activeLecture.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLecture(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeLecture.videoThumbnail}
                alt={activeLecture.title}
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 gap-2">
                <button
                  onClick={() => onShowToast(`Streaming "${activeLecture.title}" in 1080p HD`)}
                  className="w-16 h-16 rounded-full bg-[#5341cd] hover:bg-[#3d2e9e] text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[36px]">play_arrow</span>
                </button>
                <span className="text-white text-xs font-tech font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                  Click to stream lecture video with live subtitles
                </span>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div>
                <h4 className="text-xs font-bold font-tech text-[#131b2e] uppercase tracking-wider mb-2">
                  Lecture Chapters & Milestones ({activeLecture.chaptersCount} parts)
                </h4>
                <div className="space-y-1.5">
                  {[
                    '1. Conceptual Core & Historical Foundation (00:00)',
                    '2. Mathematical Derivations & Axioms (12:40)',
                    '3. Interactive Field Lab / Computer Simulation (24:15)',
                    '4. Problem Sets & Typical Exam Traps (33:50)',
                  ].map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#faf8ff] border border-[#e4dfff] flex items-center justify-between text-xs hover:bg-[#ece7ff] cursor-pointer transition-colors"
                      onClick={() => onShowToast(`Jumped to chapter: ${ch}`)}
                    >
                      <span className="font-tech text-[#131b2e] font-medium">{ch}</span>
                      <span className="material-symbols-outlined text-[16px] text-[#5341cd]">play_circle</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#f0f0f5]">
                <button
                  onClick={() => {
                    onShowToast(`Created student study desk for "${activeLecture.title}"`);
                    setActiveLecture(null);
                    if (onNavigateToRoom) onNavigateToRoom();
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  Start Study Syndicate
                </button>
                <button
                  onClick={() => onShowToast('Opened full PDF syllabus notes in viewer')}
                  className="px-4 py-2 rounded-xl bg-[#faf8ff] hover:bg-[#ece7ff] text-[#5341cd] border border-[#dae2fd] text-xs font-tech font-bold cursor-pointer"
                >
                  Download Slides PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PROJECT TASKS & JOIN TEAM MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd] max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#160066] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-tech font-bold text-indigo-300">
                  {selectedProject.categoryLabel} • {selectedProject.gradeLevel}
                </span>
                <h3 className="font-tech text-sm font-bold truncate max-w-sm">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div>
                <h4 className="text-xs font-bold font-tech text-[#131b2e] uppercase tracking-wider mb-1.5">
                  Project Objective
                </h4>
                <p className="text-xs text-[#474554] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold font-tech text-[#131b2e] uppercase tracking-wider">
                    Interactive Sprint Checklist
                  </h4>
                  <span className="text-[11px] text-[#787586]">Click to check off</span>
                </div>

                <div className="space-y-1.5">
                  {(projectTasks[selectedProject.id] || [
                    { id: '1', text: 'Define problem scope and literature review', done: true },
                    { id: '2', text: 'Build simulation/prototype harness', done: false },
                    { id: '3', text: 'Peer code review and campus presentation', done: false },
                  ]).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(selectedProject.id, task.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        task.done
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through'
                          : 'bg-[#faf8ff] border-[#dae2fd] text-[#131b2e] hover:bg-[#ece7ff]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${task.done ? 'text-[#00b894]' : 'text-[#787586]'}`}>
                        {task.done ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="text-xs font-medium">{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold font-tech text-[#131b2e] uppercase tracking-wider mb-2">
                  Current Syndicate Members ({selectedProject.teamMembers.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.teamMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#faf8ff] border border-[#e4dfff] flex items-center gap-2"
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#5341cd]/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#131b2e] truncate">{m.name}</p>
                        <p className="text-[9.5px] text-[#787586] truncate">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0f0f5] flex items-center gap-2">
                <button
                  onClick={() => handleJoinProject(selectedProject)}
                  className="flex-1 py-2.5 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  Claim Open Slot & Join Project
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-tech font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CREATE SPECIFIC STUDENT ROOM */}
      {isCreateRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd]">
            <div className="p-4 bg-[#160066] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-300">add_business</span>
                <h3 className="font-tech text-sm font-bold">Create Specific Student Room</h3>
              </div>
              <button
                onClick={() => setIsCreateRoomOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Room Title & Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Space CubeSat Telemetry / Formula EV Powertrain Sprint"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-3 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-2 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                  >
                    <option value="Study Desk">Subject Study Desk</option>
                    <option value="Sprint Room">Assignment Sprint</option>
                    <option value="Hobby Lounge">Hobby & Passion Lounge</option>
                    <option value="Debate Arena">Debate & Peer Arena</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                    Grade Focus
                  </label>
                  <select
                    value={newRoomGrade}
                    onChange={(e) => setNewRoomGrade(e.target.value as GradeLevel)}
                    className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-2 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                  >
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-tech font-bold text-[#131b2e] mb-1">
                  Interest Track
                </label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value as InterestCategory)}
                  className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl px-2 py-2 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd]"
                >
                  {INTEREST_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-tech font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold shadow-md cursor-pointer"
                >
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: AI TASK SLICER & KNOWLEDGE DECOMPOSER */}
      {isTaskDecomposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#dae2fd]">
            <div className="p-4 bg-gradient-to-r from-[#160066] to-[#5341cd] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-300">psychology</span>
                <h3 className="font-tech text-sm font-bold">AI Assignment & Task Slicer</h3>
              </div>
              <button
                onClick={() => {
                  setIsTaskDecomposerOpen(false);
                  setDecomposedResult(null);
                  setDecomposerInput('');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-[#474554] leading-relaxed">
                Paste any complex homework prompt, science lab rubric, or project idea. The AI will decompose it into sprint milestones and recommend student study matches.
              </p>

              <textarea
                rows={3}
                placeholder="e.g. Build an automatic aeroponic seedling mister with temperature threshold alerts..."
                value={decomposerInput}
                onChange={(e) => setDecomposerInput(e.target.value)}
                className="w-full bg-[#faf8ff] border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] focus:outline-none focus:border-[#5341cd] resize-none"
              />

              <button
                onClick={handleRunTaskDecomposer}
                className="w-full py-2.5 rounded-xl bg-[#5341cd] hover:bg-[#3d2e9e] text-white text-xs font-tech font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Decompose into Milestones
              </button>

              {decomposedResult && (
                <div className="pt-2 border-t border-[#f0f0f5] space-y-2">
                  <span className="text-[11px] font-tech font-bold text-[#160066] uppercase tracking-wider">
                    Generated Sprint Plan:
                  </span>
                  <div className="space-y-1.5">
                    {decomposedResult.map((res, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#dae2fd] text-xs">
                        <p className="font-bold text-[#5341cd] font-tech">{res.step}</p>
                        <p className="text-[#474554] text-[11px] mt-0.5">{res.tip}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onShowToast('Sprint plan exported to Student Hub projects!');
                      setIsTaskDecomposerOpen(false);
                      setDecomposedResult(null);
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-tech font-bold cursor-pointer"
                  >
                    Convert to Shared Syndicate Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
