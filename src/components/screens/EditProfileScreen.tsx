import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, CameraIcon, CheckBadgeIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const EditProfileHeader: React.FC<{ onBack: () => void; onSave: () => void; }> = ({ onBack, onSave }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Editar Perfil</h1>
            <button onClick={onSave} className="absolute right-0 p-2 -mr-2 text-purple-600 font-semibold">
                Salvar
            </button>
        </div>
    </header>
);

const ProfilePictureEditor: React.FC<{ profile: Profile | null; onClick: () => void; }> = ({ profile, onClick }) => (
    <div className="flex flex-col items-center py-6">
        <button onClick={onClick} className="relative group">
            <img 
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover group-hover:opacity-80 transition-opacity" 
                src={profile?.avatar_url || 'https://img.icons8.com/color/96/yoda.png'}
                alt={profile?.full_name || 'Usuário'} 
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon className="w-8 h-8 text-white" />
            </div>
        </button>
    </div>
);

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; readOnly?: boolean; verified?: boolean; }> = ({ label, id, type = "text", value, onChange, placeholder, readOnly, verified }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
            {verified && (
                <div className="absolute inset-y-0 right-3 flex items-center text-sm text-green-600">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-1" />
                    Verificado
                </div>
            )}
        </div>
    </div>
);

interface EditProfileScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onSave: (data: { name: string; phone: string; birthDate: string; }) => void;
    onNavigateToChangeAvatar: () => void;
    email?: string;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, profile, onSave, onNavigateToChangeAvatar, email }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.full_name || '',
                email: email || '',
                phone: profile.phone || '',
                birthDate: profile.birth_date || '',
            });
        }
    }, [profile, email]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSave = () => {
        onSave({
            name: formData.name,
            phone: formData.phone,
            birthDate: formData.birthDate,
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <EditProfileHeader onBack={onBack} onSave={handleSave} />
            <main className="p-4 space-y-6">
                <ProfilePictureEditor profile={profile} onClick={onNavigateToChangeAvatar} />
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                     <FormInput
                        label="Nome completo"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <FormInput
                        label="E-mail"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly
                        verified
                    />
                    <FormInput
                        label="Telefone"
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(99) 99999-9999"
                    />
                    <FormInput
                        label="Data de nascimento"
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                    />
                </div>
                <button 
                    onClick={handleSave}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
                    Salvar Alterações
                </button>
            </main>
        </div>
    );
};

export default EditProfileScreen;