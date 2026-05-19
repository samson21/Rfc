/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MenuManager from './components/restaurant/MenuManager';
import DonationPortal from './components/donations/DonationPortal';
import EventManager from './components/events/EventManager';
import { Utensils, Calendar, Heart, ArrowUpRight, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Donation } from './types';

function Dashboard() {
  const [stats, setStats] = useState({
    pledges: '$42,850.00',
    revenue: '$1,240.20',
    events: '4',
    members: '1,502'
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    // Try to get real stats from localstorage
    const savedDonations = localStorage.getItem('rasta_donations');
    if (savedDonations) {
      try {
        const donations = JSON.parse(savedDonations);
        const totalDonated = donations.reduce((acc: number, d: Donation) => acc + (d.status === 'completed' ? d.amount : 0), 0);
        const totalPledged = donations.reduce((acc: number, d: Donation) => acc + (d.isPledge ? d.amount : 0), 0);
        
        setStats(prev => ({ 
          ...prev, 
          pledges: `$${(42850 + totalPledged + totalDonated).toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
        }));
      } catch (e) {
        console.error(e);
      }
    }

    const savedMenu = localStorage.getItem('rasta_menu');
    if (savedMenu) {
      try {
        const menu = JSON.parse(savedMenu);
        setStats(prev => ({ ...prev, members: (1502 + menu.length).toString() }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="space-y-8 flex flex-col h-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-brand-sidebar">Management Overview</h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
            {today} • Community Center Hub
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex -space-x-2">
            {[
              '1531123897727-8f129e1688ce',
              '1506794778202-cad84cf45f1d',
              '1544005313-94ddf0286df2'
            ].map((id, i) => (
              <img
                key={id}
                src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=64&q=80`}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                alt="Community Member"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <button className="px-5 py-2 bg-brand-sidebar text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95">
            New Entry +
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pledges', value: stats.pledges, icon: Heart, color: 'text-brand-green' },
          { label: 'Rest. Revenue', value: stats.revenue, icon: Utensils, color: 'text-brand-gold' },
          { label: 'Event Attendance', value: stats.events, icon: Calendar, color: 'text-brand-red' },
          { label: 'Active Members', value: stats.members, icon: Users, color: 'text-brand-sidebar' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-brand-border p-5 rounded-xl flex flex-col justify-center shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">{stat.label}</span>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-40`} />
            </div>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white border border-brand-border rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-border-alt flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Kitchen Orders</h3>
            <span className="text-xs text-brand-green font-bold bg-green-50 px-2 py-1 rounded">Live Feed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-bg text-[11px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Table</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border-alt">
                {[
                  { id: '#ORD-902', item: 'Ital Vegetable Stew', table: 'T-12', status: 'In Prep', color: 'bg-yellow-100 text-yellow-800', price: '$18.50' },
                  { id: '#ORD-901', item: 'Jerk Chicken Platter', table: 'T-04', status: 'Served', color: 'bg-green-100 text-green-800', price: '$24.00' },
                  { id: '#ORD-899', item: 'Callaloo & Saltfish', table: 'Takeout', status: 'Ready', color: 'bg-gray-100 text-gray-600', price: '$15.20' },
                  { id: '#ORD-898', item: 'Ackee & Saltfish', table: 'T-08', status: 'Pending', color: 'bg-red-100 text-red-800', price: '$21.00' },
                ].map((row, i) => (
                  <tr key={i} className="text-sm hover:bg-brand-bg transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                    <td className="px-6 py-4 font-medium">{row.item}</td>
                    <td className="px-6 py-4">{row.table}</td>
                    <td className="px-6 py-4">
                      <span className={`${row.color} px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold font-mono">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="bg-white border border-brand-border rounded-2xl flex flex-col shadow-sm">
            <div className="p-6 border-b border-brand-border-alt">
              <h3 className="font-bold text-lg">Upcoming Events</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div className="w-12 h-12 bg-brand-red rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold shrink-0">
                  <span>05</span>
                  <span className="uppercase text-[10px]">May</span>
                </div>
                <div>
                  <p className="text-sm font-bold">85th Victory Day</p>
                  <p className="text-[10px] text-gray-500 uppercase">2:00 PM • National Library</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 border border-brand-border-alt rounded-xl bg-white">
                <div className="w-12 h-12 bg-brand-sidebar rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold shrink-0">
                  <span>09</span>
                  <span className="uppercase text-[10px]">May</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Roots & Vibes</p>
                  <p className="text-[10px] text-gray-400 uppercase">6:00 PM • Tafo Square</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-brand-sidebar text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-4">Center Expansion Fund</h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold">$85,420</span>
                <span className="text-xs opacity-60 italic">Goal: $100k</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mb-4">
                <div className="h-full bg-brand-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] uppercase font-bold opacity-70 tracking-widest">
                <span>85% Funded</span>
                <span>14 Days Left</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-green/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-brand-red/20 rounded-full blur-xl"></div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
        <Navbar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/restaurant" element={<MenuManager />} />
            <Route path="/events" element={<EventManager />} />
            <Route path="/pledges" element={<DonationPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
