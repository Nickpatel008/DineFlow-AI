import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';
import QRCode from 'qrcode';

export const createTable = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, tableNumber, capacity } = req.body;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId || !tableNumber) {
      return res.status(400).json({ message: 'Restaurant ID and table number are required' });
    }

    // Verify restaurant access
    if (role === 'owner' && userRestaurantId !== finalRestaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const table = await prisma.table.create({
      data: {
        restaurantId: finalRestaurantId,
        tableNumber: parseInt(tableNumber),
        capacity: capacity ? parseInt(capacity) : 4
      }
    });

    res.status(201).json(table);
  } catch (error: any) {
    console.error('Create table error:', error);
    res.status(500).json({ message: error.message || 'Failed to create table' });
  }
};

export const getTables = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.query;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    // Verify restaurant access
    if (role === 'owner' && userRestaurantId !== finalRestaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tables = await prisma.table.findMany({
      where: { restaurantId: finalRestaurantId as string },
      orderBy: { tableNumber: 'asc' }
    });

    res.json(tables);
  } catch (error: any) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch tables' });
  }
};

export const getTableById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        restaurant: true,
        orders: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY']
            }
          }
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== table.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(table);
  } catch (error: any) {
    console.error('Get table error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch table' });
  }
};

export const updateTable = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, status } = req.body;

    const table = await prisma.table.findUnique({
      where: { id }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== table.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (tableNumber) updateData.tableNumber = parseInt(tableNumber);
    if (capacity) updateData.capacity = parseInt(capacity);
    if (status) updateData.status = status;

    const updatedTable = await prisma.table.update({
      where: { id },
      data: updateData
    });

    res.json(updatedTable);
  } catch (error: any) {
    console.error('Update table error:', error);
    res.status(500).json({ message: error.message || 'Failed to update table' });
  }
};

export const deleteTable = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== table.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.table.delete({
      where: { id }
    });

    res.json({ message: 'Table deleted successfully' });
  } catch (error: any) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete table' });
  }
};

export const generateQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id },
      include: { restaurant: true }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Verify restaurant access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== table.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const qrUrl = `${frontendUrl}/menu/${table.restaurantId}?table=${table.tableNumber}`;

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1B1F3B',
        light: '#FFFFFF'
      }
    });

    // Update table with QR code
    const updatedTable = await prisma.table.update({
      where: { id },
      data: { qrCode: qrUrl }
    });

    res.json({
      qrCode: qrCodeDataUrl,
      qrUrl,
      table: updatedTable
    });
  } catch (error: any) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate QR code' });
  }
};

// Public endpoint to get table by table number and restaurant ID (no auth required)
export const getTableByNumber = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber } = req.query;

    if (!restaurantId || !tableNumber) {
      return res.status(400).json({ message: 'Restaurant ID and table number are required' });
    }

    const table = await prisma.table.findFirst({
      where: {
        restaurantId: restaurantId as string,
        tableNumber: parseInt(tableNumber as string)
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json(table);
  } catch (error: any) {
    console.error('Get table by number error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch table' });
  }
};






