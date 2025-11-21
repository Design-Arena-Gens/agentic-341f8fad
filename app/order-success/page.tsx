'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { CheckCircle, MapPin, Clock, Package } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get('orderId');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="mx-auto text-green-500" size={80} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your food is being prepared.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-primary">{orderId}</p>
          </div>

          {/* Order Status Timeline */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800">Order Confirmed</p>
                <p className="text-sm text-gray-600">Your order has been received</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Package className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800">Preparing</p>
                <p className="text-sm text-gray-600">Restaurant is preparing your food</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800">Out for Delivery</p>
                <p className="text-sm text-gray-600">Driver is on the way</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-800">Delivered</p>
                <p className="text-sm text-gray-600">Enjoy your meal!</p>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="text-primary" size={24} />
              <p className="text-lg font-bold text-gray-800">Estimated Delivery</p>
            </div>
            <p className="text-3xl font-bold text-primary">{countdown} minutes</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
