/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-brand-border hover:shadow-md transition-all group relative ${
        item.isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      <div className="h-40 bg-brand-sidebar relative overflow-hidden">
        <img 
          src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`} 
          alt={item.name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 brightness-110 contrast-105 ${!item.imageUrl ? 'opacity-50 grayscale hover:grayscale-0' : 'opacity-90 group-hover:opacity-100'}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-sidebar/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" />
            POPULAR
          </div>
        )}

        {item.isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded shadow-md flex items-center gap-1.5 uppercase">
              <AlertCircle className="w-3 h-3" />
              Stock Out
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{item.category}</span>
          <span className="text-sm font-bold text-brand-sidebar font-mono">{item.price.toFixed(2)}</span>
        </div>
        
        <h3 className="text-base font-bold mb-1 group-hover:text-brand-gold transition-colors">{item.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 h-8 leading-relaxed">{item.description}</p>

        <div className="flex items-center gap-2 pt-3 border-t border-brand-border-alt">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-brand-bg text-brand-sidebar font-bold hover:bg-brand-sidebar hover:text-white transition-all text-[11px] uppercase tracking-wider"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-brand-red hover:text-white transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
