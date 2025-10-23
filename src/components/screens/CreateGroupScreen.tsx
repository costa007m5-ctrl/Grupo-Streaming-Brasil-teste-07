import React, { useState } from 'react';
import { ArrowLeftIcon, SearchIcon } from '../ui/Icons';
import type { AvailableService } from '../../types';
import { AVAILABLE_SERVICES_DATA } from '../../utils';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Criar Novo Grupo</h1>
        </div>
    </header>
);

const SearchBar: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => (
    <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar serviço..."
            className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
        />
    </div>
);

const ServiceCard: React.FC<{ service: AvailableService; onSelect: () => void; }> = ({ service, onSelect }) => (
    <button onClick={onSelect} className="flex flex-col items-center justify-center space-y-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-purple-500 hover:shadow-md transition-all">
        <div 
            className="w-20 h-20 rounded-xl flex items-center justify-center p-2"
            style={{ backgroundColor: service.bgColor || '#f3f4f6' }}
        >
            <img src={service.logoUrl} alt={`${service.name} logo`} className="w-full h-full object-contain" />
        </div>
        <p className="font-semibold text-gray-800 text-sm text-center">{service.name}</p>
    </button>
);

interface CreateGroupScreenProps {
    onBack: () => void;
    onSelectService: (service: AvailableService) => void;
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ onBack, onSelectService }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = AVAILABLE_SERVICES_DATA.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedServices = filteredServices.reduce((acc, service) => {
        const category = service.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<AvailableService['category'], AvailableService[]>);

    const categoryOrder: AvailableService['category'][] = ['movie', 'tv', 'music'];
    const categoryTitles: Record<AvailableService['category'], string> = {
        movie: 'Filmes e Séries',
        tv: 'Canais de TV',
        music: 'Música'
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 space-y-4">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                <div className="space-y-6">
                    {categoryOrder.map(category => {
                        const services = groupedServices[category];
                        if (services && services.length > 0) {
                            return (
                                <div key={category}>
                                    <h2 className="text-lg font-bold text-gray-800 mb-2">{categoryTitles[category]}</h2>
                                    <div className="grid grid-cols-3 gap-3">
                                        {services.map(service => (
                                            <ServiceCard 
                                                key={service.id} 
                                                service={service} 
                                                onSelect={() => onSelectService(service)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </main>
        </div>
    );
};

export default CreateGroupScreen;