import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from './Icons';
import type { Profile } from '../types';

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

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, id, type = "text", value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
        </div>
    </div>
);

interface PersonalInfoScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onSave: (data: { fullName: string; cpf: string; birthDate: string; }) => void;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ onBack, profile, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        birthDate: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.full_name || '',
                cpf: profile.cpf || '',
                birthDate: profile.birth_date || '',
            });
        }
    }, [profile]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <p className="text-sm text-gray-600">Insira suas informações exatamente como aparecem em seu documento oficial.</p>
                    <FormInput label="Nome completo" id="fullName" value={formData.fullName} onChange={handleChange} placeholder="Seu nome completo" />
                    <FormInput label="CPF" id="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                    <FormInput label="Data de nascimento" id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                 </div>
                 <button 
                    onClick={handleSave}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
                    Salvar e Continuar
                </button>
            </main>
        </div>
    );
};

export default PersonalInfoScreen;