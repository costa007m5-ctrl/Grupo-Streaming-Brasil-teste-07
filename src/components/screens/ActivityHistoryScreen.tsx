import React from 'react';
import { ArrowLeftIcon } from '../ui/Icons';
import { ACTIVITY_HISTORY_DATA } from '../../utils';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Histórico de Atividades</h1>
        </div>
    </header>
);

const ActivityItem: React.FC<{ item: typeof ACTIVITY_HISTORY_DATA[0] }> = ({ item }) => (
    <div className="flex items-start p-4 space-x-4">
        <div className="mt-1 w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
            <item.icon className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{item.description}</p>
            <p className="text-sm text-gray-500">{item.timestamp}</p>
            {item.details && <p className="text-xs text-gray-400 mt-0.5">{item.details}</p>}
        </div>
    </div>
);

const ActivityHistoryScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                    {ACTIVITY_HISTORY_DATA.map(activity => <ActivityItem key={activity.id} item={activity} />)}
                </div>
            </main>
        </div>
    );
};

export default ActivityHistoryScreen;
