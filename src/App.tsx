import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { WalletScreen } from './components/WalletScreen';
import { TransactionsScreen } from './components/TransactionsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { SenderFlowModal } from './components/SenderFlowModal';
import { ReceiverFlowModal } from './components/ReceiverFlowModal';
import { TransactionActiveModal } from './components/TransactionActiveModal';
import { RatingModal } from './components/RatingModal';
import { DisputeModal } from './components/DisputeModal';
import { OnboardingModal } from './components/OnboardingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ReceiveQRModal } from './components/ReceiveQRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { UpiTopUpModal } from './components/UpiTopUpModal';
import { SocialTrustModal } from './components/SocialTrustModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { SafetyTipsModal } from './components/SafetyTipsModal';
import { TermsPoliciesModal } from './components/TermsPoliciesModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { ShieldAlert } from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const { currentTab, theme } = useApp();

  const getThemeClass = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-[#041910] text-emerald-50 selection:bg-emerald-500';
      case 'amber':
        return 'bg-[#140f0a] text-amber-50 selection:bg-amber-500';
      case 'indigo':
        return 'bg-[#0a0e1c] text-indigo-50 selection:bg-indigo-500';
      case 'light':
        return 'bg-slate-100 text-slate-900 selection:bg-blue-500';
      case 'slate':
      default:
        return 'bg-slate-950 text-slate-100 selection:bg-blue-500';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} flex flex-col selection:text-white font-sans relative transition-colors duration-300`}>
      {/* Section 49 Mandatory Prototype Disclaimer Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-3 py-1 text-[11px] font-extrabold text-center flex items-center justify-center gap-1.5 shadow-sm sticky top-0 z-40">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-slate-950" />
        <span>
          DEMO PROTOTYPE — NO REAL MONEY, UPI, BANKING OR CARDS
        </span>
      </div>

      {/* App Header with user profile, theme toggle and quick switcher */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'wallet' && <WalletScreen />}
        {currentTab === 'transactions' && <TransactionsScreen />}
        {currentTab === 'profile' && <ProfileScreen />}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Bottom Navigation for mobile-first experience */}
      <BottomNav />

      {/* Core Flow Modals */}
      <SenderFlowModal />
      <ReceiverFlowModal />
      <TransactionActiveModal />
      <RatingModal />
      <DisputeModal />
      <OnboardingModal />
      <NotificationsModal />

      {/* New Requested Features Modals */}
      <ReceiveQRModal />
      <QRScannerModal />
      <UpiTopUpModal />
      <SocialTrustModal />
      <PrivacySettingsModal />
      <SafetyTipsModal />
      <TermsPoliciesModal />
      <ThemeSelectorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
