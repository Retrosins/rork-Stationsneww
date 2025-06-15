export interface Subscription {
  id: string;
  name: string;
  type: 'artist' | 'host';
  price: number;
  setupFee?: number;
  billingCycle?: 'weekly' | 'monthly' | 'yearly';
  durationWeeks?: number;
  description?: string;
  features?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}