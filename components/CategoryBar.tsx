'use client';

import { categories } from '@/utils/mockData';
import { useState } from 'react';

export default function CategoryBar() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="bg-white shadow-sm border-b sticky top-[72px] z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col items-center min-w-[80px] px-4 py-2 rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-2xl mb-1">🍽️</span>
            <span className="text-xs font-medium">All</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center min-w-[80px] px-4 py-2 rounded-lg transition ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
