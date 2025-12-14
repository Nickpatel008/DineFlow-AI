import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';
import PDFDocument from 'pdfkit';
import { sendInvoiceEmail } from '../../config/email';

// Public order creation for customers (no auth required)
export const createPublicOrder = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber, items } = req.body;

    if (!restaurantId || !tableNumber || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Restaurant ID, table number, and items are required' });
    }

    // Find table by table number and restaurant ID
    const table = await prisma.table.findFirst({
      where: {
        restaurantId,
        tableNumber: parseInt(tableNumber)
      }
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem || menuItem.restaurantId !== restaurantId) {
        return res.status(400).json({ message: `Invalid menu item: ${item.menuItemId}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item ${menuItem.name} is not available` });
      }

      const quantity = parseInt(item.quantity) || 1;
      const subtotal = menuItem.price * quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity,
        price: menuItem.price,
        subtotal
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        restaurantId,
        tableId: table.id,
        orderNumber,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        restaurant: true
      }
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create public order error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, tableId, items } = req.body;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId || !tableId || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Restaurant ID, table ID, and items are required' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem || menuItem.restaurantId !== finalRestaurantId) {
        return res.status(400).json({ message: `Invalid menu item: ${item.menuItemId}` });
      }

      const quantity = parseInt(item.quantity) || 1;
      const subtotal = menuItem.price * quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity,
        price: menuItem.price,
        subtotal
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        restaurantId: finalRestaurantId,
        tableId,
        orderNumber,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.query;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId: finalRestaurantId as string },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
};

// Public endpoint to get order by ID (no auth required for customers)
export const getPublicOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get public order error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch order' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        restaurant: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== order.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch order' });
  }
};

