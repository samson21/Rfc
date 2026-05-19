/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Search, Filter, Check, X, ShieldCheck, Ticket, Upload, Image as ImageIcon, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Event, Booking } from '../../types';

export default function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Booking Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [spots, setSpots] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState<Event['category']>('Community');
  const [formMaxSpots, setFormMaxSpots] = useState(50);
  const [formImageUrl, setFormImageUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Music', 'Workshop', 'Food', 'Community', 'History'];

  useEffect(() => {
    const saved = localStorage.getItem('rasta_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse events', e);
      }
    } else {
      // Seed data
      const initialEvents: Event[] = [
        {
          id: '1',
          title: 'Roots & Vibes Saturdays',
          description: 'A vibrant night of roots, reggae, and cultural vibes featuring U-KEY, Jahziel Naphtali, and more.',
          date: '2026-05-09',
          time: '18:00',
          location: 'Ayat, Tafo Square',
          maxSpots: 500,
          bookedSpots: 300,
          category: 'Music',
          imageUrl: '/input_file_3.png'
        },
        {
          id: '2',
          title: '85th Victory Day Celebration',
          description: 'National Archives & Library event featuring panel discussions, art exhibitions, and music performances.',
          date: '2026-05-05',
          time: '14:00',
          location: 'Wemezeker Library',
          maxSpots: 200,
          bookedSpots: 150,
          category: 'Community',
          imageUrl: '/input_file_1.png'
        },
        {
          id: '3',
          title: '63rd OAU Anniversary',
          description: 'Rastafari Family Centre invites you to celebrate unity with tasty food, drinks, and special guest artists.',
          date: '2026-05-24',
          time: '16:00',
          location: 'Tafo Square, detrás del Hotel Genet Leul',
          maxSpots: 300,
          bookedSpots: 85,
          category: 'Food',
          imageUrl: '/input_file_2.png'
        },
        {
          id: '4',
          title: 'Ethiopian Victory Day Tribute',
          description: 'Commemorating the faith, courage, and just cause of H.I.M. Haile Selassie I and the Ethiopian people.',
          date: '2026-05-05',
          time: '10:00',
          location: 'Cultural Wing',
          maxSpots: 100,
          bookedSpots: 60,
          category: 'History',
          imageUrl: '/input_file_0.png'
        }
      ];
      setEvents(initialEvents);
      localStorage.setItem('rasta_events', JSON.stringify(initialEvents));
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      if (cat === 'All') return ['All'];
      const withoutAll = prev.filter(c => c !== 'All');
      if (withoutAll.includes(cat)) {
        const next = withoutAll.filter(c => c !== cat);
        return next.length === 0 ? ['All'] : next;
      }
      return [...withoutAll, cat];
    });
  };

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('rasta_events', JSON.stringify(updatedEvents));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedEvents = events.map(ev => {
      if (ev.id === selectedEvent.id) {
        return { ...ev, bookedSpots: ev.bookedSpots + spots };
      }
      return ev;
    });

    saveEvents(updatedEvents);
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsBookingOpen(false);
      setSelectedEvent(null);
      setSpots(1);
      setUserName('');
      setUserEmail('');
    }, 3000);
  };

  const openForm = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormTitle(event.title);
      setFormDesc(event.description);
      setFormDate(event.date);
      setFormTime(event.time);
      setFormLocation(event.location);
      setFormCategory(event.category);
      setFormMaxSpots(event.maxSpots);
      setFormImageUrl(event.imageUrl || '');
    } else {
      setEditingEvent(null);
      setFormTitle('');
      setFormDesc('');
      setFormDate('');
      setFormTime('');
      setFormLocation('');
      setFormCategory('Community');
      setFormMaxSpots(50);
      setFormImageUrl('');
    }
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOrUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We only store the imageUrl if it's explicitly set (uploaded)
    // Otherwise it remains undefined/empty and we use the fallback in the UI

    if (editingEvent) {
      const updatedEvents = events.map(ev => 
        ev.id === editingEvent.id 
          ? { 
              ...ev, 
              title: formTitle,
              description: formDesc,
              date: formDate,
              time: formTime,
              location: formLocation,
              category: formCategory,
              maxSpots: formMaxSpots,
              imageUrl: formImageUrl || undefined
            } 
          : ev
      );
      saveEvents(updatedEvents);
    } else {
      const newEv: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title: formTitle,
        description: formDesc,
        date: formDate,
        time: formTime,
        location: formLocation,
        category: formCategory,
        maxSpots: formMaxSpots,
        bookedSpots: 0,
        imageUrl: formImageUrl || undefined
      };
      saveEvents([...events, newEv]);
    }

    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      saveEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-sidebar mb-1">Event Calendar</h2>
          <p className="text-sm text-gray-400 font-medium uppercase tracking-tighter">Community Gatherings & Programs</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    isActive
                      ? 'bg-brand-sidebar border-brand-sidebar text-white shadow-sm'
                      : 'bg-white border-brand-border text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <button 
            onClick={() => openForm()}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-green text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events
          .filter((e) => selectedCategories.includes('All') || selectedCategories.includes(e.category))
          .map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group hover:border-brand-gold/30"
          >
            <div className="h-48 bg-brand-sidebar relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white p-2 rounded-lg text-center min-w-[50px] border border-white/20 z-10">
                <p className="text-sm font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                <p className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</p>
              </div>
              <div className="absolute top-4 right-4 bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                {event.category}
              </div>
              <img 
                src={event.imageUrl || `https://picsum.photos/seed/${event.id}/800/600`} 
                alt={event.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 brightness-110 contrast-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-sidebar/60 to-transparent group-hover:from-brand-sidebar/40 transition-all" />
              
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); openForm(event); }}
                  className="p-2 bg-white/40 backdrop-blur-md text-white rounded-full hover:bg-brand-gold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                  className="p-2 bg-white/40 backdrop-blur-md text-white rounded-full hover:bg-brand-red transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-sidebar mb-2 group-hover:text-brand-gold transition-colors">{event.title}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-brand-sidebar font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-sidebar font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-sidebar font-medium">
                  <Users className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{event.maxSpots - event.bookedSpots} spots left</span>
                  <div className="flex-1 h-1.5 bg-brand-bg rounded-full overflow-hidden ml-2">
                    <div 
                      className="h-full bg-brand-green" 
                      style={{ width: `${(event.bookedSpots / event.maxSpots) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedEvent(event);
                  setIsBookingOpen(true);
                }}
                disabled={event.bookedSpots >= event.maxSpots}
                className="w-full py-3 bg-brand-sidebar text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                {event.bookedSpots >= event.maxSpots ? 'Fully Booked' : 'Book a Spot'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {/* Booking Modal */}
        {isBookingOpen && selectedEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-brand-sidebar/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-brand-border"
            >
              {showSuccess ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-sidebar">Booking Confirmed!</h3>
                  <p className="text-gray-500">We've reserved {spots} spot(s) for you at {selectedEvent.title}.</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pt-4">Check your email for details</p>
                </div>
              ) : (
                <>
                  <div className="bg-brand-sidebar p-6 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Reserve Your Spot</h3>
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">{selectedEvent.title}</p>
                    </div>
                    <button onClick={() => setIsBookingOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleBooking} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
                      <input required type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm" placeholder="Marcus Garvey" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input required type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm" placeholder="marcus@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Number of Spots</label>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setSpots(Math.max(1, spots - 1))} className="w-10 h-10 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-bg">-</button>
                        <span className="text-lg font-bold w-4 text-center">{spots}</span>
                        <button type="button" onClick={() => setSpots(Math.min(selectedEvent.maxSpots - selectedEvent.bookedSpots, spots + 1))} className="w-10 h-10 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-bg">+</button>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-brand-border mt-6">
                      <button type="submit" disabled={isProcessing} className="w-full py-3 bg-brand-sidebar text-white rounded-xl font-bold text-sm uppercase tracking-[0.2em] hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                        {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><ShieldCheck className="w-5 h-5" />Confirm Booking</>}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}

        {/* Event Form Modal (Create/Edit) */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-brand-sidebar/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-brand-border max-h-[90vh] flex flex-col"
            >
              <div className="bg-brand-sidebar p-6 text-white flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                <button onClick={() => setIsFormOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateEvent} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Event Title</label>
                    <input required type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold" placeholder="e.g., Reggae Vibration Night" />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                    <textarea required rows={3} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-medium" placeholder="Tell the community about this event..." />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</label>
                    <input required type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Time</label>
                    <input required type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                    <input required type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold" placeholder="e.g., The Yard" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as Event['category'])} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold appearance-none">
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Max Spots</label>
                    <input required type="number" value={formMaxSpots} onChange={(e) => setFormMaxSpots(parseInt(e.target.value))} className="w-full px-4 py-3 border border-brand-border bg-brand-bg rounded-xl outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-bold" min="1" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Event Image</label>
                    <div className="relative group/img">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-brand-border rounded-xl bg-brand-bg flex flex-col items-center justify-center cursor-pointer hover:bg-brand-border/20 transition-all overflow-hidden"
                      >
                        {formImageUrl ? (
                          <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Image</span>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {formImageUrl && (
                        <button 
                          type="button"
                          onClick={() => setFormImageUrl('')}
                          className="absolute top-2 right-2 p-1.5 bg-brand-red text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 italic font-medium uppercase tracking-tighter">If no image is uploaded, a vibrant placeholder will be generated.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-border flex gap-4">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 bg-brand-bg text-brand-sidebar font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-border transition-all">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-brand-sidebar text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg hover:shadow-brand-sidebar/20 transition-all active:scale-95">{editingEvent ? 'Save Changes' : 'Create Event'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
