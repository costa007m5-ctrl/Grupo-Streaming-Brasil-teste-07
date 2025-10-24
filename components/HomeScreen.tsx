import React from 'react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import QuickActions from './QuickActions';
import MyGroups from './MyGroups';
import RecentActivity from './RecentActivity';
import type { Group, Profile } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HomeScreenProps {
    onViewGroupChat: (group: Group) => void;
    onViewMyGroupDetails: (group: Group) => void;
    groups: Group[];
    profile: Profile | null;
    onOpenDevMenu: () => void;
    onNavigateToExplore: () => void;
    onNavigateToWallet: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSupport: () => void;
    onNavigateToAddMoney: () => void;
    onEnterAdminMode: () => void;
    notificationCount: number;
    onNotificationClick: () => void;
    onViewAllGroups: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    const { onViewGroupChat, onViewMyGroupDetails, groups, profile, onOpenDevMenu, onNavigateToExplore, onNavigateToWallet, onNavigateToProfile, onNavigateToSupport, onNavigateToAddMoney, onEnterAdminMode, notificationCount, onNotificationClick, onViewAllGroups } = props;
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? "bg-[#10081C]" : "bg-[#F8F9FA]";
    
  return (
    <div className={`${mainBg} min-h-screen`}>
      <Header profile={profile} onOpenDevMenu={onOpenDevMenu} onEnterAdminMode={onEnterAdminMode} notificationCount={notificationCount} onNotificationClick={onNotificationClick} />
      <main className="p-4 sm:p-6 space-y-8">
        <BalanceCard profile={profile} onAddMoney={onNavigateToAddMoney} />
        <QuickActions onNavigateToExplore={onNavigateToExplore} onNavigateToWallet={onNavigateToWallet} onNavigateToProfile={onNavigateToProfile} onNavigateToSupport={onNavigateToSupport} />
        <MyGroups onViewGroupChat={onViewGroupChat} onViewMyGroupDetails={onViewMyGroupDetails} groups={groups} onViewAllGroups={onViewAllGroups} />
        <RecentActivity />
      </main>
    </div>
  );
};

export default HomeScreen;