import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Endereço</h1>
        </div>
    </header>
);

const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; className?: string; }> = ({ label, id, value, onChange, placeholder, className }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
    </div>
);

interface AddressScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onSave: (address: any) => void;
}

const AddressScreen: React.FC<AddressScreenProps> = ({ onBack, profile, onSave }) => {
    const [address, setAddress] = useState({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        if (profile) {
            setAddress({
                cep: profile.cep || '',
                street: profile.street || '',
                number: profile.number || '',
                complement: profile.complement || '',
                neighborhood: profile.neighborhood || '',
                city: profile.city || '',
                state: profile.state || '',
            });
        }
    }, [profile]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.id]: e.target.value });
    };

    const handleSave = () => {
        onSave(address);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <p className="text-sm text-gray-600">Precisamos do seu endereço para fins de segurança e verificação.</p>
                    <FormInput label="CEP" id="cep" value={address.cep} onChange={handleChange} placeholder="00000-000" />
                    <FormInput label="Rua" id="street" value={address.street} onChange={handleChange} placeholder="Sua rua" />
                    <div className="flex space-x-4">
                        <FormInput label="Número" id="number" value={address.number} onChange={handleChange} placeholder="123" className="w-1/3" />
                        <FormInput label="Complemento" id="complement" value={address.complement} onChange={handleChange} placeholder="Apto, Bloco" className="w-2/3" />
                    </div>
                    <FormInput label="Bairro" id="neighborhood" value={address.neighborhood} onChange={handleChange} placeholder="Seu bairro" />
                    <div className="flex space-x-4">
                        <FormInput label="Cidade" id="city" value={address.city} onChange={handleChange} placeholder="Sua cidade" className="w-2/3" />
                        <FormInput label="Estado" id="state" value={address.state} onChange={handleChange} placeholder="UF" className="w-1/3" />
                    </div>
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

export default AddressScreen;