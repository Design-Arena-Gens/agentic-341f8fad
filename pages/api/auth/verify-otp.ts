import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Mock OTP storage - In production, use Redis or similar
const otpStore: Record<string, { otp: string; expires: number }> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return verifyOTP(req, res);
  } else if (req.method === 'GET') {
    return sendOTP(req, res);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

async function sendOTP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ message: 'Phone number required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiration
    otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    // In production, send SMS via Twilio, AWS SNS, etc.
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({
      message: 'OTP sent successfully',
      // For demo purposes only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function verifyOTP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP required' });
    }

    const storedOTP = otpStore[phone];

    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOTP.expires) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    delete otpStore[phone];

    // Generate JWT token
    const token = jwt.sign(
      { phone },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: Date.now().toString(),
        phone,
        name: '',
        email: '',
        addresses: [],
        favoriteOrders: [],
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
