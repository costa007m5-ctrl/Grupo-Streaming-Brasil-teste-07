import React, { useMemo } from 'react';
import type { Group, Profile } from '../../types';
import { UsersIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface RecommendedGroupsProps {
    groups: Group[];
    myGroups: Group[];
    profile: Profile | null;
    onSelectGroup: (group: Group) => void;
}

const RecommendedGroupCard: React.FC<{ group: Group, onSelect: () => void }> = ({ group, onSelect }) => {
    const { theme } = useTheme();
    return (
        <button onClick={onSelect} className={`flex-shrink-0 w-40 rounded-2xl shadow-md overflow-hidden border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100/50'}`}>
            <div className={`h-20 flex items-center justify-center p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <img src={group.logo} alt={`${group.name} logo`} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="p-3 text-left space-y-2">
                <h3 className={`font-bold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{group.name}</h3>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-purple-600">R${group.price.toFixed(2).replace('.',',')}</p>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <UsersIcon className="w-3 h-3"/>
                        <span>{group.members}/{group.max_members}</span>
                    </div>
                </div>
            </div>
        </button>
    );
};


const RecommendedGroups: React.FC<RecommendedGroupsProps> = ({ groups, myGroups, profile, onSelectGroup }) => {
    const { theme } = useTheme();
    
    const recommendedGroups = useMemo(() => {
        if (!profile || !groups.length) return [];
        
        // 1. Get service names from user's current groups
        const userGroupNames = myGroups.map(g => g.name.split(' ')[0]);
        const userGroupIds = myGroups.map(g => g.id);

        // 2. Find groups of similar services that the user is not in
        const interestBasedRecs = groups.filter(group => 
            userGroupNames.some(name => group.name.includes(name)) && // Matches service name
            !userGroupIds.includes(group.id) &&                       // Not already a member
            group.host_id !== profile.id &&                           // Not hosted by user
            group.members < group.max_members                         // Has open slots
        );

        // 3. Find some popular/discovery groups as fallback
        const discoveryRecs = groups.filter(group => 
            !userGroupIds.includes(group.id) &&
            group.host_id !== profile.id &&
            group.members < group.max_members
        );
        
        // 4. Combine, remove duplicates, and take the top results
        const combined = [...interestBasedRecs, ...discoveryRecs];
        const uniqueRecs = Array.from(new Map(combined.map(item => [item.id, item])).values());

        return uniqueRecs.slice(0, 10);

    }, [groups, myGroups, profile]);

    if (recommendedGroups.length === 0) {
        return null;
    }

    return (
        <section className="py-4">
            <h2 className={`text-xl font-bold mb-4 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Recomendados para Você</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
                {recommendedGroups.map((group) => (
                    <RecommendedGroupCard key={group.id} group={group} onSelect={() => onSelectGroup(group)} />
                ))}
                <div className="flex-shrink-0 w-1"></div>
            </div>
             <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default RecommendedGroups;