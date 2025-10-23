import React from 'react';
import { ArrowLeftIcon, ArrowUpOnSquareIcon } from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Documento de Identidade</h1>
        </div>
    </header>
);

const UploadBox: React.FC<{ label: string }> = ({ label }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
        <ArrowUpOnSquareIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">Toque para enviar o arquivo</p>
    </div>
);

const DocumentUploadScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {

    const handleSave = () => {
        alert('Documentos enviados para análise!');
        onBack();
    };
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Envie seu documento (RG ou CNH)</h3>
                    <p className="text-sm text-gray-600">Certifique-se de que a foto está bem iluminada, nítida e com todos os dados legíveis.</p>
                    <div className="space-y-4">
                        <UploadBox label="Frente do Documento" />
                        <UploadBox label="Verso do Documento" />
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

export default DocumentUploadScreen;
