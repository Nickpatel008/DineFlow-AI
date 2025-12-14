import express from 'express';
import { authenticate, requireRole } from '../../utils/auth.middleware';
import { getAllOwners, getOwnerById, updateOwner } from './owner.controller';

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), getAllOwners);
router.get('/:id', authenticate, getOwnerById);
router.put('/:id', authenticate, updateOwner);

export default router;















