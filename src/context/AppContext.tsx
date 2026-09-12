import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppState,
  AppTheme,
  User,
  Wallet,
  LedgerEntry,
  Transaction,
  AvailabilityStatus,
  AdminSettings,
  DisputeReason,
  SocialAccountInfo,
  PrivacySettings,
} from '../types';
import { mockBackend } from '../services/mockBackend';

interface AppContextType {
  state: AppState;
  currentUser: User;
  currentWallet: Wallet;
  currentLedger: LedgerEntry[];
  activeTransaction: Transaction | null;
  unreadNotifsCount: number;

  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  isThemeSelectorOpen: boolean;
  setIsThemeSelectorOpen: (open: boolean) => void;

  // Navigation & Modals
  currentTab: 'home' | 'wallet' | 'transactions' | 'profile' | 'admin';
  setCurrentTab: (tab: 'home' | 'wallet' | 'transactions' | 'profile' | 'admin') => void;
  isSenderModalOpen: boolean;
  setIsSenderModalOpen: (open: boolean) => void;
  isReceiverModalOpen: boolean;
  setIsReceiverModalOpen: (open: boolean) => void;
  isAddFundsModalOpen: boolean;
  setIsAddFundsModalOpen: (open: boolean) => void;
  isReceiveQrOpen: boolean;
  setIsReceiveQrOpen: (open: boolean) => void;
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: (open: boolean) => void;
  isUpiTopUpOpen: boolean;
  setIsUpiTopUpOpen: (open: boolean) => void;
  isSocialTrustOpen: boolean;
  setIsSocialTrustOpen: (open: boolean) => void;
  isPrivacySettingsOpen: boolean;
  setIsPrivacySettingsOpen: (open: boolean) => void;
  isSafetyTipsOpen: boolean;
  setIsSafetyTipsOpen: (open: boolean) => void;
  isTermsPoliciesOpen: boolean;
  setIsTermsPoliciesOpen: (open: boolean) => void;
  termsPoliciesInitialTab: 'TERMS' | 'PRIVACY';
  setTermsPoliciesInitialTab: (tab: 'TERMS' | 'PRIVACY') => void;

  selectedTxId: string | null;
  setSelectedTxId: (id: string | null) => void;
  ratingTxId: string | null;
  setRatingTxId: (id: string | null) => void;
  disputeTxId: string | null;
  setDisputeTxId: (id: string | null) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isDualView: boolean;
  setIsDualView: (val: boolean) => void;

