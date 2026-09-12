import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Wallet, ArrowLeftRight, UserCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 px-6 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-blue-400' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
