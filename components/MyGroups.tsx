import React from 'react';
import type { Group } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import GroupItem from './GroupItem';

interface MyGroupsProps {
    onViewGroupChat: (group: Group) => void;
    onViewMyGroupDetails: (group: Group) => void;
    groups: Group[];
    onViewAllGroups: () => void;
}

const MyGroups: React.FC<MyGroupsProps> = ({ onViewGroupChat, onViewMyGroupDetails, groups, onViewAllGroups }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${textColor}`}>Meus grupos</h3>
        <button onClick={onViewAllGroups} className="text-sm font-semibold text-purple-500 hover:text-purple-400">
          Ver todos
        </button>
      </div>
      <div className="space-y-4">
        {groups.slice(0, 2).map((group) => (
          <GroupItem key={group.id} group={group} onViewGroupChat={onViewGroupChat} onViewMyGroupDetails={onViewMyGroupDetails} />
        ))}
         {groups.length === 0 && (
            <div className={`text-center p-8 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Você ainda não participa de nenhum grupo.</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Explore e comece a economizar!</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default MyGroups;