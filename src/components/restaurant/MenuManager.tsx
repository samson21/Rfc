/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, Category } from '../../types';
import MenuItemCard from './MenuItemCard';
import MenuForm from './MenuForm';

const CATEGORIES: Category[] = ['Appetizers', 'Main Course', 'Sides', 'Desserts', 'Drinks'];

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rasta_menu');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse menu items', e);
      }
    } else {
      // Seed data for restaurant
      const initialItems: MenuItem[] = [
        {
          id: 'm1',
          name: 'Ital Vegetable Stew',
          description: 'Hearty mix of coconut milk, yam, pumpkin, okra, and colorful island spices.',
          price: 18.50,
          category: 'Main Course',
          isPopular: true,
          isOutOfStock: false,
          imageUrl: '/input_file_4.png',
          createdAt: Date.now()
        },
        {
          id: 'm2',
          name: 'Jerk Chicken Platter',
          description: 'Spiced and smoked chicken served with red beans, rice, and sweet plantain.',
          price: 24.00,
          category: 'Main Course',
          isPopular: true,
          isOutOfStock: false,
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          createdAt: Date.now()
        },
        {
          id: 'm3',
          name: 'Tropical Fruit Bowl',
          description: 'Vibrant selection of sliced mango, papaya, pineapple, and passion fruit.',
          price: 12.00,
          category: 'Desserts',
          isPopular: false,
          isOutOfStock: false,
          imageUrl: 'https://images.unsplash.com/photo-1546549032-95f722b27072?auto=format&fit=crop&w=800&q=80',
          createdAt: Date.now()
        },
        {
          id: 'm4',
          name: 'Sorrel Ginger Brew',
          description: 'Traditional refreshing hibiscus drink with a vibrant spicy ginger kick.',
          price: 6.50,
          category: 'Drinks',
          isPopular: true,
          isOutOfStock: false,
          imageUrl: 'https://images.unsplash.com/photo-1536935338213-d2a1338ff160?auto=format&fit=crop&w=800&q=80',
          createdAt: Date.now()
        }
      ];
      setItems(initialItems);
      localStorage.setItem('rasta_menu', JSON.stringify(initialItems));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('rasta_menu', JSON.stringify(items));
    }
  }, [items]);

  const handleSaveItem = (itemData: Partial<MenuItem>) => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...itemData } as MenuItem : i));
    } else {
      const newItem: MenuItem = {
        id: Math.random().toString(36).substr(2, 9), // crypto.randomUUID fallback
        name: itemData.name!,
        description: itemData.description!,
        price: itemData.price!,
        category: itemData.category!,
        isPopular: itemData.isPopular || false,
        isOutOfStock: itemData.isOutOfStock || false,
        createdAt: Date.now(),
      };
      setItems([...items, newItem]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-sidebar mb-1">Restaurant Menu</h2>
          <p className="text-sm text-gray-400 font-medium uppercase tracking-tighter">Manage your dishes, prices, and availability</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="bg-brand-sidebar text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-bg rounded-lg border-none focus:ring-1 focus:ring-brand-gold/30 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-brand-sidebar text-white'
                : 'bg-brand-bg text-gray-400 hover:text-brand-sidebar'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-sidebar text-white'
                  : 'bg-brand-bg text-gray-400 hover:text-brand-sidebar'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item: MenuItem) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <UtensilsIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No menu items found. Start by adding one!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <MenuForm
            item={editingItem}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function UtensilsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
