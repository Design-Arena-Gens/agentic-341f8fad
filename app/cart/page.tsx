'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import Header from '@/components/Header';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const deliveryFee = 10;
  const tax = total * 0.15;
  const grandTotal = total + deliveryFee + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto text-gray-300" size={120} />
          <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.nameAr}</p>
                  <p className="text-primary font-bold mt-1">
                    {item.price.toFixed(2)} SAR
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-opacity-90 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
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
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center text-primary mt-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
