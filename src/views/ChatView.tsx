import React, { useState } from 'react';
import { ConversationThread, ChatMessage, ExpertProfile } from '../types';
import { MOCK_CONVERSATIONS, MOCK_SOFIA_MESSAGES, CURRENT_USER } from '../data/mockData';

interface ChatViewProps {
  initialThreadId?: string;
  onOpenCall: (isVideo: boolean) => void;
  onNavigateToGroupSettings: () => void;
  onShowToast: (message: string) => void;
  subView?: string;
  onSetSubView?: (subView?: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialThreadId,
  onOpenCall,
  onNavigateToGroupSettings,
  onShowToast,
  subView,
  onSetSubView,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    subView === 'direct-chat' ? 'conv-1' : initialThreadId || null
  );

  // Direct chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_SOFIA_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isBookmarkedProfile, setIsBookmarkedProfile] = useState(false);

  // Inline "Create Room & Syndicate" widget state (Image 16)
  const [showCreateWidget, setShowCreateWidget] = useState(true);
  const [widgetRoomName, setWidgetRoomName] = useState('');
  const [widgetAccessType, setWidgetAccessType] = useState<'public' | 'private'>('public');
  const [allowMemberInvites, setAllowMemberInvites] = useState(true);
  const [autoExpires, setAutoExpires] = useState(true);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderAvatar: CURRENT_USER.avatar,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      text: inputMsg,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulated reply from Sofia after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          senderId: 'sofia',
          senderName: 'Sofia',
          senderAvatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuACSXuGakkOPwicLhzwgL0UuQ7aGy_rc5o5Og9ZXbwzPkYvc9zg79jHw9R31PuQWPC7Yt53X0aG5fK92NIO-PzSmI1V-NPy7kY14VdTaFXRgjUImf7M_LwbYPo5M9w_L1HHCGgsqiR4xF-GVr7JUBYtvq264Nqz1iQWrq45r2zrq0YQvUaLzv_oepfJCtb4sdM1n3boxS9e9e_Xssmv1A-Rgdimpi4-B-0F8b7_e37TQbPgk8DJfRXv',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          text: 'Great point! Let’s test that during tomorrow’s sprint at the lab.',
          status: 'read',
        },
      ]);
    }, 1500);
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    onSetSubView?.('direct-chat');
  };

  const handleBackToInbox = () => {
    setActiveThreadId(null);
    onSetSubView?.(undefined);
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter((c) => {
    if (activeTab === 'direct') return !c.isGroup;
    if (activeTab === 'groups') return c.isGroup;
    return true;
  });

  // VIEW 1: DIRECT CHAT WITH SOFIA CHEN (Image 18 & 19)
  if (activeThreadId || subView === 'direct-chat') {
    return (
      <div className="flex flex-col w-full pb-20">
        {/* Direct Chat Top Sub-Header & Actions */}
        <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md px-4 py-2 border-b border-[#eaedff] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToInbox}
              className="p-1 rounded-full hover:bg-[#f2f3ff] text-[#474554] cursor-pointer"
              title="Back to inbox"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACSXuGakkOPwicLhzwgL0UuQ7aGy_rc5o5Og9ZXbwzPkYvc9zg79jHw9R31PuQWPC7Yt53X0aG5fK92NIO-PzSmI1V-NPy7kY14VdTaFXRgjUImf7M_LwbYPo5M9w_L1HHCGgsqiR4xF-GVr7JUBYtvq264Nqz1iQWrq45r2zrq0YQvUaLzv_oepfJCtb4sdM1n3boxS9e9e_Xssmv1A-Rgdimpi4-B-0F8b7_e37TQbPgk8DJfRXv"
                alt="Sofia Chen"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#5341cd]/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[14px] text-[#131b2e]">Sofia Chen</span>
                <span className="material-symbols-outlined text-emerald-600 text-[15px]">school</span>
              </div>
              <span className="text-[11px] text-[#787586] font-tech leading-none">
                NUS '26 • Active in #EcoFriendly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#474554]">
            <button
              onClick={() => onOpenCall(false)}
              className="p-2 rounded-full hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-colors cursor-pointer"
              title="Start Audio Call"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </button>
            <button
              onClick={() => onOpenCall(true)}
              className="p-2 rounded-full hover:bg-[#f2f3ff] hover:text-[#5341cd] transition-colors cursor-pointer"
              title="Start Video Stage Call"
            >
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </button>
            <button
              onClick={() => onShowToast('Thread options for Sofia Chen')}
              className="p-2 rounded-full hover:bg-[#f2f3ff] text-[#787586] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-4">
          {/* Shared Context Ribbon */}
          <div className="bg-[#f2f3ff] p-2.5 rounded-2xl flex items-center justify-between text-[12px] font-tech border border-[#eaedff]">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[#5341cd] text-[18px]">group_work</span>
              <span className="text-[#131b2e] font-semibold truncate">
                #EcoFriendly Living • Study Room
              </span>
            </div>
            <span className="text-[#787586] shrink-0 font-medium">14 mutuals</span>
          </div>

          {/* Quick Peer Glance Card */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#5341cd] text-[20px]">science</span>
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-[#131b2e]">Hall 6 Bio-Sensor Syndicate</span>
                <span className="text-[11px] text-[#787586] font-tech">Verified peer research syndicate</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsBookmarkedProfile(!isBookmarkedProfile);
                onShowToast(!isBookmarkedProfile ? 'Saved Sofia to your core peer syndicate' : 'Removed from saved peers');
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarkedProfile ? 'text-[#5341cd]' : 'text-[#787586]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isBookmarkedProfile ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex flex-col space-y-3 pt-1">
            {messages.map((msg) => {
              if (msg.isMe) {
                return (
                  <div key={msg.id} className="flex flex-col items-end gap-1">
                    <div className="max-w-[85%] bg-[#5341cd] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-[13px] leading-relaxed">
                      {msg.text}

                      {/* Outbound Link Card */}
                      {msg.linkCard && (
                        <div className="mt-2.5 p-2.5 bg-white/10 rounded-xl border border-white/20 text-white flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px] font-tech text-[#c6bfff]">
                            <span>{msg.linkCard.tag}</span>
                            <span>{msg.linkCard.version}</span>
                          </div>
                          <span className="font-bold text-[13px] leading-snug">{msg.linkCard.title}</span>
                          <span className="text-[11px] text-white/80">{msg.linkCard.description}</span>
                          <div className="flex items-center gap-1 text-[11px] text-white font-tech font-bold mt-1">
                            <span>Open Access Draft</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#787586] font-tech pr-1">
                      <span>{msg.timestamp}</span>
                      <span className="material-symbols-outlined text-[13px] text-[#5341cd]">done_all</span>
                    </div>
                  </div>
                );
              }

              // Inbound Message from Sofia
              return (
                <div key={msg.id} className="flex flex-col items-start gap-1">
                  <div className="flex items-start gap-2 max-w-[88%]">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="bg-white border border-[#eaedff] text-[#131b2e] p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-[13px] leading-relaxed">
                        {msg.text && <p>{msg.text}</p>}

                        {/* Shared Room Note Attachment */}
                        {msg.noteAttachment && (
                          <div className="mt-2 rounded-xl overflow-hidden bg-[#f2f3ff] border border-[#eaedff]">
                            <img
                              src={msg.noteAttachment.imageUrl}
                              alt="Note"
                              className="w-full h-28 object-cover"
                            />
                            <div className="p-2.5 flex flex-col gap-1">
                              <span className="text-[10px] font-tech text-[#5341cd] font-bold uppercase">
                                {msg.noteAttachment.tag}
                              </span>
                              <h4 className="font-bold text-[13px] text-[#131b2e] leading-snug">
                                {msg.noteAttachment.title}
                              </h4>
                              <span className="text-[11px] text-[#787586] font-tech">
                                {msg.noteAttachment.subtitle}
                              </span>

                              <div className="pt-2 flex items-center justify-between border-t border-[#eaedff] text-[11px] font-tech text-[#787586]">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                                  {msg.noteAttachment.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">forum</span>
                                  {msg.noteAttachment.replies}
                                </span>
                                <span className="text-[#5341cd] font-bold hover:underline cursor-pointer">
                                  View in Room
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Voice Memo Player */}
                        {msg.voiceMemo && (
                          <div className="mt-1 flex items-center gap-2.5 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#eaedff]">
                            <button
                              type="button"
                              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                              className="w-9 h-9 rounded-full bg-[#5341cd] text-white flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {isPlayingVoice ? 'pause' : 'play_arrow'}
                              </span>
                            </button>

                            {/* Animated waveform bars */}
                            <div className="flex-1 flex items-center gap-0.5 h-6">
                              {[8, 14, 20, 10, 16, 22, 12, 18, 24, 14, 8, 12, 16, 10, 6].map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    className={`w-1 rounded-full transition-all ${
                                      isPlayingVoice
                                        ? 'bg-[#5341cd] animate-pulse'
                                        : 'bg-[#dae2fd]'
                                    }`}
                                    style={{ height: `${h}px` }}
                                  />
                                )
                              )}
                            </div>

                            <span className="text-[11px] font-tech text-[#787586] shrink-0 font-bold">
                              {msg.voiceMemo.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-[#787586] font-tech pl-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            <div className="flex items-center gap-2 text-[#787586] font-tech text-[11px] pl-9">
              <div className="flex items-center gap-1 bg-[#eaedff] px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#5341cd] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#5341cd] rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#5341cd] rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
              <span>Sofia is typing research notes...</span>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md px-4 py-1.5 border-t border-[#eaedff] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { label: 'Share Room Note 📎', text: 'I just uploaded our second soil microbial chart to the study room!' },
            { label: 'Invite to Voice Lounge 🎙️', text: 'Are you free to hop onto the Hall 6 Voice Lounge for 5 mins?' },
            { label: 'Send Code / Data 📊', text: 'Here is the CSV data telemetry from the aeroponics chamber:' },
            { label: 'Meetup in Hall 6 📍', text: 'Let’s sync at Hall 6 Maker Bench at 3 PM!' },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputMsg(chip.text)}
              className="shrink-0 px-3 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-tech text-[11px] font-semibold border border-[#eaedff] cursor-pointer transition-all active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Composer Input */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#eaedff] p-2.5">
          <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onShowToast('Media & file attachment selector opened')}
              className="p-2 rounded-full text-[#787586] hover:text-[#5341cd] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              title="Add attachment"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </button>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message to Sofia Chen..."
              className="flex-1 bg-[#f2f3ff] rounded-full px-4 py-2 text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none focus:ring-1 focus:ring-[#5341cd]"
            />
            <button
              type="button"
              onClick={() => onShowToast('Voice memo recording started... (Hold to record)')}
              className="p-2 rounded-full text-[#787586] hover:text-[#5341cd] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
              title="Voice recording"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#5341cd] text-white flex items-center justify-center shrink-0 hover:bg-[#6c5ce7] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // VIEW 2: MESSENGER INBOX / LIST (Image 16)
  return (
    <div className="flex flex-col w-full pb-24">
      <div className="flex flex-col w-full px-4 pt-3 pb-8 space-y-4">
        {/* Filter Chips Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Chats' },
              { id: 'direct', label: 'Direct 1:1' },
              { id: 'groups', label: 'Study Groups & Rooms' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id as any)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-tech text-[12px] font-bold transition-all cursor-pointer ${
                  activeTab === f.id
                    ? 'bg-[#5341cd] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#474554] hover:bg-[#dae2fd]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onShowToast('New conversation recipient picker')}
            className="py-2.5 px-3 rounded-2xl bg-[#5341cd] text-white font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-[#6c5ce7] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Chat / Room</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText('https://sparknet.edu/join?invite=SPK-9042');
              onShowToast('Direct invite link copied to clipboard!');
            }}
            className="py-2.5 px-3 rounded-2xl bg-[#eaedff] text-[#5341cd] hover:bg-[#dae2fd] font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>Invite via Link / QR</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex flex-col space-y-3">
          {filteredConversations.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleSelectThread(thread.id)}
              className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaedff] hover:shadow-md transition-shadow flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/5"
                  />
                  {thread.isGroup && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#5341cd] text-white rounded-full flex items-center justify-center text-[9px]">
                      <span className="material-symbols-outlined text-[10px]">lock</span>
                    </span>
                  )}
                  {thread.isExpert && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] text-[#131b2e] truncate">
                      {thread.name}
                    </span>
                    {thread.isExpert && (
                      <span className="bg-[#e4dfff] text-[#160066] font-tech text-[9px] px-1.5 py-0.2 rounded font-bold">
                        Expert
                      </span>
                    )}
                    {thread.isPinned && (
                      <span className="material-symbols-outlined text-[#b05a03] text-[15px]">push_pin</span>
                    )}
                  </div>

                  <p className="text-[12px] text-[#474554] truncate mt-0.5">
                    {thread.lastMessage}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {thread.groupMeta && (
                      <span className="text-[10px] font-tech text-[#5341cd] bg-[#f2f3ff] px-2 py-0.2 rounded-full font-bold">
                        {thread.groupMeta.code}
                      </span>
                    )}
                    {thread.activeNowCount && (
                      <span className="text-[10px] font-tech text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {thread.activeNowCount} talking now
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className="text-[11px] text-[#787586] font-tech">{thread.lastTimestamp}</span>
                {thread.unreadCount > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-[#5341cd] text-white font-tech text-[10px] font-bold flex items-center justify-center">
                    {thread.unreadCount}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px] text-emerald-500">done_all</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Inline "Create Room & Syndicate" Widget (Image 16) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#5341cd]/10 text-[#5341cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">group_add</span>
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#131b2e] leading-snug">
                  Create Room & Syndicate
                </h3>
                <p className="text-[11px] text-[#787586] font-tech">Collaborate with peers instantly</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateWidget(!showCreateWidget)}
              className="text-[#787586] hover:text-[#131b2e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showCreateWidget ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {showCreateWidget && (
            <div className="flex flex-col gap-3 pt-1">
              {/* Public vs Private toggle */}
              <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setWidgetAccessType('public')}
                  className={`py-2 px-3 rounded-xl font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    widgetAccessType === 'public'
                      ? 'bg-white text-[#5341cd] shadow-xs'
                      : 'text-[#474554]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">public</span>
                  <span>Public Forum</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWidgetAccessType('private')}
                  className={`py-2 px-3 rounded-xl font-tech text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    widgetAccessType === 'private'
                      ? 'bg-white text-[#5341cd] shadow-xs'
                      : 'text-[#474554]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Private Syndicate</span>
                </button>
              </div>

              {/* Room Name Input */}
              <div>
                <label className="font-tech text-[10px] text-[#787586] uppercase tracking-wider block mb-1 font-bold">
                  Room Name
                </label>
                <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff]">
                  <span className="text-[#787586] font-tech text-[14px] mr-1.5">#</span>
                  <input
                    type="text"
                    value={widgetRoomName}
                    onChange={(e) => setWidgetRoomName(e.target.value)}
                    placeholder="e.g. Quantum Algorithms Sprint"
                    className="w-full bg-transparent text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tag / Invite Members */}
              <div>
                <label className="font-tech text-[10px] text-[#787586] uppercase tracking-wider block mb-1 font-bold">
                  Invite & Tag Members
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#5341cd] font-tech text-[11px] font-bold flex items-center gap-1">
                    @sofia_eco
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#5341cd] font-tech text-[11px] font-bold flex items-center gap-1">
                    @marcus_v
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#5341cd] font-tech text-[11px] font-bold flex items-center gap-1">
                    @elena.r
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </span>
                </div>
                <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-2 border border-[#eaedff]">
                  <span className="material-symbols-outlined text-[#787586] text-[18px] mr-1.5">alternate_email</span>
                  <input
                    type="text"
                    placeholder="Type handle and press Enter..."
                    className="w-full bg-transparent text-[13px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none"
                  />
                </div>
              </div>

              {/* Shareable Invite Link */}
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between text-[12px] font-tech">
                <span className="truncate text-[#474554]">spark.edu/join/group-8842</span>
                <button
                  type="button"
                  onClick={() => onShowToast('Invite link copied!')}
                  className="px-2.5 py-1 rounded-lg bg-[#5341cd] text-white font-bold cursor-pointer text-[11px]"
                >
                  Copy
                </button>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#474554]">Auto-expires in 48 hours</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoExpires}
                  onClick={() => setAutoExpires(!autoExpires)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                    autoExpires ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      autoExpires ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#474554]">Allow Member Invites</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={allowMemberInvites}
                  onClick={() => setAllowMemberInvites(!allowMemberInvites)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0 p-0.5 cursor-pointer ${
                    allowMemberInvites ? 'bg-[#5341cd]' : 'bg-[#dae2fd]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                      allowMemberInvites ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onShowToast(`Syndicate '${widgetRoomName || 'Quantum Algorithms'}' launched!`);
                  setWidgetRoomName('');
                }}
                className="w-full py-3 rounded-2xl bg-[#5341cd] text-white font-tech text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-[#6c5ce7] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                <span>Launch Room & Notify Syndicate</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick broadcast bar at bottom of Inbox */}
        <div className="p-3 bg-white rounded-2xl border border-[#eaedff] flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-tech">
            <span className="text-[#5341cd] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Quick broadcast to active syndicate
            </span>
            <div className="flex items-center gap-1 text-[#787586]">
              <span className="hover:text-[#5341cd] cursor-pointer">@ tag someone</span>
              <span>•</span>
              <span className="hover:text-[#5341cd] cursor-pointer">Share Link</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Send an insight, ask a question, or drop research notes..."
              className="flex-1 bg-[#f2f3ff] rounded-xl px-3 py-2 text-[12px] text-[#131b2e] placeholder:text-[#787586] focus:outline-none"
            />
            <button
              onClick={() => onShowToast('Broadcast dispatched to syndicate feed!')}
              className="w-8 h-8 rounded-xl bg-[#5341cd] text-white flex items-center justify-center shrink-0 hover:bg-[#6c5ce7] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
