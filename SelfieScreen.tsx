import React from 'react';
import { ArrowLeftIcon, ArrowUpOnSquareIcon, CameraIcon } from './Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Selfie de Segurança</h1>
        </div>
    </header>
);

const SelfieScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {

    const handleSave = () => {
        alert('Selfie enviada para análise!');
        onBack();
    };
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 text-center">Tire uma selfie segurando seu documento</h3>
                    <div className="flex justify-center">
                         <div className="w-48 h-64 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500">
                            <CameraIcon className="w-12 h-12 mb-2" />
                            <p className="text-sm font-medium">Pré-visualização da câmera</p>
                        </div>
                    </div>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Remova óculos, chapéus ou qualquer acessório.</li>
                        <li>Procure um local bem iluminado.</li>
                        <li>Centralize seu rosto e o documento na câmera.</li>
                    </ul>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <ArrowUpOnSquareIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="font-semibold text-gray-700">Enviar sua selfie</p>
                        <p className="text-sm text-gray-500">Toque para enviar o arquivo</p>
                    </div>
                </div>
                 <button 
                    onClick={handleSave}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors">
                    Enviar para Análise
                </button>
            </main>
        </div>
    );
};

export default SelfieScreen;
