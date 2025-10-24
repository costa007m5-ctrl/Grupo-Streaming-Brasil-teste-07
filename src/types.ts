import React from 'react';

export enum GroupStatus {
  Active = 'Ativo',
  Pending = 'Pendente',
}

export interface ChatMessage {
  id: number;
  senderName: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  isYou: boolean;
}

export interface Profile {
  id: string; // uuid
  full_name: string;
  avatar_url: string;
  balance: number;
  wallet_id: string;
  is_verified: boolean;
  phone?: string;
  is_phone_verified?: boolean;
  birth_date?: string;
  cpf?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  created_at?: string;
  fcm_tokens?: string[];
  is_profile_private?: boolean;
  is_searchable?: boolean;
}

export interface Group {
  id: number;
  name: string;
  price: number;
  status: GroupStatus;
  members: number;
  max_members: number;
  next_payment_date: string;
  logo: string;
  chat_history?: ChatMessage[];
  host_name: string;
  members_list: GroupMember[];
  rules: GroupRule[];
  credentials: {
    email: string;
    password?: string;
  };
  host_id?: string;
}

export interface Activity {
  id: number;
  description: string;
  timestamp: string;
  amount: number | null;
  icon?: React.ComponentType<{ className?: string }>;
  logo?: string;
}

export interface ProfileStat {
    id: number;
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface ProfileActivity {
    id: number;
    name: string;
    date: string;
    logo: string;
}

export interface SettingItem {
    id: number;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export type WalletTransactionLogo = 'netflix' | 'spotify' | 'disney' | 'amazon' | 'pix' | 'cashback' | 'transfer_in' | 'transfer_out' | 'withdraw';

export interface WalletTransaction {
  id: number;
  name: string;
  date: string;
  status: string;
  amount: number;
  logo: WalletTransactionLogo;
  type: string;
  metadata: any;
}

export interface GroupMember {
  id: string; // The user's profile ID (uuid)
  name: string;
  role: 'Anfitrião' | 'Membro';
  joinDate: string;
  avatarUrl?: string;
}

export interface GroupRule {
  id: number;
  text: string;
}

export interface AvailableService {
  id: string;
  name: string;
  logoUrl: string;
  bgColor?: string;
  category: 'movie' | 'tv' | 'music';
  originalPrice: number;
  officialUrl: string;
}

export interface NewGroupDetails {
    service: AvailableService;
    name: string;
    totalPrice: number;
    slots: number;
    paymentDay: number;
    pricePerSlot: number;
}

export interface FeaturedContent {
  id: number;
  title: string;
  description: string;
  backgroundImageUrl: string;
  logoUrl: string;
  serviceName: string;
  serviceId?: string;
}

export interface MovieInfo {
  id: number;
  title: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number;
  genres: string[];
  releaseYear: number;
  serviceId: string;
  serviceName: string;
  serviceLogoUrl: string;
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  backdrop_path?: string;
  overview?: string;
  first_air_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CompletedTransaction {
  id: number;
  amount: number;
  sender: Profile;
  recipient: Profile;
  timestamp: string;
}

export interface Brand {
  name: string;
  logo: string;
  video: string;
  tmdb: {
    type: 'company' | 'keyword' | 'provider';
    id: number;
  };
}

export interface SupportMessage {
  sender_id: string;
  sender_name: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: number;
  created_at: string;
  user_id: string;
  subject: string;
  status: 'aberto' | 'em andamento' | 'fechado';
  messages: SupportMessage[];
  updated_at: string;
  // Joined from profiles table for admin convenience
  user_full_name?: string;
  user_avatar_url?: string;
}