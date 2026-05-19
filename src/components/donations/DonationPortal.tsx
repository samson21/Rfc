/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, CreditCard, DollarSign, Calendar, MessageSquare, Check, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Donation } from '../../types';

export default function DonationPortal() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [amount, setAmount] = useState<number | ''>('');
  const [isPledge, setIsPledge] = useState(false);
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rasta_donations');
    if (saved) {
      try {
        setDonations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse donations', e);
      }
    }
  }, []);

  const totalRaised = donations.reduce((acc, d) => acc + d.amount, 0);
  const goal = 100000;
  const progress = (totalRaised / goal) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newDonation: Donation = {
      id: Math.random().toString(36).substr(2, 9),
      donorName: name,
      amount: Number(amount),
      type: donationType,
      isPledge: isPledge,
      message: message,
      date: Date.now(),
      status: isPledge ? 'pending' : 'completed',
    };

    const updated = [newDonation, ...donations];
    setDonations(updated);
    localStorage.setItem('rasta_donations', JSON.stringify(updated));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Reset form
    setAmount('');
    setName('');
    setMessage('');
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-brand-sidebar mb-1">Pledges & Donations</h2>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-tighter">Support the Rastafrian Family Center Community</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Donation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-brand-sidebar p-6 text-white">
              <h3 className="text-xl font-bold">Secure Donation Portal</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Encrypted & Secure Transaction</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                    <DollarSign className="w-3 h-3" /> Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      required
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-bold text-lg"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10, 25, 50, 100].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                          amount === val ? 'bg-brand-gold border-brand-gold text-white' : 'border-brand-border bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                    <Calendar className="w-3 h-3" /> Frequency
                  </label>
                  <div className="flex bg-brand-bg p-1 rounded-xl border border-brand-border h-[50px]">
                    <button
                      type="button"
                      onClick={() => setDonationType('one-time')}
                      className={`flex-1 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        donationType === 'one-time' ? 'bg-white shadow-sm text-brand-sidebar' : 'text-gray-400'
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType('monthly')}
                      className={`flex-1 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        donationType === 'monthly' ? 'bg-white shadow-sm text-brand-sidebar' : 'text-gray-400'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                  <CreditCard className="w-3 h-3" /> Full Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                  <MessageSquare className="w-3 h-3" /> Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium resize-none h-24"
                  placeholder="Leave a message for the community..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-brand-bg rounded-xl border border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsPledge(!isPledge)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isPledge ? 'bg-brand-green' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPledge ? 'left-7' : 'left-1'}`} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-sidebar">Treat this as a Pledge</p>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Commit now, donate later</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-brand-sidebar text-white rounded-xl font-bold text-sm uppercase tracking-[0.2em] hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Complete {isPledge ? 'Pledge' : 'Donation'}
                  </>
                )}
              </button>
              
              <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Secure Payment Powered by RastaCenter
              </p>
            </form>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-green text-white p-6 rounded-2xl flex items-center gap-4 shadow-xl shadow-brand-green/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Thank you for your generosity!</p>
                  <p className="text-white/80 text-sm">Your support makes a real difference in the community.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Stats & Recent */}
        <div className="space-y-6">
          <section className="bg-brand-sidebar text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-gold" />
                Community Fund Goal
              </h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-bold">${totalRaised.toLocaleString()}</span>
                <span className="text-xs opacity-60 italic">Goal: ${goal.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-brand-gold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                />
              </div>
              <div className="flex justify-between text-[11px] uppercase font-bold opacity-70 tracking-widest">
                <span>{progress.toFixed(1)}% Funded</span>
                <span>{donations.length} Supporters</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
          </section>

          <section className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-brand-border-alt">
              <h3 className="font-bold text-lg">Recent Supporters</h3>
            </div>
            <div className="divide-y divide-brand-border-alt max-h-[500px] overflow-y-auto">
              {donations.length > 0 ? (
                donations.map((d) => (
                  <div key={d.id} className="p-4 hover:bg-brand-bg transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-brand-sidebar">{d.donorName}</p>
                      <span className="text-xs font-bold text-brand-green">${d.amount}</span>
                    </div>
                    {d.message && <p className="text-xs text-gray-500 italic line-clamp-1 mb-1">"{d.message}"</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                        {new Date(d.date).toLocaleDateString()}
                      </span>
                      {d.isPledge && (
                        <span className="text-[9px] uppercase font-bold bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded">Pledge</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No donations yet. Be the first!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
