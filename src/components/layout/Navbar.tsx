/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Utensils, Calendar, Heart, LayoutDashboard, Menu, X as CloseIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Restaurant', path: '/restaurant', icon: Utensils },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Pledges', path: '/pledges', icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-brand-sidebar text-white sticky top-0 z-[60] shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-yellow-500 to-green-600 flex items-center justify-center font-bold text-sm border border-white/20">R</div>
          <h1 className="text-lg font-bold">Rastafarian Family Center</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/10"
        >
          {isOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <nav className="bg-brand-sidebar text-white h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col shadow-xl z-50 overflow-y-auto">
        <NavContent />
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-64 bg-brand-sidebar text-white z-[70] md:hidden shadow-2xl flex flex-col overflow-y-auto"
            >
              <NavContent onItemClick={() => setIsOpen(false)} />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <>
      <div className="p-8 mb-4">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-yellow-500 to-green-600 flex items-center justify-center font-bold text-lg border-2 border-white/20">
            R
          </div>
          <h1 className="text-xl font-bold tracking-tight">Rastafarian Family Center</h1>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-white/10 text-white border-l-4 border-brand-gold' 
                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs text-brand-gold font-bold uppercase tracking-widest mb-1">Admin Status</p>
          <p className="text-sm font-medium">Marcus Garvey</p>
          <p className="text-[10px] opacity-40">Primary Manager</p>
        </div>
      </div>
    </>
  );
}
