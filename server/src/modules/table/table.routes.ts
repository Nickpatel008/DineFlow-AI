import express from 'express';
import { authenticate } from '../../utils/auth.middleware';
import {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  generateQRCode,
  getTableByNumber
} from './table.controller';

const router = express.Router();

// Public route for table lookup (no auth required)
router.get('/public', getTableByNumber);

router.post('/', authenticate, createTable);
router.get('/', authenticate, getTables);
router.get('/:id', authenticate, getTableById);
router.put('/:id', authenticate, updateTable);
router.delete('/:id', authenticate, deleteTable);
router.post('/:id/qr', authenticate, generateQRCode);

export default router;