export const createBill = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, tax, discount, paymentMethod } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== order.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const subtotal = order.totalAmount;
    const taxAmount = tax ? parseFloat(tax) : 0;
    const discountAmount = discount ? parseFloat(discount) : 0;
    const total = subtotal + taxAmount - discountAmount;

    const billNumber = `BILL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const bill = await prisma.bill.create({
      data: {
        restaurantId: order.restaurantId,
        orderId,
        billNumber,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        paymentMethod,
        paidAt: paymentMethod ? new Date() : null
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            table: true
          }
        },
        restaurant: true
      }
    });

    res.status(201).json(bill);
  } catch (error: any) {
    console.error('Create bill error:', error);
    res.status(500).json({ message: error.message || 'Failed to create bill' });
  }
};

export const getBills = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.query;
    const { role, restaurantId: userRestaurantId } = req.user || {};

    const finalRestaurantId = role === 'owner' ? userRestaurantId : restaurantId;

    if (!finalRestaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required' });
    }

    const bills = await prisma.bill.findMany({
      where: { restaurantId: finalRestaurantId as string },
      include: {
        order: {
          include: {
            table: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bills);
  } catch (error: any) {
    console.error('Get bills error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch bills' });
  }
};

export const getBillById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            table: true
          }
        },
        restaurant: true
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Verify access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== bill.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(bill);
  } catch (error: any) {
    console.error('Get bill error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch bill' });
  }
};

export const generateInvoicePDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            table: true
          }
        },
        restaurant: true
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Verify access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== bill.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${bill.billNumber}.pdf"`);
      res.send(pdfBuffer);
    });

    // PDF Content
    doc.fontSize(20).text('DineFlow AI', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Restaurant: ${bill.restaurant.name}`, 50, 150);
    doc.text(`Bill Number: ${bill.billNumber}`, 50, 170);
    doc.text(`Order Number: ${bill.order.orderNumber}`, 50, 190);
    doc.text(`Table: ${bill.order.table.tableNumber}`, 50, 210);
    doc.text(`Date: ${bill.createdAt.toLocaleDateString()}`, 50, 230);
    doc.moveDown(3);

    // Items
    doc.fontSize(14).text('Items:', 50);
    doc.moveDown();
    let y = doc.y;
    doc.fontSize(10);
    
    bill.order.items.forEach((item) => {
      doc.text(`${item.menuItem.name}`, 50, y);
      doc.text(`Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}`, 350, y);
      y += 20;
    });

    doc.moveDown(2);
    y = doc.y;
    
    doc.fontSize(12);
    doc.text(`Subtotal: $${bill.subtotal.toFixed(2)}`, 350, y);
    y += 20;
    if (bill.tax > 0) {
      doc.text(`Tax: $${bill.tax.toFixed(2)}`, 350, y);
      y += 20;
    }
    if (bill.discount > 0) {
      doc.text(`Discount: -$${bill.discount.toFixed(2)}`, 350, y);
      y += 20;
    }
    doc.fontSize(14).text(`Total: $${bill.total.toFixed(2)}`, 350, y, { underline: true });

    doc.end();
  } catch (error: any) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate PDF' });
  }
};

export const sendInvoiceEmailHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            table: true
          }
        },
        restaurant: true
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Verify access
    const { role, restaurantId } = req.user || {};
    if (role === 'owner' && restaurantId !== bill.restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate PDF buffer
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // PDF Content (same as generateInvoicePDF)
    doc.fontSize(20).text('DineFlow AI', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Restaurant: ${bill.restaurant.name}`, 50, 150);
    doc.text(`Bill Number: ${bill.billNumber}`, 50, 170);
    doc.text(`Order Number: ${bill.order.orderNumber}`, 50, 190);
    doc.text(`Table: ${bill.order.table.tableNumber}`, 50, 210);
    doc.text(`Date: ${bill.createdAt.toLocaleDateString()}`, 50, 230);
    doc.moveDown(3);

    doc.fontSize(14).text('Items:', 50);
    doc.moveDown();
    let y = doc.y;
    doc.fontSize(10);
    
    bill.order.items.forEach((item) => {
      doc.text(`${item.menuItem.name}`, 50, y);
      doc.text(`Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}`, 350, y);
      y += 20;
    });

    doc.moveDown(2);
    y = doc.y;
    
    doc.fontSize(12);
    doc.text(`Subtotal: $${bill.subtotal.toFixed(2)}`, 350, y);
    y += 20;
    if (bill.tax > 0) {
      doc.text(`Tax: $${bill.tax.toFixed(2)}`, 350, y);
      y += 20;
    }
    if (bill.discount > 0) {
      doc.text(`Discount: -$${bill.discount.toFixed(2)}`, 350, y);
      y += 20;
    }
    doc.fontSize(14).text(`Total: $${bill.total.toFixed(2)}`, 350, y, { underline: true });

    doc.end();

    // Wait for PDF to finish
    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    const pdfBuffer = Buffer.concat(chunks);

    // Generate HTML email
    const html = `
      <h2>Invoice from ${bill.restaurant.name}</h2>
      <p>Bill Number: ${bill.billNumber}</p>
      <p>Order Number: ${bill.order.orderNumber}</p>
      <p>Table: ${bill.order.table.tableNumber}</p>
      <p>Date: ${bill.createdAt.toLocaleDateString()}</p>
      <hr>
      <h3>Items:</h3>
      <ul>
        ${bill.order.items.map(item => 
          `<li>${item.menuItem.name} - Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}</li>`
        ).join('')}
      </ul>
      <hr>
      <p><strong>Subtotal:</strong> $${bill.subtotal.toFixed(2)}</p>
      ${bill.tax > 0 ? `<p><strong>Tax:</strong> $${bill.tax.toFixed(2)}</p>` : ''}
      ${bill.discount > 0 ? `<p><strong>Discount:</strong> -$${bill.discount.toFixed(2)}</p>` : ''}
      <p><strong>Total:</strong> $${bill.total.toFixed(2)}</p>
    `;

    await sendInvoiceEmail(email, `Invoice ${bill.billNumber}`, html, pdfBuffer);

    res.json({ message: 'Invoice sent successfully', email });
  } catch (error: any) {
    console.error('Send email error:', error);
    res.status(500).json({ message: error.message || 'Failed to send email' });
  }
};

