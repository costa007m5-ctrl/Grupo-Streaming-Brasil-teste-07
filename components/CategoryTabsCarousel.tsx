import React, { useState } from 'react';
import type { ExploreDetailItem } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface Category {
  id: string;
  title: string;
}

interface CategoryTabsCarouselProps {
  categories: Category[];
  onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const CategoryTabsCarousel: React.FC<CategoryTabsCarouselProps> = ({ categories, onSelectExploreItem }) => {
  const [activeId, setActiveId] = useState('');
  const { theme } = useTheme();

  const handleClick = (id: string) => {
    setActiveId(id);
    onSelectExploreItem({ type: 'category', id });
  };

  return (
    <section className="py-4">
      <div className="flex space-x-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-red-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.title}
            </button>
          );
        })}
      </div>
       <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
    </section>
  );
};

export default CategoryTabsCarousel;