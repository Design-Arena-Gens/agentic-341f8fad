import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Mock orders database - should be shared
const orders: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    const { id } = req.query;

    if (req.method === 'GET') {
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Verify user owns this order
      if (order.userId !== decoded.userId && order.userId !== decoded.phone) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.status(200).json({ order });
    } else if (req.method === 'PATCH') {
      const orderIndex = orders.findIndex((o) => o.id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const { status } = req.body;
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      res.status(200).json({ order: orders[orderIndex] });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
