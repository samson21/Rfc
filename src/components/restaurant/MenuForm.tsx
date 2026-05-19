/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Utensils, DollarSign, Tag, FileText, Image as ImageIcon, Star, Ban, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem, Category } from '../../types';

interface MenuFormProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => void;
}

const CATEGORIES: Category[] = ['Appetizers', 'Main Course', 'Sides', 'Desserts', 'Drinks'];

export default function MenuForm({ item, onClose, onSave }: MenuFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || {
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      isPopular: false,
      isOutOfStock: false,
      imageUrl: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-olive/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-brand-border"
      >
        <div className="bg-brand-sidebar p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{item ? 'Edit Menu Item' : 'New Menu Item'}</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Kitchen Inventory Management</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            {!item && (
              <button
                type="submit"
                className="w-full py-2 bg-brand-gold text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:shadow-md transition-all flex items-center justify-center gap-2 mb-2"
              >
                <Send className="w-3 h-3" />
                Quick Post to Menu
              </button>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                <Utensils className="w-3 h-3" /> Dish Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm"
                placeholder="e.g. Jerk Chicken"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                  <Tag className="w-3 h-3" /> Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                  <DollarSign className="w-3 h-3" /> Price
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                <FileText className="w-3 h-3" /> Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-sm resize-none"
                placeholder="Describe your dish..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                <ImageIcon className="w-3 h-3" /> Image
              </label>
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 rounded-xl border border-brand-border bg-brand-bg flex items-center justify-center overflow-hidden shrink-0">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:bg-brand-sidebar group-hover:text-white transition-all">
                      Choose File
                    </div>
                  </div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-brand-border bg-brand-bg rounded-lg outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all font-medium text-[10px]"
                    placeholder="...or paste URL"
                  />
                  {formData.imageUrl && (
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[9px] font-bold text-brand-red uppercase tracking-widest hover:underline"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}
                className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  formData.isPopular 
                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-sm' 
                    : 'border-brand-border text-gray-400 bg-brand-bg/50 hover:bg-brand-bg'
                }`}
              >
                <Star className={`w-4 h-4 ${formData.isPopular ? 'fill-current' : ''}`} />
                <span className="font-bold text-[10px] uppercase tracking-widest">Popular</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOutOfStock: !formData.isOutOfStock })}
                className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                  formData.isOutOfStock 
                    ? 'border-brand-red bg-brand-red/10 text-brand-red shadow-sm' 
                    : 'border-brand-border text-gray-400 bg-brand-bg/50 hover:bg-brand-bg'
                }`}
              >
                <Ban className="w-4 h-4" />
                <span className="font-bold text-[10px] uppercase tracking-widest">Stock Out</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-sidebar text-white rounded-lg font-bold text-sm uppercase tracking-[0.2em] hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {item ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {item ? 'Save Changes' : 'Post to Menu'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
