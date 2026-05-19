/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Appetizers' | 'Main Course' | 'Desserts' | 'Drinks' | 'Sides';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  isPopular: boolean;
  isOutOfStock: boolean;
  imageUrl?: string;
  createdAt: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  maxSpots: number;
  bookedSpots: number;
  category: 'Community' | 'Music' | 'Workshop' | 'Food' | 'History';
}

export interface Booking {
  id: string;
  eventId: string;
  userName: string;
  userEmail: string;
  spots: number;
  createdAt: number;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  type: 'one-time' | 'monthly';
  isPledge: boolean;
  message?: string;
  date: number;
  status: 'pending' | 'completed';
}
