export type TabType = 'feed' | 'rooms' | 'live' | 'people' | 'chat' | 'profile' | 'academy';

export interface Story {
  id: string;
  title: string;
  author: string;
  avatar: string;
  imageUrl: string;
  tag: string;
  timeAgo: string;
  caption?: string;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    flag: string;
    affiliation: string;
    tag: string;
    isVerified?: boolean;
    isExpert?: boolean;
  };
  timeAgo: string;
  content: string;
  postType: 'video' | 'carousel' | 'poll' | 'photo';
  videoPreview?: {
    thumbnailUrl: string;
    duration: string;
    badge: string;
    badgeColor?: string;
    liveChannelNotice?: string;
    roomBanner?: {
      title: string;
      subtitle: string;
      roomCode?: string;
    };
  };
  carouselSlides?: {
    imageUrl: string;
    title: string;
    icon: string;
  }[];
  paperAttachment?: {
    title: string;
    meta: string;
    url: string;
  };
  pollData?: {
    question: string;
    subtitle: string;
    options: {
      id: string;
      label: string;
      letter: string;
      percent: number;
    }[];
    totalVotes: number;
    whitepaperUrl?: string;
    expiryText?: string;
  };
  photoData?: {
    imageUrl: string;
    badge?: string;
    efficiencyBadge?: string;
    tags: string[];
    paperUrl?: string;
    codeForkable?: boolean;
  };
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  commentsList?: PostComment[];
}

export interface RoomHub {
  id: string;
  title: string;
  category: 'eco' | 'frontier' | 'living';
  categoryLabel: string;
  description: string;
  bannerUrl?: string;
  icon?: string;
  iconBg?: string;
  membersCount: string;
  activityText: string;
  activeChatters?: number;
  isVerified?: boolean;
  isJoined?: boolean;
  disclaimer?: {
    type: 'warning' | 'info';
    text: string;
  };
  badge?: string;
  badgeColor?: string;
  tags?: string[];
  isPrivate?: boolean;
  adminRole?: 'ADMIN' | 'CREATOR' | 'MEMBER';
  friendsInRoom?: string[];
}

export interface SyndicateMember {
  id: string;
  name: string;
  handle: string;
  university: string;
  avatar: string;
  role: 'Admin' | 'Contributor' | 'View-Only';
  isOwner?: boolean;
  isMuted?: boolean;
  isOnline?: boolean;
}

export interface LiveStage {
  id: string;
  title: string;
  speaker: {
    name: string;
    title: string;
    avatar: string;
    isVerified: boolean;
  };
  coHosts?: string[];
  bannerUrl: string;
  viewersCount: number;
  isLive: boolean;
  tags: string[];
  type: 'video' | 'audio';
  description?: string;
  handsRaised?: number;
}

export interface SolutionNode {
  id: string;
  author: {
    name: string;
    avatar: string;
    flag: string;
    university: string;
    track: string;
  };
  postedAgo: string;
  title: string;
  description: string;
  schematicUrl?: string;
  schematicTag?: string;
  tags: string[];
  upvotes: number;
  isUpvoted?: boolean;
  commentsCount: number;
  coCreatorsCount: number;
}

export interface UpcomingAMA {
  id: string;
  title: string;
  speaker: {
    name: string;
    affiliation: string;
    avatar: string;
  };
  timeText: string;
  stageName: string;
  attendeesCount: number;
  isRsvpd: boolean;
  startsInHours: number;
  startsInMinutes: number;
  startsInSeconds: number;
}

export interface ExpertProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  countryFlag: string;
  roleTitle: string;
  affiliation: string;
  isExpert: boolean;
  isVerified: boolean;
  matchPercentage: number;
  mentorshipStatus?: string;
  interests: string[];
  sharedRoomsCount?: number;
  projectFocus?: string;
  isConnected?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isMe: boolean;
  text?: string;
  noteAttachment?: {
    title: string;
    subtitle: string;
    tag: string;
    labName: string;
    imageUrl: string;
    likes: number;
    replies: number;
  };
  voiceMemo?: {
    duration: string;
    title: string;
  };
  linkCard?: {
    url: string;
    title: string;
    description: string;
    version: string;
    tag: string;
  };
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationThread {
  id: string;
  name: string;
  handle?: string;
  avatar: string;
  isGroup: boolean;
  groupMeta?: {
    code: string;
    topic: string;
    isPrivate?: boolean;
  };
  isVerified?: boolean;
  isExpert?: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isPinned?: boolean;
  activeNowCount?: number;
  typingText?: string;
}

// User Profile Achievements & Badges
export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'research' | 'syndicate' | 'mentorship' | 'peer_review';
  icon: string;
  tier: 'Diamond' | 'Gold' | 'Silver' | 'Bronze';
  tierColor: string;
  dateEarned: string;
  rarityText: string;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
}

export interface OnlineFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  university: string;
  statusActivity: string;
  currentRoom?: string;
  isMuted?: boolean;
  mutualRooms: number;
}

export interface RecommendationItem {
  id: string;
  type: 'syndicate' | 'paper' | 'mentor';
  title: string;
  subtitle: string;
  matchScore: number;
  tags: string[];
  actionLabel: string;
  imageUrl?: string;
}
