# Grupo Streaming Brasil - PWA Application

## Overview

Grupo Streaming Brasil (GSB) is a Progressive Web Application (PWA) that enables users to share and manage streaming service subscriptions collaboratively. The platform combines social features with financial management, allowing users to create or join groups, split subscription costs, manage payments, and discover content across multiple streaming platforms.

**Core Purpose:** Reduce individual streaming costs by facilitating group subscriptions while providing an engaging social experience for discovering and sharing content.

**Key Features:**
- Group subscription management (create, join, manage)
- Integrated digital wallet with PIX, Boleto, and credit card support
- Real-time chat within groups
- Content discovery across streaming platforms (Netflix, Prime Video, Disney+, Max, etc.)
- Rich push notifications for payments and group activities
- Account verification system
- Admin dashboard for platform management
- AI-powered search and content generation (Gemini API)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 19 with TypeScript
- Vite as build tool and development server
- Tailwind CSS (loaded via CDN) for styling
- Progressive Web App (PWA) capabilities with service workers

**Component Structure:**
- **Screens**: Full-page views for different app sections (30+ screens including Home, Profile, Wallet, Explore, Group Management, Verification flows)
- **Layout Components**: Reusable layout elements (Header, BottomNav, QuickActions, MyGroups)
- **UI Components**: Shared interface elements (Icons, Buttons, Carousels, Forms)
- **Modals**: Overlay components for confirmations, prompts, and dialogs

**State Management:**
- Context API for cross-cutting concerns (Theme, Sound preferences)
- Component-level state with React hooks
- No external state management library (Redux, MobX, etc.)

**Routing:**
- Custom view-based navigation system managed via `activeView` state
- Stack-based navigation for nested screens
- Bottom navigation bar for primary sections

**PWA Features:**
- Service worker with Workbox for caching strategies
- Offline support with fallback page
- App manifest for installability
- Push notifications via Firebase Cloud Messaging
- Install prompts and notification permission flows

### Backend Architecture

**Primary Backend: Supabase**
- PostgreSQL database for structured data
- Built-in authentication with session management
- Real-time subscriptions for live updates (groups, chat messages)
- Row-level security policies

**Data Models:**
- `profiles`: User accounts with wallet balances and verification status
- `groups`: Streaming subscription groups with member management
- `group_members`: Junction table for user-group relationships
- `chat_messages`: Real-time group chat history
- `wallet_transactions`: Financial transaction records
- `support_messages`: Customer support ticket system
- `advertisements`: Admin-managed promotional content

**Serverless Functions (Vercel):**
Located in `src/utils/*.js` - API endpoints for:
- Payment processing (PIX, Boleto generation via Mercado Pago)
- AI-powered features (image generation, content search via Gemini)
- Webhook handlers for payment notifications

**Authentication Flow:**
- Supabase Auth for user authentication
- Session-based with automatic token refresh
- Email/password authentication
- Profile creation on signup with default avatar and wallet

### External Dependencies

**Payment Integration: Mercado Pago**
- PIX instant payment generation
- Boleto (bank slip) generation with 3-day expiration
- Payment preference creation for checkout flows
- Webhook notifications for payment status updates
- **Configuration**: Requires `MP_ACCESS_TOKEN` environment variable

**Push Notifications: Firebase Cloud Messaging**
- Rich notifications with images and action buttons
- Service worker integration for background messages
- Token management and permission handling
- Notification types: Payment received, new group member, payment reminders
- **Configuration**: Firebase project credentials in `src/lib/firebase.ts`

**AI Services: Google Gemini API**
- AI-powered image generation for avatars
- Content search and recommendations
- Multimodal content understanding
- **Configuration**: Requires `GEMINI_API_KEY` environment variable

**Content Discovery: TMDB (The Movie Database) API**
- Movie and TV show metadata
- Network/provider-specific content discovery
- Poster images and backdrops
- Streaming availability information
- **Configuration**: API key hardcoded in constants (`TMDB_API_KEY`)

**CDN Resources:**
- Tailwind CSS (https://cdn.tailwindcss.com)
- Icons8 for default avatars and app icons
- Workbox CDN for service worker caching strategies

**Development Environment:**
- Replit-specific configuration for HMR over WebSockets
- Custom Vite config for Replit domain handling
- Port 5000 with host binding for cloud development

### Design Patterns

**Theme System:**
- Dark/light theme support via Context API
- Theme preference persisted to localStorage
- First-run theme selection modal
- Consistent color variables throughout components

**Lazy Loading:**
- Code splitting for all screen components
- Suspense boundaries with loading states
- Reduces initial bundle size

**Offline-First Approach:**
- Network-first strategy for navigation
- Stale-while-revalidate for static assets
- Cache-first for images
- Offline fallback page for network failures

**Real-time Updates:**
- Supabase real-time subscriptions for chat messages
- Polling fallback where real-time isn't critical
- Optimistic UI updates for better UX

**Error Handling:**
- Toast notifications for user-facing errors
- Console logging for debugging
- Graceful degradation when services unavailable

**Accessibility Considerations:**
- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly modals and dialogs