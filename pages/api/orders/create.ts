import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Mock orders database
const orders: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate total
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = 10;
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = {
      id: `ORD${Date.now()}`,
      userId: decoded.userId || decoded.phone,
      items,
      deliveryAddress,
      paymentMethod,
      notes: notes || '',
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'pending',
      estimatedDeliveryTime: 30,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
