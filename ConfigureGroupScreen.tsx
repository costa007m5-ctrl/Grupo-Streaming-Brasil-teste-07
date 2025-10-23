import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, InformationCircleIcon } from './Icons';
import type { AvailableService, NewGroupDetails } from '../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Configurar Grupo</h1>
        </div>
    </header>
);

const ServiceInfo: React.FC<{ service: AvailableService }> = ({ service }) => (
    <div className="flex flex-col items-center space-y-3 bg-white p-4 rounded-xl shadow-sm">
        <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center p-2"
            style={{ backgroundColor: service.bgColor || '#f3f4f6' }}
        >
            <img src={service.logoUrl} alt={`${service.name} logo`} className="w-full h-full object-contain" />
        </div>
        <p className="font-bold text-gray-800 text-lg">Você está criando um grupo de {service.name}</p>
    </div>
);

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string | number; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; prefix?: string; readOnly?: boolean; info?: string }> = ({ label, id, type = "text", value, onChange, placeholder, prefix, readOnly, info }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{prefix}</span>}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${prefix ? 'pl-8' : ''} ${readOnly ? 'font-bold' : ''}`}
            />
            {info && <p className="text-xs text-gray-400 mt-1">{info}</p>}
        </div>
    </div>
);

const PriceInfo: React.FC<{ basePrice: number, fee: number, totalPrice: number }> = ({ basePrice, fee, totalPrice }) => (
    <div className="bg-purple-50 p-4 rounded-xl space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-purple-800">Valor original do serviço</span>
            <span className="font-medium text-purple-900">R$ {basePrice.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-purple-800">Taxa de serviço (10%)</span>
            <span className="font-medium text-purple-900">R$ {fee.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="border-t border-purple-200 my-1"></div>
        <div className="flex justify-between font-bold">
            <span className="text-purple-900">Preço Total da Assinatura</span>
            <span className="text-purple-900">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
    </div>
);

interface ConfigureGroupScreenProps {
    onBack: () => void;
    onContinue: (details: Omit<NewGroupDetails, 'service'>) => void;
    service: AvailableService;
}

const ConfigureGroupScreen: React.FC<ConfigureGroupScreenProps> = ({ onBack, onContinue, service }) => {
    const [groupName, setGroupName] = useState(`${service.name} Família`);
    const [slots, setSlots] = useState('4');
    const [paymentDay, setPaymentDay] = useState('15');
    const [pricePerSlot, setPricePerSlot] = useState(0);

    const basePrice = service.originalPrice;
    const systemFee = basePrice * 0.10;
    const totalPrice = basePrice + systemFee;

    useEffect(() => {
        const numSlots = parseInt(slots, 10);

        if (!isNaN(numSlots) && numSlots > 0) {
            setPricePerSlot(totalPrice / numSlots);
        } else {
            setPricePerSlot(0);
        }
    }, [totalPrice, slots]);

    const handleContinue = () => {
        onContinue({
            name: groupName,
            totalPrice,
            slots: parseInt(slots, 10),
            paymentDay: parseInt(paymentDay, 10),
            pricePerSlot,
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <ServiceInfo service={service} />
                
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <FormInput 
                        label="Nome do Grupo" 
                        id="groupName" 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Ex: Netflix Família"
                    />
                    
                    <PriceInfo basePrice={basePrice} fee={systemFee} totalPrice={totalPrice} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput 
                            label="Número de Vagas" 
                            id="slots" 
                            type="number"
                            value={slots} 
                            onChange={(e) => setSlots(e.target.value)}
                            placeholder="Total de membros"
                        />
                         <div >
                            <label htmlFor="pricePerSlot" className="block text-sm font-medium text-gray-700 mb-1">Preço por Vaga</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                                <input
                                    id="pricePerSlot"
                                    type="text"
                                    value={pricePerSlot.toFixed(2).replace('.', ',')}
                                    readOnly
                                    className="w-full bg-purple-50 border-gray-200 rounded-lg p-3 text-purple-700 font-bold text-center focus:ring-0 focus:border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                     <FormInput 
                        label="Data de Vencimento da Fatura" 
                        id="paymentDay"
                        type="number" 
                        value={paymentDay}
                        onChange={(e) => setPaymentDay(e.target.value)}
                        placeholder="Dia do mês"
                        info="O dia do mês que a fatura do serviço vence."
                    />
                </div>

                <div className="bg-blue-50 text-blue-900 p-4 rounded-xl flex items-start space-x-3">
                    <InformationCircleIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Próximo Passo: Credenciais</h3>
                        <p className="text-sm opacity-80">Após configurar, você precisará adicionar as credenciais de acesso ao serviço e definir as regras do grupo.</p>
                    </div>
                </div>

                <button 
                    onClick={handleContinue}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
                    Continuar
                </button>
            </main>
        </div>
    );
};

export default ConfigureGroupScreen;