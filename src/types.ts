export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type UserRole = 'SENDER' | 'RECEIVER' | 'ADMIN';

export type AppTheme = 'slate' | 'emerald' | 'amber' | 'indigo' | 'light';

export interface SocialAccountInfo {
  handle: string;
  connected: boolean;
  verified: boolean;
  followersOrConnections?: string;
  profileUrl?: string;
}

export interface SocialProfiles {
  twitter?: SocialAccountInfo;
  linkedin?: SocialAccountInfo;
  instagram?: SocialAccountInfo;
  github?: SocialAccountInfo;
}

export interface PrivacySettings {
  obfuscateLocation: boolean; // ±500m fuzzy radius
  profileVisibility: 'EVERYONE' | 'MATCHED_ONLY';
  hideBalanceInMeetings: boolean;
  biometricHandoverLock: boolean;
  showSocialProfiles: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  profileImage: string;
  verified: boolean;
  senderRating: number;
  receiverRating: number;
  senderCompleted: number;
  receiverCompleted: number;
  senderSuccessRate: number; // e.g. 98.7%
  receiverSuccessRate: number; // e.g. 99.2%
  createdAt: string;
  availability: AvailabilityStatus;
  distanceKm: number; // simulated relative distance
  bio?: string;
  isSuspended?: boolean;
  upiId?: string; // e.g. devansh@cashconnect
  socialTrustScore?: number; // e.g. 4.9
  socialProfiles?: SocialProfiles;
  privacySettings?: PrivacySettings;
}

export type TransactionStatus =
  | 'CREATED'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'READY_FOR_MEETING'
  | 'OTP_VERIFICATION'
  | 'SETTLEMENT_PROCESSING'
  | 'CASH_CONFIRMATION'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'FAILED'
  | 'DISPUTED';

export interface Transaction {
  id: string; // e.g. TX-DEMO-10293
  senderId: string;
  receiverId: string;
  amount: number; // e.g. 2000
  serviceFee: number; // e.g. 20
  receiverCommission: number; // e.g. 10
  platformFee: number; // e.g. 10
  status: TransactionStatus;
  otp: string; // e.g. "482931"
  otpVerified: boolean;
  senderHandoverConfirmed: boolean;
  receiverHandoverConfirmed: boolean;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  meetingLocationNote?: string;
  timeline: {
    status: TransactionStatus;
    timestamp: string;
    note: string;
  }[];
}

export type LedgerEntryType =
  | 'OPENING_BALANCE'
  | 'SENDER_DEDUCTION'
  | 'RECEIVER_CREDIT'
  | 'RECEIVER_COMMISSION'
  | 'PLATFORM_FEE'
  | 'DEPOSIT_DEMO_FUNDS'
  | 'DEPOSIT_UPI'
  | 'REFUND';

export interface LedgerEntry {
  id: string;
  walletId: string;
  userId: string;
  transactionId?: string;
  type: LedgerEntryType;
  amount: number; // positive or negative
  description: string;
  balanceAfter: number;
  timestamp: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface Rating {
  id: string;
  transactionId: string;
  fromUserId: string;
  toUserId: string;
  role: 'SENDER_RATING' | 'RECEIVER_RATING'; // role of the user being rated
  rating: number; // 1 to 5
  review?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  transactionId?: string;
  type: 'REQUEST' | 'ACCEPTED' | 'OTP' | 'COMPLETED' | 'RATING' | 'COMMISSION' | 'DISPUTE';
}

export type DisputeReason =
  | 'Cash not received'
  | 'Incorrect cash amount'
  | 'Payment issue'
  | 'OTP issue'
  | 'User did not arrive'
  | 'Other';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';

export interface Dispute {
  id: string;
  transactionId: string;
  reportedBy: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminSettings {
  receiverCommissionPercent: number; // e.g. 50 (%)
  platformFeePercent: number; // e.g. 50 (%)
  baseServiceFeePercent: number; // e.g. 1 (%)
  minServiceFee: number; // e.g. 20 (₹)
}

export interface AppState {
  currentUserId: string;
  theme: AppTheme;
  users: Record<string, User>;
  wallets: Record<string, Wallet>;
  ledger: LedgerEntry[];
  transactions: Record<string, Transaction>;
  ratings: Rating[];
  notifications: NotificationItem[];
  disputes: Dispute[];
  adminSettings: AdminSettings;
}
