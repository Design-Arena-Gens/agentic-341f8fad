'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/Header';
import { User, Mail, Phone, MapPin, Heart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSave = () => {
    updateUser(formData);
    setEditing(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Delivery Addresses</h2>
                </div>
                <button className="text-primary hover:underline">+ Add New</button>
              </div>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{addr.label}</p>
                        <p className="text-sm text-gray-600">
                          {addr.street}, {addr.city}
                        </p>
                        {addr.instructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            {addr.instructions}
                          </p>
                        )}
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No addresses saved yet
                </p>
              )}
            </div>

            {/* Favorite Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Favorite Orders</h2>
              </div>
              <p className="text-gray-500 text-center py-8">
                No favorite orders yet
              </p>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
              <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Delete Account
              </button>
              <p className="text-sm text-gray-600 mt-2">
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <button
                onClick={() => router.push('/orders')}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                My Orders
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                Browse Menu
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
