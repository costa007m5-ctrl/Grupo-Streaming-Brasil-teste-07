import React from 'react';
import { ArrowLeftIcon, ArrowDownTrayIcon, TrashIcon } from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Dados Pessoais</h1>
        </div>
    </header>
);

const ActionCard: React.FC<{ icon: React.ComponentType<{className?: string}>, title: string, description: string, onClick: () => void, isDanger?: boolean }> = ({ icon: Icon, title, description, onClick, isDanger }) => (
    <button onClick={onClick} className={`w-full text-left bg-white rounded-xl shadow-sm p-4 flex items-start space-x-4 transition-colors ${isDanger ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}>
        <Icon className={`w-8 h-8 flex-shrink-0 mt-1 ${isDanger ? 'text-red-500' : 'text-purple-600'}`} />
        <div>
            <h3 className={`font-bold text-lg ${isDanger ? 'text-red-700' : 'text-gray-800'}`}>{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </button>
);

const PersonalDataScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-4">
                <ActionCard 
                    icon={ArrowDownTrayIcon} 
                    title="Baixar seus dados" 
                    description="Receba um arquivo com todas as suas informações de perfil, atividades e grupos." 
                    onClick={() => alert('Sua solicitação de download foi recebida. O arquivo será enviado para o seu e-mail em até 24 horas.')} 
                />
                <ActionCard 
                    icon={TrashIcon} 
                    title="Excluir sua conta" 
                    description="Esta ação é permanente e removerá todos os seus dados da plataforma." 
                    onClick={() => alert('Para sua segurança, a exclusão de conta deve ser solicitada através do suporte.')} 
                    isDanger 
                />
            </main>
        </div>
    );
};

export default PersonalDataScreen;
