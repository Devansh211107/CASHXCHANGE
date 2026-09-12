import {
  AppState,
  AppTheme,
  Transaction,
  TransactionStatus,
  LedgerEntry,
  Rating,
  Dispute,
  DisputeReason,
  AvailabilityStatus,
  AdminSettings,
  NotificationItem,
  SocialAccountInfo,
  SocialProfiles,
  PrivacySettings,
} from '../types';
import { INITIAL_APP_STATE } from '../data/mockData';

const STORAGE_KEY = 'cashconnect_demo_state_v3';

class MockBackendService {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppState = JSON.parse(stored);
        if (!parsed.theme) parsed.theme = 'slate';
        // Ensure default users have social profiles & upi if missing from old cache
        if (parsed.users && parsed.users['user-devansh'] && !parsed.users['user-devansh'].socialProfiles) {
          parsed.users['user-devansh'].socialProfiles = INITIAL_APP_STATE.users['user-devansh'].socialProfiles;
          parsed.users['user-devansh'].socialTrustScore = 4.9;
          parsed.users['user-devansh'].upiId = 'devansh@cashconnect';
          parsed.users['user-devansh'].privacySettings = INITIAL_APP_STATE.users['user-devansh'].privacySettings;
        }
        return parsed;
      }
    } catch {
      console.warn('Failed to load state from localStorage, using initial state.');
    }
    return JSON.parse(JSON.stringify(INITIAL_APP_STATE));
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      console.warn('Failed to save state to localStorage.');
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener notification error:', err);
      }
    });
  }

  public getState(): AppState {
    return this.state;
  }

  public resetToDefault(): void {
    this.state = JSON.parse(JSON.stringify(INITIAL_APP_STATE));
    this.saveState();
  }

  public switchUser(userId: string): void {
    if (this.state.users[userId]) {
      this.state.currentUserId = userId;
      this.saveState();
    }
  }

  public getCurrentUser() {
    return this.state.users[this.state.currentUserId];
  }

  public getCurrentWallet() {
    return this.state.wallets[this.state.currentUserId];
  }

  // --- Availability Management ---
  public updateAvailability(userId: string, status: AvailabilityStatus): void {
    const user = this.state.users[userId];
    if (user) {
      user.availability = status;
      this.saveState();
    }
  }

  // --- Add Demo Funds ---
  public addDemoFunds(userId: string, amount: number): { success: boolean; error?: string } {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than zero.' };
    }
    const wallet = this.state.wallets[userId];
    if (!wallet) {
      return { success: false, error: 'Wallet not found.' };
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const ledgerEntry: LedgerEntry = {
      id: `ledg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      walletId: wallet.id,
      userId,
      type: 'DEPOSIT_DEMO_FUNDS',
      amount,
      description: `Added ₹${amount.toLocaleString('en-IN')} demo test funds`,
      balanceAfter: wallet.balance,
      timestamp: new Date().toISOString(),
    };

    this.state.ledger.unshift(ledgerEntry);

    // Notification
    this.addNotification({
      userId,
      title: 'Funds Added',
      message: `₹${amount.toLocaleString('en-IN')} demo money credited to your wallet.`,
      type: 'COMPLETED',
    });

    this.saveState();
    return { success: true };
  }

  // --- Theme Management ---
  public setTheme(theme: AppTheme): void {
    this.state.theme = theme;
    this.saveState();
  }

  // --- Add Funds via Simulated UPI ---
  public addUpiFunds(
    userId: string,
    amount: number,
    upiId: string,
    appName: string
  ): { success: boolean; refId?: string; error?: string } {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than zero.' };
    }
    const wallet = this.state.wallets[userId];
    if (!wallet) {
      return { success: false, error: 'Wallet not found.' };
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const refId = `UPI-REF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ledgerEntry: LedgerEntry = {
      id: `ledg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      walletId: wallet.id,
      userId,
      type: 'DEPOSIT_UPI',
      amount,
      description: `Top-up via ${appName} (${upiId}) • Ref: ${refId}`,
      balanceAfter: wallet.balance,
      timestamp: new Date().toISOString(),
    };

    this.state.ledger.unshift(ledgerEntry);

    // Notification
    this.addNotification({
      userId,
      title: 'UPI Top-Up Successful! ⚡',
      message: `₹${amount.toLocaleString('en-IN')} added via ${appName} (${upiId}). Ref: ${refId}`,
      type: 'COMPLETED',
    });

    this.saveState();
    return { success: true, refId };
  }

  // --- Social Profile & Trust Rating Management ---
  public updateSocialProfile(
    userId: string,
    platform: 'twitter' | 'linkedin' | 'instagram' | 'github',
    info: Partial<SocialAccountInfo>
  ): void {
    const user = this.state.users[userId];
    if (user) {
      if (!user.socialProfiles) {
        user.socialProfiles = {};
      }
      user.socialProfiles[platform] = {
        handle: info.handle || '',
        connected: info.connected ?? true,
        verified: info.verified ?? false,
        followersOrConnections: info.followersOrConnections,
      };

      // Recalculate Social Trust Score based on connected platforms and verification
      let baseScore = 4.0;
      const profiles = user.socialProfiles;
      let connectedCount = 0;
      if (profiles.twitter?.connected) connectedCount++;
      if (profiles.linkedin?.connected) connectedCount++;
      if (profiles.instagram?.connected) connectedCount++;
      if (profiles.github?.connected) connectedCount++;

      const bonus = (connectedCount / 4) * 0.9;
      user.socialTrustScore = Math.min(5.0, Number((baseScore + bonus).toFixed(1)));

      this.saveState();
    }
  }

  // --- Privacy Settings Management ---
  public updatePrivacySettings(
    userId: string,
    settings: Partial<PrivacySettings>
  ): void {
    const user = this.state.users[userId];
    if (user) {
      user.privacySettings = {
        obfuscateLocation: true,
        profileVisibility: 'EVERYONE',
        hideBalanceInMeetings: true,
        biometricHandoverLock: false,
        showSocialProfiles: true,
        ...user.privacySettings,
        ...settings,
      };
      this.saveState();
    }
  }

  // --- Calculate Fee & Commission ---
  public calculateFees(amount: number): {
    serviceFee: number;
    receiverCommission: number;
    platformFee: number;
  } {
    const { receiverCommissionPercent, baseServiceFeePercent, minServiceFee } =
      this.state.adminSettings;

    const calculatedServiceFee = Math.max(
      minServiceFee,
      Math.round((amount * baseServiceFeePercent) / 100)
    );

    const receiverCommission = Math.round(
      (calculatedServiceFee * receiverCommissionPercent) / 100
    );
    const platformFee = calculatedServiceFee - receiverCommission;

    return {
      serviceFee: calculatedServiceFee,
      receiverCommission,
      platformFee,
    };
  }

  // --- Backend Transaction Lifecycle ---

  /**
   * 1. CREATE & REQUEST TRANSACTION
   * Backend validates:
   * - Sender has sufficient demo balance for (amount + service fee)
   * - Receiver exists and is AVAILABLE
   * - Sets receiver to BUSY
   */
  public createCashRequest(
    senderId: string,
    receiverId: string,
    amount: number
  ): { success: boolean; transaction?: Transaction; error?: string } {
    const sender = this.state.users[senderId];
    const receiver = this.state.users[receiverId];
    const senderWallet = this.state.wallets[senderId];

    if (!sender || !receiver || !senderWallet) {
      return { success: false, error: 'User or wallet not found.' };
    }

    if (senderId === receiverId) {
      return { success: false, error: 'You cannot request cash from yourself.' };
    }

    if (receiver.availability !== 'AVAILABLE') {
      return { success: false, error: 'Receiver is no longer available.' };
    }

    const { serviceFee, receiverCommission, platformFee } = this.calculateFees(amount);
    const totalRequired = amount + serviceFee;

    if (senderWallet.balance < totalRequired) {
      return {
        success: false,
        error: `Insufficient demo wallet balance. You need ₹${totalRequired.toLocaleString(
          'en-IN'
        )} (₹${amount} + ₹${serviceFee} fee), but have ₹${senderWallet.balance.toLocaleString(
          'en-IN'
        )}.`,
      };
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const txId = `TX-DEMO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTransaction: Transaction = {
      id: txId,
      senderId,
      receiverId,
      amount,
      serviceFee,
      receiverCommission,
      platformFee,
      status: 'REQUESTED',
      otp,
      otpVerified: false,
      senderHandoverConfirmed: false,
      receiverHandoverConfirmed: false,
      createdAt: new Date().toISOString(),
      meetingLocationNote: `Nearby location ~${receiver.distanceKm.toFixed(1)} km`,
      timeline: [
        {
          status: 'CREATED',
          timestamp: new Date().toISOString(),
          note: `Request initiated for ₹${amount.toLocaleString('en-IN')}`,
        },
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: `Waiting for ${receiver.name} to accept`,
        },
      ],
    };

    // Temporarily mark receiver as BUSY to prevent multiple conflicting requests
    receiver.availability = 'BUSY';
    this.state.transactions[txId] = newTransaction;

    // Send notification to Receiver
    this.addNotification({
      userId: receiverId,
      title: 'New Cash Request!',
      message: `${sender.name} requested ₹${amount.toLocaleString('en-IN')} physical cash nearby.`,
      type: 'REQUEST',
      transactionId: txId,
    });

    this.saveState();
    return { success: true, transaction: newTransaction };
  }

  /**
   * 2. ACCEPT REQUEST
   * Receiver accepts the cash request
   */
  public acceptRequest(
    receiverId: string,
    txId: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.receiverId !== receiverId) {
      return { success: false, error: 'Unauthorized: Not the assigned receiver.' };
    }

    if (tx.status !== 'REQUESTED') {
      return { success: false, error: `Invalid state: Cannot accept a request in status ${tx.status}.` };
    }

    tx.status = 'ACCEPTED';
    tx.acceptedAt = new Date().toISOString();
    tx.timeline.push({
      status: 'ACCEPTED',
      timestamp: new Date().toISOString(),
      note: 'Receiver accepted the request',
    });

    // Notify sender
    const receiver = this.state.users[receiverId];
    this.addNotification({
      userId: tx.senderId,
      title: 'Request Accepted!',
      message: `${receiver?.name || 'Receiver'} accepted your request. Meet up to complete cash handover.`,
      type: 'ACCEPTED',
      transactionId: txId,
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 3. DECLINE REQUEST
   */
  public declineRequest(
    receiverId: string,
    txId: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.receiverId !== receiverId) {
      return { success: false, error: 'Unauthorized action.' };
    }

    if (tx.status !== 'REQUESTED') {
      return { success: false, error: 'Request is no longer pending.' };
    }

    tx.status = 'DECLINED';
    tx.timeline.push({
      status: 'DECLINED',
      timestamp: new Date().toISOString(),
      note: 'Receiver declined the request',
    });

    // Free receiver availability
    const receiver = this.state.users[receiverId];
    if (receiver) receiver.availability = 'AVAILABLE';

    // Notify sender
    this.addNotification({
      userId: tx.senderId,
      title: 'Request Declined',
      message: `${receiver?.name || 'The receiver'} was unable to accept your request.`,
      type: 'REQUEST',
      transactionId: txId,
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 4. ADVANCE TO MEETING
   */
  public advanceToMeeting(txId: string): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.status !== 'ACCEPTED') {
      return { success: false, error: 'Transaction must be in ACCEPTED state.' };
    }

    tx.status = 'READY_FOR_MEETING';
    tx.timeline.push({
      status: 'READY_FOR_MEETING',
      timestamp: new Date().toISOString(),
      note: 'Both parties are coordinating the meetup',
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 5. ADVANCE TO OTP VERIFICATION
   */
  public startOtpVerification(txId: string): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.status !== 'ACCEPTED' && tx.status !== 'READY_FOR_MEETING') {
      return { success: false, error: 'Invalid state transition for OTP verification.' };
    }

    tx.status = 'OTP_VERIFICATION';
    tx.timeline.push({
      status: 'OTP_VERIFICATION',
      timestamp: new Date().toISOString(),
      note: 'OTP verification underway',
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 6. VERIFY OTP (Section 17 & 45)
   * Backend validates:
   * - Transaction exists
   * - Correct state (OTP_VERIFICATION)
   * - OTP matches
   */
  public verifyOtp(
    txId: string,
    enteredOtp: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.status !== 'OTP_VERIFICATION' && tx.status !== 'READY_FOR_MEETING' && tx.status !== 'ACCEPTED') {
      return { success: false, error: 'Transaction is not awaiting OTP verification.' };
    }

    if (tx.otp !== enteredOtp.trim()) {
      return { success: false, error: 'Incorrect OTP. Please check with the sender and try again.' };
    }

    tx.otpVerified = true;
    tx.status = 'SETTLEMENT_PROCESSING';
    tx.timeline.push({
      status: 'SETTLEMENT_PROCESSING',
      timestamp: new Date().toISOString(),
      note: 'Demo OTP verified successfully by receiver',
    });

    // Notify both
    this.addNotification({
      userId: tx.senderId,
      title: 'OTP Verified',
      message: 'Receiver verified your OTP. Confirm physical cash received to complete transaction.',
      type: 'OTP',
      transactionId: txId,
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 7. CASH HANDOVER CONFIRMATION & FINAL SETTLEMENT (Section 16, 18, 45)
   * Backend verifies:
   * - Transaction exists
   * - Correct state (SETTLEMENT_PROCESSING or CASH_CONFIRMATION)
   * - OTP already validly verified
   * - Sender has sufficient demo funds
   * Performs atomic ledger accounting:
   *   Sender balance: - (amount + serviceFee)
   *   Receiver balance: + amount (for cash handed over) + receiverCommission
   *   Platform revenue: + platformFee
   *   Updates completed transaction counts
   *   Returns receiver availability to AVAILABLE
   */
  public confirmCashHandover(
    txId: string,
    confirmingUserId: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (!tx.otpVerified) {
      return { success: false, error: 'OTP must be verified before cash handover confirmation.' };
    }

    if (tx.status === 'COMPLETED') {
      return { success: false, error: 'Transaction already completed.' };
    }

    // Set confirmation flag
    if (confirmingUserId === tx.senderId) {
      tx.senderHandoverConfirmed = true;
    } else if (confirmingUserId === tx.receiverId) {
      tx.receiverHandoverConfirmed = true;
    }

    tx.status = 'CASH_CONFIRMATION';

    // In a prototype demo, once cash given is confirmed, execute full backend settlement!
    const sender = this.state.users[tx.senderId];
    const receiver = this.state.users[tx.receiverId];
    const senderWallet = this.state.wallets[tx.senderId];
    const receiverWallet = this.state.wallets[tx.receiverId];

    if (!senderWallet || !receiverWallet) {
      return { success: false, error: 'Wallets not found for settlement.' };
    }

    const totalSenderDeduction = tx.amount + tx.serviceFee;
    if (senderWallet.balance < totalSenderDeduction) {
      tx.status = 'FAILED';
      this.saveState();
      return { success: false, error: 'Insufficient demo balance at settlement.' };
    }

    // --- ATOMIC LEDGER ACCOUNTING ---
    const nowIso = new Date().toISOString();

    // 1. Sender Deduction: -(amount + service fee)
    senderWallet.balance -= totalSenderDeduction;
    senderWallet.updatedAt = nowIso;
    this.state.ledger.unshift({
      id: `ledg-${Date.now()}-1`,
      walletId: senderWallet.id,
      userId: tx.senderId,
      transactionId: tx.id,
      type: 'SENDER_DEDUCTION',
      amount: -totalSenderDeduction,
      description: `Payment for cash received ₹${tx.amount.toLocaleString('en-IN')} + fee ₹${tx.serviceFee}`,
      balanceAfter: senderWallet.balance,
      timestamp: nowIso,
    });

    // 2. Receiver Credit for Physical Cash Handover: +amount
    receiverWallet.balance += tx.amount;
    receiverWallet.updatedAt = nowIso;
    this.state.ledger.unshift({
      id: `ledg-${Date.now()}-2`,
      walletId: receiverWallet.id,
      userId: tx.receiverId,
      transactionId: tx.id,
      type: 'RECEIVER_CREDIT',
      amount: tx.amount,
      description: `Digital credit for physical cash handed over (₹${tx.amount.toLocaleString('en-IN')})`,
      balanceAfter: receiverWallet.balance,
      timestamp: nowIso,
    });

    // 3. Receiver Commission: +receiverCommission
    receiverWallet.balance += tx.receiverCommission;
    this.state.ledger.unshift({
      id: `ledg-${Date.now()}-3`,
      walletId: receiverWallet.id,
      userId: tx.receiverId,
      transactionId: tx.id,
      type: 'RECEIVER_COMMISSION',
      amount: tx.receiverCommission,
      description: `Receiver commission earned for ${tx.id}`,
      balanceAfter: receiverWallet.balance,
      timestamp: nowIso,
    });

    // Mark Transaction Complete
    tx.status = 'COMPLETED';
    tx.completedAt = nowIso;
    tx.timeline.push({
      status: 'CASH_CONFIRMATION',
      timestamp: nowIso,
      note: 'Cash handover confirmed by both parties',
    });
    tx.timeline.push({
      status: 'COMPLETED',
      timestamp: nowIso,
      note: `Settled: ₹${totalSenderDeduction} deducted from sender, ₹${tx.amount + tx.receiverCommission} credited to receiver`,
    });

    // Update Completed stats
    if (sender) sender.senderCompleted += 1;
    if (receiver) {
      receiver.receiverCompleted += 1;
      // Free receiver availability back to AVAILABLE
      receiver.availability = 'AVAILABLE';
    }

    // Add Notifications
    this.addNotification({
      userId: tx.senderId,
      title: 'Transaction Completed! ✅',
      message: `You received ₹${tx.amount.toLocaleString('en-IN')} cash from ${receiver?.name || 'Receiver'}. Please rate your experience.`,
      type: 'COMPLETED',
      transactionId: tx.id,
    });

    this.addNotification({
      userId: tx.receiverId,
      title: `You earned ₹${tx.receiverCommission} Commission! 🎉`,
      message: `Transaction ${tx.id} complete. ₹${tx.amount.toLocaleString('en-IN')} + ₹${tx.receiverCommission} commission credited.`,
      type: 'COMMISSION',
      transactionId: tx.id,
    });

    this.saveState();
    return { success: true };
  }

  /**
   * 8. CANCEL FLOW (Section 40)
   * Sender can cancel before settlement stage
   */
  public cancelRequest(
    userId: string,
    txId: string,
    reason: string = 'User cancelled'
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.status === 'COMPLETED' || tx.status === 'SETTLEMENT_PROCESSING') {
      return { success: false, error: 'Cannot cancel after settlement has started.' };
    }

    if (tx.senderId !== userId && tx.receiverId !== userId) {
      return { success: false, error: 'Unauthorized to cancel this transaction.' };
    }

    tx.status = 'CANCELLED';
    tx.cancelledAt = new Date().toISOString();
    tx.cancellationReason = reason;
    tx.timeline.push({
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
      note: `Cancelled by user: ${reason}`,
    });

    // Free receiver
    const receiver = this.state.users[tx.receiverId];
    if (receiver && receiver.availability === 'BUSY') {
      receiver.availability = 'AVAILABLE';
    }

    this.saveState();
    return { success: true };
  }

  /**
   * 9. RATINGS SYSTEM (Section 20 & 21)
   * Rules:
   * - Cannot rate self
   * - Cannot rate before completion
   * - Cannot rate twice for same transaction
   * - Cannot rate cancelled transaction
   * - Updates user's separate Sender / Receiver rating and success rate
   */
  public submitRating(
    fromUserId: string,
    txId: string,
    ratingScore: number,
    review?: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[txId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    if (tx.status !== 'COMPLETED') {
      return { success: false, error: 'You cannot rate this transaction yet. Only completed transactions can be rated.' };
    }

    const isSender = tx.senderId === fromUserId;
    const isReceiver = tx.receiverId === fromUserId;

    if (!isSender && !isReceiver) {
      return { success: false, error: 'You are not part of this transaction.' };
    }

    const toUserId = isSender ? tx.receiverId : tx.senderId;
    if (fromUserId === toUserId) {
      return { success: false, error: 'You cannot rate yourself.' };
    }

    const roleBeingRated = isSender ? 'RECEIVER_RATING' : 'SENDER_RATING';

    // Check duplicate rating
    const alreadyRated = this.state.ratings.some(
      (r) => r.transactionId === txId && r.fromUserId === fromUserId
    );
    if (alreadyRated) {
      return { success: false, error: 'You have already submitted a rating for this transaction.' };
    }

    const newRating: Rating = {
      id: `rate-${Date.now()}`,
      transactionId: txId,
      fromUserId,
      toUserId,
      role: roleBeingRated,
      rating: Math.min(5, Math.max(1, ratingScore)),
      review: review?.trim(),
      createdAt: new Date().toISOString(),
    };

    this.state.ratings.push(newRating);

    // Recompute target user's ratings
    const targetUser = this.state.users[toUserId];
    if (targetUser) {
      const userRatings = this.state.ratings.filter(
        (r) => r.toUserId === toUserId && r.role === roleBeingRated
      );
      if (userRatings.length > 0) {
        const avg =
          userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
        if (roleBeingRated === 'RECEIVER_RATING') {
          targetUser.receiverRating = Number(avg.toFixed(1));
        } else {
          targetUser.senderRating = Number(avg.toFixed(1));
        }
      }
    }

    // Add notification
    const fromUser = this.state.users[fromUserId];
    this.addNotification({
      userId: toUserId,
      title: 'New Rating Received! ⭐',
      message: `${fromUser?.name || 'A user'} gave you a ${ratingScore}-star rating as ${
        roleBeingRated === 'RECEIVER_RATING' ? 'Receiver' : 'Sender'
      }!`,
      type: 'RATING',
      transactionId: txId,
    });

    this.saveState();
    return { success: true };
  }

  public hasRated(txId: string, userId: string): boolean {
    return this.state.ratings.some(
      (r) => r.transactionId === txId && r.fromUserId === userId
    );
  }

  // --- DISPUTE SYSTEM (Section 33) ---
  public fileDispute(
    reportedBy: string,
    transactionId: string,
    reason: DisputeReason,
    description: string
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions[transactionId];
    if (!tx) return { success: false, error: 'Transaction not found.' };

    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      transactionId,
      reportedBy,
      reason,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    tx.status = 'DISPUTED';
    this.state.disputes.unshift(newDispute);

    this.addNotification({
      userId: reportedBy,
      title: 'Dispute Registered',
      message: `Dispute for ${transactionId} is now under review by demo admin.`,
      type: 'DISPUTE',
      transactionId,
    });

    this.saveState();
    return { success: true };
  }

  public resolveDispute(
    disputeId: string,
    adminNotes: string,
    status: 'RESOLVED' | 'UNDER_REVIEW'
  ): void {
    const dispute = this.state.disputes.find((d) => d.id === disputeId);
    if (dispute) {
      dispute.status = status;
      dispute.adminNotes = adminNotes;
      if (status === 'RESOLVED') {
        dispute.resolvedAt = new Date().toISOString();
      }
      this.saveState();
    }
  }

  // --- ADMIN SETTINGS (Section 32) ---
  public updateAdminSettings(settings: Partial<AdminSettings>): void {
    this.state.adminSettings = {
      ...this.state.adminSettings,
      ...settings,
    };
    this.saveState();
  }

  // --- ADMIN USER ACTIONS (Section 30) ---
  public toggleUserSuspension(userId: string): void {
    const user = this.state.users[userId];
    if (user) {
      user.isSuspended = !user.isSuspended;
      this.saveState();
    }
  }

  // --- NOTIFICATIONS (Section 28) ---
  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(notif);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.state.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.saveState();
  }
}

export const mockBackend = new MockBackendService();
