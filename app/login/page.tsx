'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import axios from 'axios';
import { Mail, Lock, Phone, Chrome } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      setUser(response.data.user);
      setToken(response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/api/auth/verify-otp?phone=${formData.phone}`);
      setOtpSent(true);
      if (response.data.otp) {
        alert(`OTP sent! For demo: ${response.data.otp}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        phone: formData.phone,
        otp: formData.otp,
      });

      setUser(response.data.user);
      setToken(response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-800">حلو ومالح</h1>
          <p className="text-gray-600">Sweet & Salty</p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        {/* Login Method Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              loginMethod === 'email'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              loginMethod === 'phone'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Phone
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition disabled:bg-gray-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Phone Login Form */}
        {loginMethod === 'phone' && (
          <form onSubmit={otpSent ? handleVerifyOTP : undefined} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+966 50 123 4567"
                  disabled={otpSent}
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
            )}

            {otpSent ? (
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition disabled:bg-gray-300"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-primary text-sm hover:underline"
                >
                  Change phone number
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || !formData.phone}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition disabled:bg-gray-300"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            )}
          </form>
        )}

        {/* Google Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => alert('Google login not configured in demo')}
            className="mt-4 w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <Chrome size={20} />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
