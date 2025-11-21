'use client';

import { menuItems, offers } from '@/utils/mockData';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import MenuItem from '@/components/MenuItem';
import { Sparkles, Tag, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const mostOrdered = [...menuItems]
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 6);

  const recommended = menuItems.filter((item) => item.isRecommended);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryBar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Offers Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Live Offers</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-white text-lg mb-2">{offer.description}</p>
                  <p className="text-yellow-400 text-sm">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Ordered Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Most Ordered</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostOrdered.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* All Items Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">حلو ومالح</h3>
              <p className="text-gray-400">Sweet & Salty Restaurant</p>
              <p className="text-gray-400 mt-2">Delivering happiness since 2024</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Menu</li>
                <li>Contact</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Track Order</li>
                <li>Returns</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +966 50 123 4567</li>
                <li>📧 info@sweetandsalty.com</li>
                <li>📍 Riyadh, Saudi Arabia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 Sweet & Salty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
