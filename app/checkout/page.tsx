'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/Header';
import { MapPin, CreditCard, Wallet, Banknote } from 'lucide-react';
import axios from 'axios';

export default function Checkout() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cash'>('card');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 10;
  const tax = total * 0.15;
  const grandTotal = total + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        '/api/orders/create',
        {
          items,
          deliveryAddress: address || 'Default Address',
          paymentMethod,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      router.push(`/order-success?orderId=${response.data.order.id}`);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
              </div>

              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-2">
                  {user.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        onChange={() => setAddress(`${addr.street}, ${addr.city}`)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{addr.label}</p>
                        <p className="text-sm text-gray-600">
                          {addr.street}, {addr.city}
                        </p>
                        {addr.instructions && (
                          <p className="text-sm text-gray-500">{addr.instructions}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Enter your delivery address..."
                  required
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <CreditCard size={20} />
                  <span className="font-medium">Credit/Debit Card</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  <Wallet size={20} />
                  <span className="font-medium">Digital Wallet (Apple Pay, Mada)</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <Banknote size={20} />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Special Instructions
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Any special requests? (e.g., extra spicy, no onions...)"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)} SAR
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>{tax.toFixed(2)} SAR</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{grandTotal.toFixed(2)} SAR</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !address}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition disabled:bg-gray-300"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Estimated delivery time: 30-45 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
