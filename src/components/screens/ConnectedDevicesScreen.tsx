import React from 'react';
import { ArrowLeftIcon } from '../ui/Icons';
import { CONNECTED_DEVICES_DATA } from '../../utils';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Dispositivos Conectados</h1>
        </div>
    </header>
);

const DeviceItem: React.FC<{ item: typeof CONNECTED_DEVICES_DATA[0] }> = ({ item }) => (
    <div className="flex items-center p-4 space-x-4">
        <item.icon className="w-8 h-8 flex-shrink-0 text-gray-500" />
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{item.device} {item.isCurrent && <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full ml-2">Sessão atual</span>}</p>
            <p className="text-sm text-gray-500">{item.location} • {item.lastActive}</p>
        </div>
        {!item.isCurrent && (
            <button className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">Desconectar</button>
        )}
    </div>
);

const ConnectedDevicesScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                    {CONNECTED_DEVICES_DATA.map(device => <DeviceItem key={device.id} item={device} />)}
                </div>
                <div className="text-center">
                     <button className="w-full text-center py-4 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors text-base">
                        Sair de todos os dispositivos
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ConnectedDevicesScreen;
