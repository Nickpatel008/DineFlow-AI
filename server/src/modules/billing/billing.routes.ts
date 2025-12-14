import express from 'express';
import { authenticate } from '../../utils/auth.middleware';
import {
  createOrder,
  createPublicOrder,
  getOrders,
  getOrderById,
  getPublicOrderById,
  createBill,
  getBills,
  getBillById,
  generateInvoicePDF,
  sendInvoiceEmailHandler
} from './billing.controller';

const router = express.Router();

// Public routes for customers (no auth required)
router.post('/orders/public', createPublicOrder);
router.get('/orders/public/:id', getPublicOrderById);

router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderById);
router.post('/bills', authenticate, createBill);
router.get('/bills', authenticate, getBills);
router.get('/bills/:id', authenticate, getBillById);
router.get('/bills/:id/pdf', authenticate, generateInvoicePDF);
router.post('/bills/:id/email', authenticate, sendInvoiceEmailHandler);

export default router;

