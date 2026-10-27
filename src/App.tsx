/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, FeedPost, RoomHub, LiveStage, ExpertProfile } from './types';
import {
  MOCK_FEED_POSTS,
  MOCK_STORIES,
  MOCK_ROOM_HUBS,
  MOCK_LIVE_STAGES,
  MOCK_SOLUTION_NODES,
  MOCK_UPCOMING_AMA,
  MOCK_EXPERTS,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomNav } from './components/BottomNav';

import { FeedView } from './views/FeedView';
import { RoomsView } from './views/RoomsView';
import { GroupSettingsView } from './views/GroupSettingsView';
import { LiveView } from './views/LiveView';
import { PeopleView } from './views/PeopleView';
import { ChatView } from './views/ChatView';
import { ProfileView } from './views/ProfileView';
import { StudentHubView } from './views/StudentHubView';

import { StoryViewerModal } from './components/StoryViewerModal';
import { LiveStageModal } from './components/LiveStageModal';
import { CreateSparkModal } from './components/CreateSparkModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { PeerCallModal } from './components/PeerCallModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [subView, setSubView] = useState<string | undefined>(undefined);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // App Data State
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_FEED_POSTS);
  const [rooms, setRooms] = useState<RoomHub[]>(MOCK_ROOM_HUBS);
  const [notificationCount, setNotificationCount] = useState(3);

  // Modals & Overlays State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeLiveStage, setActiveLiveStage] = useState<LiveStage | null>(null);
  const [isCreateSparkOpen, setIsCreateSparkOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ isVideo: boolean; peerName: string; peerAvatar: string } | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNavigate = (tab: TabType, newSubView?: string) => {
    setCurrentTab(tab);
    setSubView(newSubView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (subView === 'group-settings') {
      setSubView(undefined);
      setCurrentTab('rooms');
    } else if (subView === 'direct-chat') {
      setSubView(undefined);
      setCurrentTab('chat');
    } else if (currentTab === 'profile') {
      setCurrentTab('feed');
    } else {
      setSubView(undefined);
    }
  };

  const handleOpenDirectChat = (expert: ExpertProfile) => {
    setCurrentTab('chat');
    setSubView('direct-chat');
    showToast(`Opened direct research conversation with ${expert.name}`);
  };

  return (
    <div className="min-h-screen bg-academic-canvas text-[#0f172a] flex flex-col antialiased selection:bg-[#5341cd]/20">
      {/* Top Fixed Header with Mobile Menu Trigger */}
      <Header
        currentTab={currentTab}
        subView={subView}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setNotificationCount(0);
        }}
        notificationCount={notificationCount}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main 3-Column Instagram/Facebook-Style Layout Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex pt-16">
        {/* Left Sidebar: Fixed on desktop, Drawer on mobile */}
        <Sidebar
          currentTab={currentTab}
          subView={subView}
          onSelectTab={handleNavigate}
          onOpenCreateModal={() => setIsCreateSparkOpen(true)}
          onOpenCreateRoomModal={() => setIsCreateRoomOpen(true)}
          onOpenNotifications={() => {
            setIsNotificationsOpen(true);
            setNotificationCount(0);
          }}
          notificationCount={notificationCount}
          unreadChatCount={2}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          onOpenDirectChatSofia={() => {
            handleOpenDirectChat(MOCK_EXPERTS[1]);
          }}
          onSelectCategoryFilter={(cat) => {
            handleNavigate('rooms');
            showToast(`Filter applied: ${cat === 'eco' ? 'Environment' : cat === 'frontier' ? 'Frontier Science' : 'Living & Health'}`);
          }}
        />

        {/* Center Feed / View Canvas */}
        <main className="flex-1 min-w-0 max-w-2xl mx-auto px-1 sm:px-3">
          {/* VIEW 1: GROUP SETTINGS & PERMISSIONS */}
          {subView === 'group-settings' && (
            <GroupSettingsView onBack={handleBack} onShowToast={showToast} />
          )}

          {/* TAB 1: FEED VIEW */}
          {!subView && currentTab === 'feed' && (
            <FeedView
              posts={posts}
              stories={MOCK_STORIES}
              onOpenStory={(index) => setActiveStoryIndex(index)}
              onOpenCreateModal={() => setIsCreateSparkOpen(true)}
              onOpenStage={(stage) => setActiveLiveStage(stage)}
              onNavigateToRoom={() => {
                setCurrentTab('rooms');
                setSubView('group-settings');
              }}
              onShowToast={showToast}
            />
          )}

          {/* TAB: STUDENT ACADEMY & INTEREST HUB */}
          {!subView && currentTab === 'academy' && (
            <StudentHubView
              onShowToast={showToast}
              onNavigateToRoom={() => {
                handleNavigate('rooms');
              }}
              onOpenDirectChatWith={(expert) => {
                handleOpenDirectChat(expert);
              }}
            />
          )}

          {/* TAB 2: ROOMS VIEW */}
          {!subView && currentTab === 'rooms' && (
            <RoomsView
              rooms={rooms}
              onOpenCreateRoomModal={() => setIsCreateRoomOpen(true)}
              onNavigateToGroupSettings={() => {
                setSubView('group-settings');
              }}
              onShowToast={showToast}
            />
          )}

          {/* TAB 3: LIVE & EVENTS VIEW */}
          {!subView && currentTab === 'live' && (
            <LiveView
              stages={MOCK_LIVE_STAGES}
              solutions={MOCK_SOLUTION_NODES}
              upcomingAMA={MOCK_UPCOMING_AMA}
              onJoinStage={(stage) => setActiveLiveStage(stage)}
              onShowToast={showToast}
            />
          )}

          {/* TAB 4: PEOPLE & EXPERTS VIEW */}
          {!subView && currentTab === 'people' && (
            <PeopleView
              experts={MOCK_EXPERTS}
              onOpenDirectChatWith={handleOpenDirectChat}
              onShowToast={showToast}
            />
          )}

          {/* TAB 5: CHAT & DIRECT MESSENGER */}
          {currentTab === 'chat' && subView !== 'group-settings' && (
            <ChatView
              subView={subView}
              onSetSubView={setSubView}
              onOpenCall={(isVideo) => {
                setActiveCall({
                  isVideo,
                  peerName: 'Sofia Chen',
                  peerAvatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuACSXuGakkOPwicLhzwgL0UuQ7aGy_rc5o5Og9ZXbwzPkYvc9zg79jHw9R31PuQWPC7Yt53X0aG5fK92NIO-PzSmI1V-NPy7kY14VdTaFXRgjUImf7M_LwbYPo5M9w_L1HHCGgsqiR4xF-GVr7JUBYtvq264Nqz1iQWrq45r2zrq0YQvUaLzv_oepfJCtb4sdM1n3boxS9e9e_Xssmv1A-Rgdimpi4-B-0F8b7_e37TQbPgk8DJfRXv',
                });
              }}
              onNavigateToGroupSettings={() => {
                setCurrentTab('rooms');
                setSubView('group-settings');
              }}
              onShowToast={showToast}
            />
          )}

          {/* TAB 6: PROFILE VIEW (Achievements, Online Friends & Recommendations) */}
          {currentTab === 'profile' && !subView && (
            <ProfileView
              onOpenDirectChatWith={handleOpenDirectChat}
              onNavigateToRoom={() => {
                handleNavigate('rooms');
              }}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Right Sidebar: Trending, Live stages spotlight, AMA widget, Suggested scholars */}
        <RightSidebar
          stages={MOCK_LIVE_STAGES}
          upcomingAMA={MOCK_UPCOMING_AMA}
          experts={MOCK_EXPERTS}
          onJoinStage={(stage) => setActiveLiveStage(stage)}
          onOpenDirectChat={handleOpenDirectChat}
          onShowToast={showToast}
        />
      </div>

      {/* Mobile-Only Bottom Navigation Rail */}
      <div className="md:hidden">
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => handleNavigate(tab)}
          unreadChatCount={2}
        />
      </div>

      {/* MODALS & OVERLAYS */}
      {/* 1. Fullscreen Story Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={MOCK_STORIES}
          initialIndex={activeStoryIndex}
          isOpen={activeStoryIndex !== null}
          onClose={() => setActiveStoryIndex(null)}
          onSendReply={(text, storyTitle) => {
            showToast(`Reply sent for '${storyTitle}': "${text}"`);
            setActiveStoryIndex(null);
          }}
        />
      )}

      {/* 2. Interactive Live Stage Room */}
      {activeLiveStage !== null && (
        <LiveStageModal
          stage={activeLiveStage}
          isOpen={activeLiveStage !== null}
          onClose={() => setActiveLiveStage(null)}
        />
      )}

      {/* 3. Create Spark Discovery Modal */}
      {isCreateSparkOpen && (
        <CreateSparkModal
          isOpen={isCreateSparkOpen}
          onClose={() => setIsCreateSparkOpen(false)}
          onPostCreated={(newPost) => {
            setPosts((prev) => [newPost, ...prev]);
            showToast('New Spark Discovery published to the network!');
          }}
        />
      )}

      {/* 4. Create Community Room Modal */}
      {isCreateRoomOpen && (
        <CreateRoomModal
          isOpen={isCreateRoomOpen}
          onClose={() => setIsCreateRoomOpen(false)}
          onRoomCreated={(newRoom) => {
            setRooms((prev) => [newRoom, ...prev]);
            showToast(`Community Hub '${newRoom.title}' initialized!`);
          }}
        />
      )}

      {/* 5. Notifications Drawer */}
      {isNotificationsOpen && (
        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onSelectAction={(actionType) => {
            if (actionType === 'live') {
              setCurrentTab('live');
              setActiveLiveStage(MOCK_LIVE_STAGES[0]);
            } else if (actionType === 'direct-chat') {
              setCurrentTab('chat');
              setSubView('direct-chat');
            } else if (actionType === 'people') {
              setCurrentTab('people');
            }
          }}
        />
      )}

      {/* 6. Peer Audio/Video Call Overlay */}
      {activeCall && (
        <PeerCallModal
          isOpen={activeCall !== null}
          onClose={() => setActiveCall(null)}
          peerName={activeCall.peerName}
          peerAvatar={activeCall.peerAvatar}
          isVideo={activeCall.isVideo}
        />
      )}

      {/* Floating Micro-Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 text-[12px] font-tech animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[17px] text-[#00b894]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
