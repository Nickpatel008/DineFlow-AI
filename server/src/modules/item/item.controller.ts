import { Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';
import { generateItemDescription } from '../ai/ai.service';

export const createMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, name, description, price, category } = req.body;
    const { role, restaurantId: userRestaurantId } = req.user || {};
    const image = req.file ? `/uploads/menu/${req.file.filename}` : null;

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId || !name || !price || !category) {
      return res.status(400).json({ 
        message: 'Restaurant ID, name, price, and category are required' 
      });
    }

    // Verify restaurant access
    if (role === 'owner' && userRestaurantId !== finalRestaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: finalRestaurantId,
        name,
        description,
        price: parseFloat(price),
        category,
        image
      }
    });

    res.status(201).json(menuItem);
  } catch (error: any) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: error.message || 'Failed to create menu item' });
  }
};

export const getPublicMenuItems = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { 
        restaurantId,
        isAvailable: true 
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    res.json(menuItems);
  } catch (error: any) {
    console.error('Get public menu items error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch menu items' });
  }
};

export const getMenuItems = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.query;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' 
      ? userRestaurantId 
      : (restaurantId as string);

    if (!finalRestaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    // Verify restaurant access
    if (role === 'owner' && userRestaurantId !== finalRestaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: finalRestaurantId },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    res.json(menuItems);
  } catch (error: any) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch menu items' });
  }
};

export const getMenuItemById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== menuItem.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(menuItem);
  } catch (error: any) {
    console.error('Get menu item error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch menu item' });
  }
};

export const updateMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;
    const image = req.file ? `/uploads/menu/${req.file.filename}` : undefined;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== menuItem.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (image) updateData.image = image;

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    });

    res.json(updatedItem);
  } catch (error: any) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: error.message || 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== menuItem.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error: any) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete menu item' });
  }
};

export const generateAIDescription = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== menuItem.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const aiDescription = await generateItemDescription(menuItem.name, menuItem.category);

    // Update menu item with AI description
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: { aiDescription }
    });

    res.json({ aiDescription, menuItem: updatedItem });
  } catch (error: any) {
    console.error('Generate AI description error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate AI description' });
  }
};

