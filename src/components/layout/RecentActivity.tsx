
import React from 'react';
import type { Activity } from '../../types';
import { RECENT_ACTIVITY_DATA } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
    const { theme } = useTheme();
    const { icon: Icon, logo, description, timestamp, amount } = activity;
    
    const logoBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const amountColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
                <div className={`w-11 h-11 ${logoBg} rounded-full flex items-center justify-center overflow-hidden border ${borderColor}`}>
                    {logo ? (
                        <img src={logo} alt={description} className="object-contain w-8 h-8" />
                    ) : Icon ? (
                        <Icon className="w-6 h-6" />
                    ) : (
                         <div className="w-10 h-10" />
                    )}
                </div>
                <div>
                    <p className={`font-semibold ${textColor}`}>{description}</p>
                    <p className={`text-sm ${subTextColor}`}>{timestamp}</p>
                </div>
            </div>
            {amount !== null && (
                <p className={`font-bold text-base ${amount < 0 ? amountColor : 'text-green-500'}`}>
                    {amount < 0 ? '−' : '+'}R$ {Math.abs(amount).toFixed(2).replace('.', ',')}
                </p>
            )}
        </div>
    );
};


const RecentActivity: React.FC = () => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const divideColor = theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100';

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${textColor}`}>Atividade recente</h3>
        <a href="#" className="text-sm font-semibold text-purple-500 hover:text-purple-400">
          Ver tudo
        </a>
      </div>
      <div className={`${cardBg} rounded-2xl ${divideColor} border ${borderColor} divide-y shadow-sm`}>
        {RECENT_ACTIVITY_DATA.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
};

export default RecentActivity;
