import React, { useState } from 'react';
import { SyndicateMember } from '../types';
import { MOCK_SYNDICATE_MEMBERS } from '../data/mockData';

interface GroupSettingsViewProps {
  onBack: () => void;
  onShowToast: (message: string) => void;
}

export const GroupSettingsView: React.FC<GroupSettingsViewProps> = ({
  onBack,
  onShowToast,
}) => {
  const [inviteRole, setInviteRole] = useState<'Viewer' | 'Contributor'>('Viewer');
  const [showQrModal, setShowQrModal] = useState(false);
  const [searchMember, setSearchMember] = useState('');

  // Permissions Switches
  const [publicDiscovery, setPublicDiscovery] = useState(false);
  const [forumMode, setForumMode] = useState<'All Members' | 'Approved Only' | 'Announcement'>('Approved Only');
  const [richMediaUploads, setRichMediaUploads] = useState(true);
  const [liveStageBroadcasts, setLiveStageBroadcasts] = useState(false);
  const [autoArchive, setAutoArchive] = useState(true);

  // Members state
  const [members, setMembers] = useState<SyndicateMember[]>(MOCK_SYNDICATE_MEMBERS);

  const toggleMemberMute = (memberId: string, memberName: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const nextMuted = !m.isMuted;
          onShowToast(
            nextMuted
              ? `${memberName} muted from commenting`
              : `${memberName} can now post in discussion`
          );
          return { ...m, isMuted: nextMuted };
        }
        return m;
      })
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!searchMember.trim()) return true;
    const q = searchMember.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.handle.toLowerCase().includes(q) ||
      m.university.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full pb-24">
      <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-5">
        {/* Group Summary Hero Card */}
        <section className="bg-[#f2f3ff] rounded-2xl p-4 shadow-xs border border-[#eaedff] relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#5341cd]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3.5 relative">
            <div className="w-14 h-14 rounded-2xl bg-[#5341cd] text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffdad8] text-[#410006] font-tech text-[10px] font-bold uppercase mb-1">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span>Private Lab Group</span>
              </div>
              <h2 className="font-bold text-[18px] text-[#131b2e] leading-snug truncate">
                Carbon Blueprints & Sustainable Campus
              </h2>
              <p className="text-[12px] text-[#474554] truncate mt-0.5 font-tech">
                Syndicate ID: #SPK-8842 · Stanford CleanTech Guild
              </p>
            </div>
          </div>

          {/* Quick Group Share Action Panel */}
          <div className="mt-4 pt-3 bg-white rounded-xl p-3 shadow-xs border border-[#eaedff] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5341cd] text-[20px]">share</span>
                <span className="font-tech text-[13px] font-bold text-[#131b2e]">Share Group & QR Code</span>
              </div>
              <span className="font-tech text-[10px] text-[#474554] bg-[#f2f3ff] px-2 py-0.5 rounded-full">
                Expires in 48h
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setInviteRole('Viewer');
                  onShowToast('Invite scope set to Viewer');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-tech text-[12px] font-bold transition-all cursor-pointer ${
                  inviteRole === 'Viewer'
                    ? 'bg-[#5341cd] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Viewer Link</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInviteRole('Contributor');
                  onShowToast('Invite scope set to Contributor');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-tech text-[12px] font-bold transition-all cursor-pointer ${
                  inviteRole === 'Contributor'
                    ? 'bg-[#5341cd] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Contributor Link</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-[#f2f3ff] px-3 py-2 rounded-xl font-tech text-[11px] text-[#474554] truncate select-all">
                https://spark.edu/syndicate/c-blueprints?token=9xk18z&role={inviteRole.toLowerCase()}
              </div>
              <button
                type="button"
                aria-label="Copy Invite Link"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://spark.edu/syndicate/c-blueprints?token=9xk18z&role=${inviteRole.toLowerCase()}`
                  );
                  onShowToast(`Secure ${inviteRole} link copied!`);
                }}
                className="shrink-0 p-2 rounded-xl bg-[#6c5ce7] text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
              <button
                type="button"
                aria-label="Show QR Code"
                onClick={() => setShowQrModal(true)}
                className="shrink-0 p-2 rounded-xl bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 1: Privacy & Discovery Settings */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-tech text-[12px] font-bold text-[#131b2e] tracking-wider uppercase">
              Discovery & Permissions
            </h3>
            <span className="material-symbols-outlined text-[18px] text-[#787586]">tune</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden flex flex-col">
            {/* Discovery Toggle */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#131b2e]">
                  <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] leading-snug">Public Discovery</div>
                  <p className="text-[12px] text-[#787586] mt-0.5">
                    Show this syndicate in campus explorer feeds
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={publicDiscovery}
                onClick={() => {
                  setPublicDiscovery(!publicDiscovery);
                  onShowToast(!publicDiscovery ? 'Syndicate is now discoverable publicly' : 'Syndicate hidden from public feeds');
                }}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                  publicDiscovery ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    publicDiscovery ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-[1px] bg-[#eaedff] mx-3.5" />

            {/* Forum Interaction Level */}
            <div className="p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-[#131b2e]">Forum Interaction Mode</span>
                <span className="font-tech text-[11px] text-[#5341cd] font-bold">{forumMode}</span>
              </div>
              <p className="text-[12px] text-[#787586]">
                Specify who can start debate threads and drop annotations.
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-1 bg-[#f2f3ff] p-1 rounded-xl">
                {(['All Members', 'Approved Only', 'Announcement'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setForumMode(mode);
                      onShowToast(`Interaction mode: ${mode}`);
                    }}
                    className={`py-1.5 px-1 text-center rounded-lg font-tech text-[11px] font-bold transition-all cursor-pointer ${
                      forumMode === mode
                        ? 'bg-white text-[#5341cd] shadow-xs'
                        : 'text-[#474554] hover:bg-[#eaedff]'
                    }`}
                  >
                    {mode === 'Approved Only' ? 'Approved' : mode === 'Announcement' ? 'Announce' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[#eaedff] mx-3.5" />

            {/* Rich Media Uploads Toggle */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#131b2e]">
                  <span className="material-symbols-outlined text-[20px]">perm_media</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] leading-snug">Rich Media Uploads</div>
                  <p className="text-[12px] text-[#787586] mt-0.5">
                    Allow members to attach raw telemetry, videos & slides
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={richMediaUploads}
                onClick={() => {
                  setRichMediaUploads(!richMediaUploads);
                  onShowToast(!richMediaUploads ? 'Rich media uploads permitted' : 'Media uploads restricted to admins');
                }}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                  richMediaUploads ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    richMediaUploads ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-[1px] bg-[#eaedff] mx-3.5" />

            {/* Live Stage Broadcasts */}
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#131b2e]">
                  <span className="material-symbols-outlined text-[20px]">sensors</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] leading-snug">Live Stage Broadcasts</div>
                  <p className="text-[12px] text-[#787586] mt-0.5">
                    Permit instant peer-to-peer audio & video sessions
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={liveStageBroadcasts}
                onClick={() => {
                  setLiveStageBroadcasts(!liveStageBroadcasts);
                  onShowToast(!liveStageBroadcasts ? 'Live peer broadcasting opened' : 'Live stages disabled');
                }}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                  liveStageBroadcasts ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    liveStageBroadcasts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Active Syndicate Members */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-tech text-[12px] font-bold text-[#131b2e] tracking-wider uppercase">
                Active Syndicate Members
              </h3>
              <p className="text-[11px] text-[#787586] font-tech">5 total participants · 1 restricted</p>
            </div>
            <button
              onClick={() => onShowToast('Invite modal opened. Share token: SPK-8842')}
              className="flex items-center gap-1 font-tech text-[11px] font-bold text-[#5341cd] bg-[#5341cd]/10 px-3 py-1 rounded-full hover:bg-[#5341cd] hover:text-white transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">person_add</span>
              <span>Invite</span>
            </button>
          </div>

          {/* Quick Search Field */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#787586] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Search by name, ID, or university..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#787586] border border-[#eaedff] focus:outline-none focus:ring-1 focus:ring-[#5341cd] shadow-xs"
            />
          </div>

          {/* Member Roster List */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden flex flex-col divide-y divide-[#eaedff]">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-black/5"
                    />
                    {member.isOwner && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#5341cd] text-white rounded-full flex items-center justify-center text-[10px]" title="Owner">
                        <span className="material-symbols-outlined text-[10px]">shield</span>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[14px] text-[#131b2e] truncate">
                        {member.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-tech text-[9px] font-bold ${
                          member.role === 'Admin'
                            ? 'bg-[#e4dfff] text-[#160066]'
                            : member.role === 'View-Only'
                            ? 'bg-[#ffdad8] text-[#410006]'
                            : 'bg-[#eaedff] text-[#474554]'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#787586] font-tech truncate mt-0.5">
                      {member.university} · {member.handle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {member.isOwner ? (
                    <span className="text-[#787586] font-tech text-[11px] mr-1">Owner</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleMemberMute(member.id, member.name)}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          member.isMuted
                            ? 'text-[#a83639] bg-[#ffdad8]/50 hover:bg-[#ffdad8]'
                            : 'text-[#787586] hover:text-[#5341cd] hover:bg-[#f2f3ff]'
                        }`}
                        title={member.isMuted ? 'Unmute member' : 'Mute member'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {member.isMuted ? 'volume_off' : 'mic'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onShowToast(`Options for ${member.name}`)}
                        className="p-1.5 rounded-full text-[#787586] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Connected Workspace Drives */}
        <section className="flex flex-col gap-2">
          <h3 className="font-tech text-[12px] font-bold text-[#131b2e] tracking-wider uppercase">
            Connected Workspace Drives
          </h3>

          <div className="bg-white rounded-2xl shadow-xs border border-[#eaedff] overflow-hidden flex flex-col divide-y divide-[#eaedff]">
            {/* Drive Item */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#5341cd] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">folder_shared</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] truncate">
                    Google Workspace Sync
                  </div>
                  <p className="text-[11px] text-[#787586] font-tech truncate mt-0.5">
                    Synced to 'Campus-Decarb-2024' (14.2 GB)
                  </p>
                </div>
              </div>
              <span className="font-tech text-[11px] px-2 py-0.5 rounded-md bg-[#e2e7ff] text-[#131b2e] font-bold shrink-0">
                Active
              </span>
            </div>

            {/* Collaborative Canvas */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#b05a03] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">draw</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] truncate">
                    Collaborative Canvas
                  </div>
                  <p className="text-[11px] text-[#787586] font-tech truncate mt-0.5">
                    Realtime infinite canvas · All members edit
                  </p>
                </div>
              </div>
              <span className="font-tech text-[11px] px-2 py-0.5 rounded-md bg-[#e2e7ff] text-[#131b2e] font-bold shrink-0">
                Active
              </span>
            </div>

            {/* Auto-archive */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#a83639] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">video_library</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#131b2e] truncate">
                    Auto-Archive Study Sessions
                  </div>
                  <p className="text-[11px] text-[#787586] font-tech truncate mt-0.5">
                    Store recordings for 90 days
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoArchive}
                onClick={() => {
                  setAutoArchive(!autoArchive);
                  onShowToast(!autoArchive ? 'Auto-archive enabled' : 'Auto-archive disabled');
                }}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                  autoArchive ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    autoArchive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Danger Zone */}
        <section className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#93000a]">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <h3 className="font-tech text-[12px] font-bold uppercase tracking-wider">
              Danger Zone
            </h3>
          </div>
          <p className="text-[12px] text-[#474554] leading-relaxed">
            Administrative controls can irreversibly alter group membership, storage logs, and academic attribution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => onShowToast('Transfer Syndicate Leadership prompted to owner email')}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-[#131b2e] font-tech text-[12px] font-bold hover:bg-[#f2f3ff] flex items-center justify-center gap-2 shadow-xs transition-colors border border-gray-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">swap_horiz</span>
              <span>Transfer Ownership</span>
            </button>
            <button
              type="button"
              onClick={() => onShowToast('Syndicate archived and locked from edits')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#a83639] text-white font-tech text-[12px] font-bold hover:bg-[#881d24] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">archive</span>
              <span>Archive Forum</span>
            </button>
          </div>
        </section>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#dae2fd] flex flex-col items-center text-center">
            <div className="w-12 h-1 bg-[#dae2fd] rounded-full mb-3" />
            <h3 className="font-bold text-[18px] text-[#131b2e]">Campus Syndicate QR</h3>
            <p className="text-[12px] text-[#474554] mt-1 mb-4">
              Hold camera up to join 'Carbon Blueprints' as <span className="font-bold text-[#5341cd]">{inviteRole}</span>.
            </p>

            <div className="w-48 h-48 bg-[#f2f3ff] rounded-2xl p-4 flex items-center justify-center border border-[#eaedff]">
              <svg className="w-full h-full text-[#131b2e] fill-current" viewBox="0 0 100 100">
                <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="16" width="12" height="12" rx="1" />
                <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="72" y="16" width="12" height="12" rx="1" />
                <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="72" width="12" height="12" rx="1" />
                <rect x="42" y="12" width="6" height="6" rx="1" />
                <rect x="52" y="12" width="6" height="18" rx="1" />
                <rect x="42" y="42" width="16" height="16" rx="2" className="text-[#5341cd] fill-current" />
                <rect x="12" y="42" width="10" height="6" rx="1" />
                <rect x="66" y="42" width="12" height="6" rx="1" />
                <rect x="66" y="56" width="6" height="18" rx="1" />
                <rect x="76" y="64" width="14" height="6" rx="1" />
                <rect x="42" y="66" width="16" height="6" rx="1" />
                <rect x="52" y="78" width="6" height="12" rx="1" />
              </svg>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[#787586] font-tech text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-[#b05a03]">timer</span>
              <span>Valid for 48 hours · Single-device secure scan</span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#5341cd] text-white font-tech text-[12px] font-bold hover:bg-[#6c5ce7] transition-all cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
