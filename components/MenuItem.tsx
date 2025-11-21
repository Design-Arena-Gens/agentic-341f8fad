'use client';

import { MenuItem as MenuItemType } from '@/utils/mockData';
import { Plus, Star, Clock } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
      quantity: 1,
      image: item.image,
    });
  };

  const finalPrice = item.discount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized
        />
        {item.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {item.discount}% OFF
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{item.nameAr}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Stats */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 fill-yellow-400" size={14} />
            <span>{item.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{item.preparationTime} min</span>
          </div>
          <div>
            <span>{item.orderCount} orders</span>
          </div>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <div>
            {item.discount ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  {finalPrice.toFixed(2)} SAR
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {item.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">
                {item.price.toFixed(2)} SAR
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
