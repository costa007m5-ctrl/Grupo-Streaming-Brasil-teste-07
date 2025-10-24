import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowUpRightIcon, PlusIcon } from './Icons';
import type { NewGroupDetails } from '../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Credenciais e Regras</h1>
        </div>
    </header>
);

const ServiceInfo: React.FC<{ groupDetails: NewGroupDetails }> = ({ groupDetails }) => (
    <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
        <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center p-2"
            style={{ backgroundColor: groupDetails.service.bgColor || '#f3f4f6' }}
        >
            <img src={groupDetails.service.logoUrl} alt={`${groupDetails.service.name} logo`} className="w-full h-full object-contain" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">Configurando grupo de</p>
            <p className="font-bold text-gray-800 text-xl">{groupDetails.name}</p>
        </div>
    </div>
);

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, id, type = "text", value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
    </div>
);

const RuleInput: React.FC<{ rule: string; onChange: (value: string) => void; onRemove: () => void; placeholder: string; }> = ({ rule, onChange, onRemove, placeholder }) => (
    <div className="flex items-center space-x-2">
        <input
            type="text"
            value={rule}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-grow bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button onClick={onRemove} className="text-red-500 font-semibold p-2">Remover</button>
    </div>
);


interface GroupCredentialsScreenProps {
    onBack: () => void;
    onFinish: (data: { credentials: { email: string; password?: string }, rules: string[] }) => void;
    groupDetails: NewGroupDetails;
}

const GroupCredentialsScreen: React.FC<GroupCredentialsScreenProps> = ({ onBack, onFinish, groupDetails }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [rules, setRules] = useState([
        'Não compartilhar credenciais fora do grupo',
        'Respeitar limite de telas simultâneas',
        `Pagamento até o dia ${groupDetails.paymentDay} de cada mês`,
    ]);

    const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    const handleRuleChange = (index: number, value: string) => {
        const newRules = [...rules];
        newRules[index] = value;
        setRules(newRules);
    };

    const addRule = () => setRules([...rules, '']);
    const removeRule = (index: number) => setRules(rules.filter((_, i) => i !== index));

    const handleFinish = () => {
        if (!credentials.email.trim() || !credentials.password.trim()) {
            alert('Por favor, preencha o e-mail e a senha.');
            return;
        }
        onFinish({ credentials, rules });
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <ServiceInfo groupDetails={groupDetails} />

                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Credenciais de Acesso</h3>
                    <FormInput label="E-mail ou usuário" id="email" value={credentials.email} onChange={handleCredentialChange} placeholder="email@exemplo.com" />
                    <FormInput label="Senha" id="password" type="password" value={credentials.password} onChange={handleCredentialChange} placeholder="••••••••" />
                    
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <p className="text-sm text-yellow-800">Ainda não tem uma assinatura?</p>
                        <a 
                            href={groupDetails.service.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-yellow-900 inline-flex items-center space-x-1"
                        >
                            <span>Assinar {groupDetails.service.name} Agora</span>
                            <ArrowUpRightIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Regras do Grupo</h3>
                    <div className="space-y-3">
                    {rules.map((rule, index) => (
                        <RuleInput 
                            key={index}
                            rule={rule} 
                            onChange={(value) => handleRuleChange(index, value)}
                            onRemove={() => removeRule(index)}
                            placeholder={`Ex: Respeitar os perfis`}
                        />
                    ))}
                    </div>
                     <button onClick={addRule} className="flex items-center space-x-2 text-purple-600 font-semibold p-2">
                        <PlusIcon className="w-5 h-5" />
                        <span>Adicionar nova regra</span>
                    </button>
                </div>

                <button 
                    onClick={handleFinish}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
                    Finalizar e Publicar Grupo
                </button>
            </main>
        </div>
    );
};

export default GroupCredentialsScreen;