  // Actions
  switchUser: (userId: string) => void;
  updateAvailability: (status: AvailabilityStatus) => void;
  addDemoFunds: (amount: number) => { success: boolean; error?: string };
  addUpiFunds: (
    amount: number,
    upiId: string,
    appName: string
  ) => { success: boolean; refId?: string; error?: string };
  updateSocialProfile: (
    platform: 'twitter' | 'linkedin' | 'instagram' | 'github',
    info: Partial<SocialAccountInfo>
  ) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  createCashRequest: (
    receiverId: string,
    amount: number
  ) => { success: boolean; transaction?: Transaction; error?: string };
  acceptRequest: (txId: string) => { success: boolean; error?: string };
  declineRequest: (txId: string) => { success: boolean; error?: string };
  advanceToMeeting: (txId: string) => { success: boolean; error?: string };
  startOtpVerification: (txId: string) => { success: boolean; error?: string };
  verifyOtp: (txId: string, otp: string) => { success: boolean; error?: string };
  confirmCashHandover: (txId: string) => { success: boolean; error?: string };
  cancelRequest: (txId: string, reason?: string) => { success: boolean; error?: string };
  submitRating: (
    txId: string,
    rating: number,
    review?: string
  ) => { success: boolean; error?: string };
  fileDispute: (
    txId: string,
    reason: DisputeReason,
    desc: string
  ) => { success: boolean; error?: string };
  resolveDispute: (
    disputeId: string,
    notes: string,
    status: 'RESOLVED' | 'UNDER_REVIEW'
  ) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  toggleUserSuspension: (userId: string) => void;
  resetDemoData: () => void;
  runSection50Scenario: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(mockBackend.getState());
  const [currentTab, setCurrentTab] = useState<'home' | 'wallet' | 'transactions' | 'profile' | 'admin'>('home');
  const [isSenderModalOpen, setIsSenderModalOpen] = useState(false);
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isReceiveQrOpen, setIsReceiveQrOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isUpiTopUpOpen, setIsUpiTopUpOpen] = useState(false);
  const [isSocialTrustOpen, setIsSocialTrustOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [isSafetyTipsOpen, setIsSafetyTipsOpen] = useState(false);
  const [isTermsPoliciesOpen, setIsTermsPoliciesOpen] = useState(false);
  const [termsPoliciesInitialTab, setTermsPoliciesInitialTab] = useState<'TERMS' | 'PRIVACY'>('TERMS');
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [ratingTxId, setRatingTxId] = useState<string | null>(null);
  const [disputeTxId, setDisputeTxId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDualView, setIsDualView] = useState(false);

  useEffect(() => {
    const unsubscribe = mockBackend.subscribe(() => {
      setState({ ...mockBackend.getState() });
    });
    return unsubscribe;
  }, []);

  const currentUser = state.users[state.currentUserId] || state.users['user-devansh'];
  const currentWallet = state.wallets[state.currentUserId] || {
    id: `wallet-${state.currentUserId}`,
    userId: state.currentUserId,
    balance: 5000,
    updatedAt: new Date().toISOString(),
  };

  const currentLedger = state.ledger.filter((l) => l.userId === state.currentUserId);

  // Active transaction involving the current user (if in progress)
  const activeTransaction =
    (Object.values(state.transactions) as Transaction[]).find(
      (tx) =>
        (tx.senderId === state.currentUserId || tx.receiverId === state.currentUserId) &&
        tx.status !== 'COMPLETED' &&
        tx.status !== 'CANCELLED' &&
        tx.status !== 'DECLINED' &&
        tx.status !== 'FAILED'
    ) || null;

  const unreadNotifsCount = state.notifications.filter(
    (n) => n.userId === state.currentUserId && !n.read
  ).length;

  // Actions
  const switchUser = (userId: string) => {
    mockBackend.switchUser(userId);
  };

  const setTheme = (newTheme: AppTheme) => {
    mockBackend.setTheme(newTheme);
  };

  const updateAvailability = (status: AvailabilityStatus) => {
    mockBackend.updateAvailability(state.currentUserId, status);
  };

  const addDemoFunds = (amount: number) => {
    return mockBackend.addDemoFunds(state.currentUserId, amount);
  };

  const addUpiFunds = (amount: number, upiId: string, appName: string) => {
    return mockBackend.addUpiFunds(state.currentUserId, amount, upiId, appName);
  };

  const updateSocialProfile = (
    platform: 'twitter' | 'linkedin' | 'instagram' | 'github',
    info: Partial<SocialAccountInfo>
  ) => {
    mockBackend.updateSocialProfile(state.currentUserId, platform, info);
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    mockBackend.updatePrivacySettings(state.currentUserId, settings);
  };

  const createCashRequest = (receiverId: string, amount: number) => {
    return mockBackend.createCashRequest(state.currentUserId, receiverId, amount);
  };

  const acceptRequest = (txId: string) => {
    return mockBackend.acceptRequest(state.currentUserId, txId);
  };

  const declineRequest = (txId: string) => {
    return mockBackend.declineRequest(state.currentUserId, txId);
  };

  const advanceToMeeting = (txId: string) => {
    return mockBackend.advanceToMeeting(txId);
  };

  const startOtpVerification = (txId: string) => {
    return mockBackend.startOtpVerification(txId);
  };

  const verifyOtp = (txId: string, otp: string) => {
    return mockBackend.verifyOtp(txId, otp);
  };

  const confirmCashHandover = (txId: string) => {
    return mockBackend.confirmCashHandover(txId, state.currentUserId);
  };

  const cancelRequest = (txId: string, reason?: string) => {
    return mockBackend.cancelRequest(state.currentUserId, txId, reason);
  };

  const submitRating = (txId: string, rating: number, review?: string) => {
    return mockBackend.submitRating(state.currentUserId, txId, rating, review);
  };

  const fileDispute = (txId: string, reason: DisputeReason, desc: string) => {
    return mockBackend.fileDispute(state.currentUserId, txId, reason, desc);
  };

  const resolveDispute = (
    disputeId: string,
    notes: string,
    status: 'RESOLVED' | 'UNDER_REVIEW'
  ) => {
    mockBackend.resolveDispute(disputeId, notes, status);
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    mockBackend.updateAdminSettings(settings);
  };

  const toggleUserSuspension = (userId: string) => {
    mockBackend.toggleUserSuspension(userId);
  };

  const resetDemoData = () => {
    mockBackend.resetToDefault();
    setSelectedTxId(null);
    setRatingTxId(null);
    setDisputeTxId(null);
  };

  /**
   * Section 50 Guided Demo Scenario:
   * Devansh requests ₹2,000 cash from Amit Sharma.
   */
  const runSection50Scenario = () => {
    // Switch to Devansh
    mockBackend.switchUser('user-devansh');
    // Ensure Amit is available
    mockBackend.updateAvailability('user-amit', 'AVAILABLE');
    // Open Sender modal pre-filled with ₹2,000
    setIsSenderModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentUser,
        currentWallet,
        currentLedger,
        activeTransaction,
        unreadNotifsCount,
        theme: state.theme || 'slate',
        setTheme,
        isThemeSelectorOpen,
        setIsThemeSelectorOpen,
        currentTab,
        setCurrentTab,
        isSenderModalOpen,
        setIsSenderModalOpen,
        isReceiverModalOpen,
        setIsReceiverModalOpen,
        isAddFundsModalOpen,
        setIsAddFundsModalOpen,
        isReceiveQrOpen,
        setIsReceiveQrOpen,
        isQrScannerOpen,
        setIsQrScannerOpen,
        isUpiTopUpOpen,
        setIsUpiTopUpOpen,
        isSocialTrustOpen,
        setIsSocialTrustOpen,
        isPrivacySettingsOpen,
        setIsPrivacySettingsOpen,
        isSafetyTipsOpen,
        setIsSafetyTipsOpen,
        isTermsPoliciesOpen,
        setIsTermsPoliciesOpen,
        termsPoliciesInitialTab,
        setTermsPoliciesInitialTab,
        selectedTxId,
        setSelectedTxId,
        ratingTxId,
        setRatingTxId,
        disputeTxId,
        setDisputeTxId,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isDualView,
        setIsDualView,
        switchUser,
        updateAvailability,
        addDemoFunds,
        addUpiFunds,
        updateSocialProfile,
        updatePrivacySettings,
        createCashRequest,
        acceptRequest,
        declineRequest,
        advanceToMeeting,
        startOtpVerification,
        verifyOtp,
        confirmCashHandover,
        cancelRequest,
        submitRating,
        fileDispute,
        resolveDispute,
        updateAdminSettings,
        toggleUserSuspension,
        resetDemoData,
        runSection50Scenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
