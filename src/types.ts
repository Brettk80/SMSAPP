export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
};

export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  sender: string;
  senderPhone: string;
  status?: 'sent' | 'delivered' | 'read';
  contactId: string;
  mediaUrl?: string;
  mediaType?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  discordUsername: string;
  is2FAEnabled: boolean;
  phoneNumber: string; // E.164 format
  phoneVerified: boolean;
  telnyxApiKey?: string;
  messagingProfileId?: string;
  verificationCode?: string;
  verificationExpiry?: Date;
};

export type PhoneVerification = {
  userId: string;
  phoneNumber: string;
  verificationCode: string;
  attempts: number;
  expiresAt: Date;
  verified: boolean;
};