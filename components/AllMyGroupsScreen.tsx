import React from 'react';
import type { Group } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import GroupItem from './GroupItem';
import { ArrowLeftIcon } from './Icons';

interface AllMyGroupsScreenProps {
    groups: Group[];
    onViewGroupChat: (group: Group) => void;
    onViewMyGroupDetails: (group: Group) => void;
    onBack: () => void;
}

const Header: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4 border-b ${borderColor}`}>
            <div className="relative flex justify-center items-center w-full h-8">
                <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                    <ArrowLeftIcon className={`w-6 h-6 ${textColor}`} />
                </button>
                <h1 className={`text-xl font-bold ${textColor}`}>Meus Grupos</h1>
            </div>
        </header>
    );
};

const AllMyGroupsScreen: React.FC<AllMyGroupsScreenProps> = ({ groups, onViewGroupChat, onViewMyGroupDetails, onBack }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? "bg-[#10081C]" : "bg-[#F8F9FA]";

    return (
        <div className={`${mainBg} min-h-screen`}>
            <Header onBack={onBack} />
            <main className="p-4 space-y-4">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <GroupItem 
                            key={group.id} 
                            group={group} 
                            onViewGroupChat={onViewGroupChat} 
                            onViewMyGroupDetails={onViewMyGroupDetails} 
                        />
                    ))
                ) : (
                    <div className={`text-center p-12 mt-10 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Você ainda não participa de nenhum grupo.</p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Explore e comece a economizar!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllMyGroupsScreen;
