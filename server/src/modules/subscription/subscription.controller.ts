import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthRequest } from '../../utils/auth.middleware';

// Get all subscription plans (public endpoint)
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    res.json(plans);
  } catch (error: any) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch subscription plans' });
  }
};

// Get subscription plan by ID
export const getSubscriptionPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    res.json(plan);
  } catch (error: any) {
    console.error('Get subscription plan error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch subscription plan' });
  }
};

// Create subscription plan (admin only)
export const createSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user || {};
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const {
      name,
      type,
      description,
      price,
      billingCycle,
      features,
      maxTables,
      maxMenuItems,
      maxOrders,
      aiFeatures,
      supportLevel
    } = req.body;

    if (!name || !type || !price || !billingCycle) {
      return res.status(400).json({ message: 'Name, type, price, and billing cycle are required' });
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        type,
        description,
        price: parseFloat(price),
        billingCycle,
        features: features || [],
        maxTables: maxTables ? parseInt(maxTables) : null,
        maxMenuItems: maxMenuItems ? parseInt(maxMenuItems) : null,
        maxOrders: maxOrders ? parseInt(maxOrders) : null,
        aiFeatures: aiFeatures === true || aiFeatures === 'true',
        supportLevel: supportLevel || 'basic'
      }
    });

    res.status(201).json(plan);
  } catch (error: any) {
    console.error('Create subscription plan error:', error);
    res.status(500).json({ message: error.message || 'Failed to create subscription plan' });
  }
};

// Update subscription plan (admin only)
export const updateSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user || {};
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const updateData: any = {};

    const allowedFields = [
      'name', 'description', 'price', 'billingCycle', 'features',
      'maxTables', 'maxMenuItems', 'maxOrders', 'aiFeatures', 'supportLevel', 'isActive'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'price') {
          updateData[field] = parseFloat(req.body[field]);
        } else if (['maxTables', 'maxMenuItems', 'maxOrders'].includes(field)) {
          updateData[field] = req.body[field] ? parseInt(req.body[field]) : null;
        } else if (field === 'aiFeatures') {
          updateData[field] = req.body[field] === true || req.body[field] === 'true';
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: updateData
    });

    res.json(plan);
  } catch (error: any) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({ message: error.message || 'Failed to update subscription plan' });
  }
};

// Get restaurant subscription
export const getRestaurantSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { role, restaurantId } = req.user || {};

    if (role !== 'owner' || !restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { restaurantId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error: any) {
    console.error('Get restaurant subscription error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch subscription' });
  }
};

// Create or update subscription (owner)
export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { role, restaurantId } = req.user || {};

    if (role !== 'owner' || !restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive plan' });
    }

    // Check if restaurant already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { restaurantId }
    });

    // Calculate dates
    const startDate = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial

    let endDate: Date | null = null;
    let nextBillingDate: Date | null = null;

    if (plan.billingCycle === 'MONTHLY') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      nextBillingDate = new Date(endDate);
    } else if (plan.billingCycle === 'YEARLY') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      nextBillingDate = new Date(endDate);
    }

    if (existingSubscription) {
      // Update existing subscription
      const subscription = await prisma.subscription.update({
        where: { restaurantId },
        data: {
          planId,
          status: 'TRIAL',
          startDate,
          endDate,
          nextBillingDate,
          trialEndsAt,
          cancelAtPeriodEnd: false,
          cancelledAt: null
        },
        include: {
          plan: true
        }
      });

      return res.json(subscription);
    } else {
      // Create new subscription
      const subscription = await prisma.subscription.create({
        data: {
          restaurantId,
          planId,
          status: 'TRIAL',
          startDate,
          endDate,
          nextBillingDate,
          trialEndsAt
        },
        include: {
          plan: true
        }
      });

      return res.status(201).json(subscription);
    }
  } catch (error: any) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: error.message || 'Failed to create subscription' });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { role, restaurantId } = req.user || {};

    if (role !== 'owner' || !restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { restaurantId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { restaurantId },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date()
      },
      include: {
        plan: true
      }
    });

    res.json(updatedSubscription);
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: error.message || 'Failed to cancel subscription' });
  }
};

// Get all subscriptions (admin only)
export const getAllSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user || {};

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const subscriptions = await prisma.subscription.findMany({
      include: {
        plan: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(subscriptions);
  } catch (error: any) {
    console.error('Get all subscriptions error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch subscriptions' });
  }
};

