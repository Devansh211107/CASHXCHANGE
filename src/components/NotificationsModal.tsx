import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  Coins,
  Star,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    setSelectedTxId,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const mockNotifications = [
    {
      id: 'notif-1',
      title: '₹10 Commission Credited',
      desc: 'Commission for transaction TX-DEMO-10291 was deposited into your demo wallet.',
      time: '10m ago',
      icon: Coins,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      txId: 'TX-DEMO-10291',
    },
    {
      id: 'notif-2',
      title: 'New 5-Star Rating Received',
      desc: 'Amit Sharma rated you 5.0 ⭐ as a trusted Sender: "Very prompt and polite!"',
      time: '45m ago',
      icon: Star,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      txId: null,
    },
    {
      id: 'notif-3',
      title: 'Receiver is Nearby',
      desc: 'Amit Sharma is within ~0.4 km of your meeting zone.',
      time: '2h ago',
      icon: MapPin,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      txId: 'TX-DEMO-10292',
    },
    {
      id: 'notif-4',
      title: 'Cash Handover Completed',
      desc: 'Physical cash handover for TX-DEMO-10291 successfully settled.',
      time: '1d ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      txId: 'TX-DEMO-10291',
    },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-extrabold text-white">Notifications</h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
          {mockNotifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (n.txId) {
                    setSelectedTxId(n.txId);
                    setIsNotificationsOpen(false);
                  }
                }}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-xs space-y-1 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${n.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-[11px]">{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-8 leading-relaxed">
                  {n.desc}
                </p>
                {n.txId && (
                  <div className="pl-8 pt-1 flex items-center gap-1 text-[10px] text-blue-400 font-semibold">
                    <span>View Transaction ({n.txId})</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
