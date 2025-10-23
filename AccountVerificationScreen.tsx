import React, { useEffect } from 'react';
import type { Profile } from '../types';
import { 
    ArrowLeftIcon,
    ShieldCheckIcon,
    ChevronRightIcon,
    UserIcon,
    MapPinIcon,
    IdentificationIcon,
    CameraIcon,
    DevicePhoneMobileIcon,
    CheckBadgeIcon
} from './Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Verificação de Conta</h1>
        </div>
    </header>
);

const VerificationStatusCard: React.FC<{ isVerified: boolean }> = ({ isVerified }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${isVerified ? 'bg-green-100' : 'bg-red-100'}`}>
                <ShieldCheckIcon className={`w-7 h-7 ${isVerified ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">Status da Conta</p>
                <p className={`font-bold text-lg ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {isVerified ? 'Verificado' : 'Não Verificado'}
                </p>
            </div>
        </div>
        <p className="text-sm text-gray-600">
            {isVerified
                ? 'Sua conta está verificada. Você tem acesso a todos os recursos da plataforma.'
                : 'Complete as etapas abaixo para verificar sua conta, aumentar seus limites e ter acesso a saques.'
            }
        </p>
    </div>
);


type StepStatus = 'Pendente' | 'Concluído' | 'Em Análise';

interface StepItemProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    status: StepStatus;
    onClick: () => void;
}

const StepItem: React.FC<StepItemProps> = ({ icon: Icon, title, status, onClick }) => {
    const statusStyles = {
        'Pendente': 'text-yellow-600 bg-yellow-100',
        'Concluído': 'text-green-600 bg-green-100',
        'Em Análise': 'text-blue-600 bg-blue-100',
    };
    
    const isCompleted = status === 'Concluído';

    return (
        <button 
            onClick={isCompleted ? undefined : onClick}
            className={`w-full flex items-center p-4 space-x-4 text-left ${!isCompleted ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}
        >
            <div className="w-11 h-11 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{title}</p>
                 <div className="flex items-center space-x-1.5 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[status]}`}>{status}</span>
                </div>
            </div>
            {isCompleted ? (
                <CheckBadgeIcon className="w-6 h-6 text-green-500" />
            ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            )}
        </button>
    );
};


interface AccountVerificationScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onNavigateToPersonalInfo: () => void;
    onNavigateToAddress: () => void;
    onNavigateToDocumentUpload: () => void;
    onNavigateToSelfie: () => void;
    onNavigateToPhoneVerification: () => void;
    successMessage?: string | null;
    onSuccessDismiss: () => void;
}

const AccountVerificationScreen: React.FC<AccountVerificationScreenProps> = (props) => {
    const { profile, successMessage, onSuccessDismiss } = props;

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                onSuccessDismiss();
            }, 4000); // Mensagem some após 4 segundos
            return () => clearTimeout(timer);
        }
    }, [successMessage, onSuccessDismiss]);

    const personalInfoStatus: StepStatus = (profile?.full_name && profile?.cpf && profile?.birth_date) ? 'Concluído' : 'Pendente';
    const addressStatus: StepStatus = (profile?.cep && profile?.street && profile?.number && profile?.city && profile?.state) ? 'Concluído' : 'Pendente';
    const phoneStatus: StepStatus = profile?.is_phone_verified ? 'Concluído' : 'Pendente';
    // Hardcoded statuses for unimplemented features
    const documentStatus: StepStatus = "Pendente";
    const selfieStatus: StepStatus = "Pendente";
    
    const allSteps: StepItemProps[] = [
        { icon: UserIcon, title: "Dados Pessoais", status: personalInfoStatus, onClick: props.onNavigateToPersonalInfo },
        { icon: MapPinIcon, title: "Endereço", status: addressStatus, onClick: props.onNavigateToAddress },
        { icon: IdentificationIcon, title: "Documento de Identidade", status: documentStatus, onClick: props.onNavigateToDocumentUpload },
        { icon: CameraIcon, title: "Selfie de Segurança", status: selfieStatus, onClick: props.onNavigateToSelfie },
        { icon: DevicePhoneMobileIcon, title: "Verificação de Celular", status: phoneStatus, onClick: props.onNavigateToPhoneVerification },
    ];
    
    const steps = allSteps.filter(step => step.title !== "Verificação de Celular");

    const isVerified = steps.every(step => step.status === 'Concluído');

    return (
        <div className="bg-gray-100 min-h-screen">
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
            <Header onBack={props.onBack} />
            <main className="p-4 pt-2 space-y-6">
                {successMessage && (
                    <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm flex items-center space-x-3 animate-fade-in-down">
                        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                        <span className="font-semibold">{successMessage}</span>
                    </div>
                )}
                <VerificationStatusCard isVerified={isVerified} />
                <div>
                    <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-2 px-2">Etapas de Verificação</h3>
                    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                        {steps.map(step => <StepItem key={step.title} {...step} />)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountVerificationScreen;