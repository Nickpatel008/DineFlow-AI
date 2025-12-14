import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../../utils/auth.middleware';

export const getPublicRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
        description: true,
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error: any) {
    console.error('Get public restaurant error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch restaurant' });
  }
};

export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, phone, email, description } = req.body;
    const logo = req.file ? `/uploads/restaurant/${req.file.filename}` : null;

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    // Generate owner email and password
    const ownerEmail = email || `owner-${Date.now()}@dineflow.ai`;
    const tempPassword = `DineFlow${Math.random().toString(36).slice(-8)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create restaurant and owner in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          name,
          address,
          phone,
          email: ownerEmail,
          description,
          logo
        }
      });

      // Create owner user
      const owner = await tx.user.create({
        data: {
          email: ownerEmail,
          password: hashedPassword,
          role: 'OWNER',
          name: `${name} Owner`,
          restaurantId: restaurant.id
        }
      });

      return { restaurant, owner, tempPassword };
    });

    res.status(201).json({
      restaurant: result.restaurant,
      owner: {
        email: result.owner.email,
        password: result.tempPassword // Return temp password for admin
      }
    });
  } catch (error: any) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: error.message || 'Failed to create restaurant' });
  }
};

export const getAllRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const { role, restaurantId } = req.user || {};

    let restaurants;
    if (role === 'owner' && restaurantId) {
      restaurants = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          _count: {
            select: {
              tables: true,
              menuItems: true,
              orders: true
            }
          }
        }
      });
      restaurants = restaurants ? [restaurants] : [];
    } else {
      restaurants = await prisma.restaurant.findMany({
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          _count: {
            select: {
              tables: true,
              menuItems: true,
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(restaurants);
  } catch (error: any) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch restaurants' });
  }
};

export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, restaurantId } = req.user || {};

    // Owners can only access their own restaurant
    if (role === 'owner' && restaurantId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        tables: true,
        menuItems: true,
        _count: {
          select: {
            orders: true,
            bills: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error: any) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch restaurant' });
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, restaurantId } = req.user || {};
    const { name, address, phone, email, description } = req.body;
    const logo = req.file ? `/uploads/restaurant/${req.file.filename}` : undefined;

    // Owners can only update their own restaurant
    if (role === 'owner' && restaurantId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (description !== undefined) updateData.description = description;
    if (logo) updateData.logo = logo;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData
    });

    res.json(restaurant);
  } catch (error: any) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: error.message || 'Failed to update restaurant' });
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.restaurant.delete({
      where: { id }
    });

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error: any) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete restaurant' });
  }
};

export const getRestaurantStats = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, restaurantId } = req.user || {};

    if (role === 'owner' && restaurantId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [orders, bills, menuItems, tables] = await Promise.all([
      prisma.order.count({ where: { restaurantId: id } }),
      prisma.bill.count({ where: { restaurantId: id } }),
      prisma.menuItem.count({ where: { restaurantId: id } }),
      prisma.table.count({ where: { restaurantId: id } })
    ]);

    const totalRevenue = await prisma.bill.aggregate({
      where: { restaurantId: id },
      _sum: { total: true }
    });

    res.json({
      orders,
      bills,
      menuItems,
      tables,
      totalRevenue: totalRevenue._sum.total || 0
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch stats' });
  }
};

