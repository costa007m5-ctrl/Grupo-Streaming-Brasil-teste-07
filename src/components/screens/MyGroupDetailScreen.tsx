import React, { useState } from 'react';
import type { Group, GroupMember, GroupRule } from '../../types';
import {
    ArrowLeftIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    DocumentDuplicateIcon,
    EyeIcon,
    EyeSlashIcon,
    UserCircleIcon,
    ArrowLeftOnRectangleIcon,
    ClockIcon,
    UsersIcon,
    BanknotesIcon,
    FlagIcon
} from '../ui/Icons';
import ReportGroupModal from '../modals/ReportGroupModal';

const Header: React.FC<{ group: Group, onBack: () => void }> = ({ group, onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <img src={group.logo} alt={group.name} className="object-contain w-full h-full p-1" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{group.name}</h1>
        </div>
    </header>
);

const InfoCards: React.FC<{ group: Group }> = ({ group }) => (
    <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm flex items-start space-x-2">
            <BanknotesIcon className="w-7 h-7 text-green-500 mt-0.5" />
            <div>
                <p className="text-xs text-gray-500">Seu Preço</p>
                <p className="font-bold text-gray-800">R$ {group.price.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm flex items-start space-x-2">
            <UsersIcon className="w-7 h-7 text-blue-500 mt-0.5" />
            <div>
                <p className="text-xs text-gray-500">Membros</p>
                <p className="font-bold text-gray-800">{group.members}/{group.max_members}</p>
            </div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm flex items-start space-x-2 col-span-2">
            <ClockIcon className="w-7 h-7 text-red-500 mt-0.5" />
            <div>
                <p className="text-xs text-gray-500">Próximo pagamento</p>
                <p className="font-bold text-gray-800">{group.next_payment_date}</p>
            </div>
        </div>
    </div>
);

const Credentials: React.FC<{ credentials: Group['credentials'] }> = ({ credentials }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = (text: string) => {
        if (copySuccess) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
             setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 relative">
             {copySuccess && (
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                    {copySuccess}
                </div>
            )}
            <h3 className="font-bold text-lg text-gray-800">Credenciais de Acesso</h3>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500">Email / Usuário</p>
                    <p className="font-semibold text-gray-700">{credentials.email}</p>
                </div>
                <button onClick={() => handleCopy(credentials.email)} className="p-2 text-gray-500 hover:text-purple-600">
                    <DocumentDuplicateIcon className="w-5 h-5"/>
                </button>
            </div>
            {credentials.password && (
                 <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                        <p className="text-xs text-gray-500">Senha</p>
                        <p className="font-semibold text-gray-700">{showPassword ? credentials.password : '••••••••'}</p>
                    </div>
                    <button onClick={() => setShowPassword(!showPassword)} className="p-2 text-gray-500 hover:text-purple-600">
                        {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                    </button>
                </div>
            )}
        </div>
    );
};

const MemberItem: React.FC<{ member: GroupMember }> = ({ member }) => (
    <div className="flex items-center space-x-3">
        {member.avatarUrl ? (
            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
        ) : (
            <UserCircleIcon className="w-10 h-10 text-gray-300" />
        )}
        <div>
            <p className="font-medium text-gray-800">{member.name}</p>
            <p className="text-sm text-gray-500">{member.role}</p>
        </div>
    </div>
);

const MembersList: React.FC<{ members: GroupMember[] }> = ({ members }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="font-bold text-lg text-gray-800">Membros do Grupo</h3>
        <div className="space-y-3">
            {members.map((member, index) => <MemberItem key={index} member={member} />)}
        </div>
    </div>
);

const RulesList: React.FC<{ rules: GroupRule[] }> = ({ rules }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="font-bold text-lg text-gray-800">Regras do Grupo</h3>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
            {rules.map(rule => <li key={rule.id}>{rule.text}</li>)}
        </ul>
    </div>
);

const GroupActions: React.FC<{ onGoToChat: () => void; onReport: () => void; }> = ({ onGoToChat, onReport }) => (
    <div className="space-y-3">
        <button onClick={onGoToChat} className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
            <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
            <span>Ir para o Chat</span>
        </button>
         <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-base hover:bg-gray-300 transition-colors">
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                <span>Sair</span>
            </button>
            <button onClick={onReport} className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-700 font-bold py-3 rounded-xl text-base hover:bg-red-100 transition-colors">
                <FlagIcon className="w-6 h-6" />
                <span>Denunciar</span>
            </button>
        </div>
    </div>
);


const MyGroupDetailScreen: React.FC<{ group: Group; onBack: () => void; onGoToChat: (group: Group) => void; }> = ({ group, onBack, onGoToChat }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header group={group} onBack={onBack} />
            <main className="p-4 pt-2 space-y-4">
                <InfoCards group={group} />
                <Credentials credentials={group.credentials} />
                <MembersList members={group.members_list} />
                <RulesList rules={group.rules} />
                <GroupActions onGoToChat={() => onGoToChat(group)} onReport={() => setIsReportModalOpen(true)} />
            </main>

            <ReportGroupModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                group={group}
            />
        </div>
    );
};

export default MyGroupDetailScreen;
