import React from 'react';
import type { Group } from '../types';
import { ChatBubbleOvalLeftEllipsisIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface GroupItemProps {
  group: Group;
  onViewGroupChat: (group: Group) => void;
  onViewMyGroupDetails: (group: Group) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onViewGroupChat, onViewMyGroupDetails }) => {
  const { theme } = useTheme();
  const { logo, name, price, members, max_members, next_payment_date } = group;
  const progress = (members / max_members) * 100;

  const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const progressBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const hoverBorderColor = theme === 'dark' ? 'hover:border-purple-500/50' : 'hover:border-purple-300';
  const logoBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100';


  return (
    <button onClick={() => onViewMyGroupDetails(group)} className={`w-full text-left p-4 ${cardBg} rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 space-y-4 border ${borderColor} ${hoverBorderColor} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${logoBg} rounded-xl flex items-center justify-center overflow-hidden border ${borderColor}`}>
            <img src={logo} alt={name} className="object-contain w-9 h-9" />
          </div>
          <div>
            <p className={`font-semibold ${textColor}`}>{name}</p>
            <p className={`text-sm ${subTextColor}`}>Próx. pgto: {next_payment_date}</p>
          </div>
        </div>
        <div className="text-right">
            <p className={`font-bold ${textColor} text-lg`}>R$ {price.toFixed(2).replace('.', ',')}</p>
            <p className={`text-xs ${subTextColor}`}>/mês</p>
        </div>
      </div>
      
      <div>
        <div className={`flex justify-between items-center text-xs ${subTextColor} mb-1`}>
          <span>Membros</span>
          <span className={`font-medium ${textColor}`}>{members}/{max_members}</span>
        </div>
        <div className={`w-full ${progressBg} rounded-full h-2.5`}>
          <div className="bg-gradient-to-r from-purple-500 to-red-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className={`border-t ${borderColor} pt-3 flex justify-between items-center`}>
        <div className="flex items-center space-x-3">
            <img src={group.members_list[0]?.avatarUrl || 'https://img.icons8.com/color/96/yoda.png'} alt={`Anfitrião: ${group.host_name}`} className="w-9 h-9 rounded-full" />
            <div>
                <p className={`text-xs ${subTextColor}`}>Anfitrião</p>
                <p className={`text-sm font-semibold ${textColor}`}>{group.host_name}</p>
            </div>
        </div>
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onViewGroupChat(group);
            }} 
            className="flex items-center justify-center space-x-2 bg-purple-600/20 text-purple-400 font-semibold py-2.5 px-5 rounded-lg hover:bg-purple-600/30 transition-colors"
            aria-label={`Abrir chat do grupo ${name}`}
        >
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
            <span>Chat</span>
        </button>
      </div>
    </button>
  );
};

interface MyGroupsProps {
    onViewGroupChat: (group: Group) => void;
    onViewMyGroupDetails: (group: Group) => void;
    groups: Group[];
}

const MyGroups: React.FC<MyGroupsProps> = ({ onViewGroupChat, onViewMyGroupDetails, groups }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${textColor}`}>Meus grupos</h3>
        <a href="#" className="text-sm font-semibold text-purple-500 hover:text-purple-400">
          Ver todos
        </a>
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