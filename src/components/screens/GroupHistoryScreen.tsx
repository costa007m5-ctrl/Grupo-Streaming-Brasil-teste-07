

import React, { useState } from 'react';
import { ArrowLeftIcon, ClockHistoryIcon } from '../ui/Icons';
import { GROUP_HISTORY_DATA } from '../../utils';
import type { Group } from '../../types';

type HistoryTab = 'active' | 'ended';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Histórico de Grupos</h1>
        </div>
    </header>
);

const HistoryTabs: React.FC<{ activeTab: HistoryTab, setActiveTab: (tab: HistoryTab) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs: { id: HistoryTab, label: string }[] = [
        { id: 'active', label: 'Grupos Ativos' },
        { id: 'ended', label: 'Grupos Encerrados' },
    ];
    
    return (
        <div className="bg-white px-4 pt-2">
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 text-center font-semibold w-full transition-all rounded-md text-sm ${activeTab === tab.id ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const GroupItem: React.FC<{ group: any, isEnded?: boolean }> = ({ group, isEnded }) => (
     <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          <img src={group.logo} alt={group.serviceName || group.name} className="object-contain w-full h-full p-1" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{group.serviceName || group.name}</p>
          <p className="text-sm text-gray-500">{isEnded ? group.period : `Próx. pgto: ${group.next_payment_date}`}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-medium ${isEnded ? 'text-gray-500' : 'text-green-600'}`}>
          {isEnded ? group.status : group.status}
        </span>
        <p className="text-xs text-gray-500">Anfitrião: {group.host_name || group.hostName || "Maria S."}</p>
      </div>
    </div>
);

// FIX: Add props interface for the component
interface GroupHistoryScreenProps {
    onBack: () => void;
    groups: Group[];
}

const GroupHistoryScreen: React.FC<GroupHistoryScreenProps> = ({ onBack, groups }) => {
    const [activeTab, setActiveTab] = useState<HistoryTab>('active');

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="p-4 pt-2 space-y-3">
                {activeTab === 'active' && groups.map(group => (
                    <GroupItem key={`active-${group.id}`} group={group} />
                ))}
                 {activeTab === 'ended' && GROUP_HISTORY_DATA.map(group => (
                    <GroupItem key={`ended-${group.id}`} group={group} isEnded />
                ))}

                 {activeTab === 'ended' && GROUP_HISTORY_DATA.length === 0 && (
                    <div className="text-center py-10">
                        <ClockHistoryIcon className="w-12 h-12 mx-auto text-gray-300"/>
                        <p className="mt-2 font-semibold text-gray-600">Nenhum grupo encerrado</p>
                        <p className="text-sm text-gray-400">Seu histórico de grupos antigos aparecerá aqui.</p>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default GroupHistoryScreen;