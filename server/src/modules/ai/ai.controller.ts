import { Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';
import {
  generateItemDescription,
  generateOfferDescription,
  generateBusinessInsights
} from './ai.service';

export const generateItemDescription = async (req: AuthRequest, res: Response) => {
  try {
    const { itemName, category } = req.body;

    if (!itemName || !category) {
      return res.status(400).json({ message: 'Item name and category are required' });
    }

    const description = await generateItemDescription(itemName, category);

    res.json({ description });
  } catch (error: any) {
    console.error('Generate item description error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate description' });
  }
};

export const generateOffer = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, category, discount } = req.body;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId || !category || !discount) {
      return res.status(400).json({ message: 'Restaurant ID, category, and discount are required' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: finalRestaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const aiDescription = await generateOfferDescription(
      restaurant.name,
      category,
      parseFloat(discount)
    );

    res.json({ description: aiDescription });
  } catch (error: any) {
    console.error('Generate offer error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate offer' });
  }
};

export const generateBusinessInsights = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.body;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: finalRestaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get stats
    const [totalOrders, bills, menuItems] = await Promise.all([
      prisma.order.count({ where: { restaurantId: finalRestaurantId } }),
      prisma.bill.findMany({ where: { restaurantId: finalRestaurantId } }),
      prisma.menuItem.findMany({
        where: { restaurantId: finalRestaurantId },
        include: {
          orderItems: {
            select: { quantity: true }
          }
        }
      })
    ]);

    const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get popular items
    const popularItems = menuItems
      .map(item => ({
        name: item.name,
        orders: item.orderItems.reduce((sum, oi) => sum + oi.quantity, 0)
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map(item => item.name);

    const insights = await generateBusinessInsights(restaurant.name, {
      totalOrders,
      totalRevenue,
      popularItems,
      averageOrderValue
    });

    res.json({ insights });
  } catch (error: any) {
    console.error('Generate business insights error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate insights' });
  }
};















