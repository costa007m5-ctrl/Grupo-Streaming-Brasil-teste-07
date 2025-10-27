import React from 'react';
import { ArrowLeftIcon, StarIcon, PencilSquareIcon } from './Icons';
import { MY_REVIEWS_DATA } from '../constants';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Minhas Avaliações</h1>
        </div>
    </header>
);

const ReviewCard: React.FC<{ review: typeof MY_REVIEWS_DATA[0] }> = ({ review }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                    <img src={review.logo} alt={review.serviceName} className="object-contain w-full h-full p-1.5" />
                </div>
                <div>
                    <p className="font-bold text-gray-800">{review.serviceName}</p>
                    <p className="text-sm text-gray-500">Anfitrião: {review.hostName}</p>
                </div>
            </div>
            <p className="text-xs text-gray-400">{review.date}</p>
        </div>
        <div className="flex items-center space-x-1 my-3">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} solid />
            ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
         <div className="border-t border-gray-100 mt-3 pt-3">
             <button className="flex items-center space-x-1.5 text-sm font-semibold text-purple-600">
                <PencilSquareIcon className="w-4 h-4" />
                <span>Editar avaliação</span>
             </button>
        </div>
    </div>
);


const MyReviewsScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-4">
                {MY_REVIEWS_DATA.map(review => <ReviewCard key={review.id} review={review} />)}
            </main>
        </div>
    );
};

export default MyReviewsScreen;
