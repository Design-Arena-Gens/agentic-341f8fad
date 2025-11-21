'use client';

import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">🍽️</div>
            <div>
              <h1 className="text-2xl font-bold text-primary">حلو ومالح</h1>
              <p className="text-xs text-gray-600">Sweet & Salty</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for dishes..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="text-gray-700 cursor-pointer hover:text-primary transition" size={24} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <User className="text-gray-700 cursor-pointer hover:text-primary transition" size={24} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden">
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dishes..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
