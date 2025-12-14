import { Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';

export const getAllOwners = async (req: AuthRequest, res: Response) => {
  try {
    const owners = await prisma.user.findMany({
      where: { role: 'OWNER' },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(owners.map(owner => ({
      id: owner.id,
      email: owner.email,
      name: owner.name,
      restaurant: owner.restaurant,
      createdAt: owner.createdAt
    })));
  } catch (error: any) {
    console.error('Get owners error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch owners' });
  }
};

export const getOwnerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role, restaurantId } = req.user || {};

    // Owners can only access their own profile
    if (role === 'owner' && userId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const owner = await prisma.user.findUnique({
      where: { id },
      include: {
        restaurant: true
      }
    });

    if (!owner || owner.role !== 'OWNER') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json({
      id: owner.id,
      email: owner.email,
      name: owner.name,
      restaurant: owner.restaurant,
      createdAt: owner.createdAt
    });
  } catch (error: any) {
    console.error('Get owner error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch owner' });
  }
};

export const updateOwner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user || {};
    const { name, email } = req.body;

    // Owners can only update their own profile
    if (role === 'owner' && userId !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const owner = await prisma.user.update({
      where: { id },
      data: updateData
    });

    res.json({
      id: owner.id,
      email: owner.email,
      name: owner.name
    });
  } catch (error: any) {
    console.error('Update owner error:', error);
    res.status(500).json({ message: error.message || 'Failed to update owner' });
  }
};















