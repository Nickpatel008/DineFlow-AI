import { prisma } from '../../config/database';
import { processSubscriptionPayment } from './stripe.service';

/**
 * Billing Automation Service
 * Handles automatic subscription renewals, trial expirations, and payment processing
 */

/**
 * Process all subscriptions that are due for billing
 * This should be run daily via cron job
 */
export const processDueSubscriptions = async () => {
  try {
    console.log('🔄 Starting billing automation process...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find subscriptions that need billing today
    const subscriptionsDue = await prisma.subscription.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'TRIAL']
        },
        nextBillingDate: {
          lte: today
        },
        cancelAtPeriodEnd: false
      },
      include: {
        plan: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log(`📊 Found ${subscriptionsDue.length} subscriptions due for billing`);

    for (const subscription of subscriptionsDue) {
      await processSubscriptionBilling(subscription.id);
    }

    // Process trial expirations
    await processTrialExpirations();

    // Process cancelled subscriptions that reached period end
    await processCancelledSubscriptions();

    console.log('✅ Billing automation process completed');
  } catch (error: any) {
    console.error('❌ Billing automation error:', error);
    throw error;
  }
};

/**
 * Process billing for a single subscription
 */
const processSubscriptionBilling = async (subscriptionId: string) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        plan: true,
        restaurant: true
      }
    });

    if (!subscription) {
      console.error(`Subscription ${subscriptionId} not found`);
      return;
    }

    console.log(`💳 Processing billing for subscription ${subscriptionId}`);

    // Create payment record
    const payment = await prisma.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        amount: subscription.plan.price,
        currency: 'USD',
        paymentMethod: 'stripe',
        status: 'pending'
      }
    });

    // Process payment via Stripe (dummy implementation)
    try {
      const paymentResult = await processSubscriptionPayment({
        subscriptionId: subscription.id,
        amount: subscription.plan.price,
        currency: 'USD',
        paymentMethodId: 'card_auto_renewal' // Dummy payment method
      });

      if (paymentResult.success) {
        // Update payment record
        await prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            transactionId: paymentResult.transactionId,
            paidAt: new Date()
          }
        });

        // Calculate next billing date
        const nextBillingDate = new Date();
        if (subscription.plan.billingCycle === 'MONTHLY') {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else if (subscription.plan.billingCycle === 'YEARLY') {
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        // Update subscription
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            nextBillingDate,
            endDate: nextBillingDate
          }
        });

        console.log(`✅ Successfully processed payment for subscription ${subscriptionId}`);
      } else {
        // Payment failed
        await prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: {
            status: 'failed'
          }
        });

        // Update subscription status
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'INACTIVE'
          }
        });

        console.error(`❌ Payment failed for subscription ${subscriptionId}: ${paymentResult.error}`);
      }
    } catch (error: any) {
      await prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: {
          status: 'failed'
        }
      });

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'INACTIVE'
        }
      });

      console.error(`❌ Payment processing error for subscription ${subscriptionId}:`, error);
    }
  } catch (error: any) {
    console.error(`Error processing subscription ${subscriptionId}:`, error);
  }
};

/**
 * Process subscriptions with expired trials
 */
const processTrialExpirations = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredTrials = await prisma.subscription.findMany({
      where: {
        status: 'TRIAL',
        trialEndsAt: {
          lte: today
        }
      },
      include: {
        plan: true
      }
    });

    console.log(`📊 Found ${expiredTrials.length} expired trials`);

    for (const subscription of expiredTrials) {
      // Try to charge for the first billing cycle
      const payment = await prisma.subscriptionPayment.create({
        data: {
          subscriptionId: subscription.id,
          amount: subscription.plan.price,
          currency: 'USD',
          paymentMethod: 'stripe',
          status: 'pending'
        }
      });

      try {
        const paymentResult = await processSubscriptionPayment({
          subscriptionId: subscription.id,
          amount: subscription.plan.price,
          currency: 'USD',
          paymentMethodId: 'card_auto_renewal'
        });

        if (paymentResult.success) {
          const nextBillingDate = new Date();
          if (subscription.plan.billingCycle === 'MONTHLY') {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          } else {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
          }

          await prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: {
              status: 'completed',
              transactionId: paymentResult.transactionId,
              paidAt: new Date()
            }
          });

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'ACTIVE',
              nextBillingDate,
              endDate: nextBillingDate
            }
          });

          console.log(`✅ Trial converted to active for subscription ${subscription.id}`);
        } else {
          // Trial expired, no payment method
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'EXPIRED'
            }
          });

          await prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: {
              status: 'failed'
            }
          });

          console.log(`⚠️ Trial expired for subscription ${subscription.id}`);
        }
      } catch (error: any) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'EXPIRED'
          }
        });

        await prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: {
            status: 'failed'
          }
        });

        console.error(`❌ Error processing trial expiration for ${subscription.id}:`, error);
      }
    }
  } catch (error: any) {
    console.error('Error processing trial expirations:', error);
  }
};

/**
 * Process subscriptions that were cancelled and reached period end
 */
const processCancelledSubscriptions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cancelledSubscriptions = await prisma.subscription.findMany({
      where: {
        cancelAtPeriodEnd: true,
        endDate: {
          lte: today
        },
        status: {
          in: ['ACTIVE', 'TRIAL']
        }
      }
    });

    console.log(`📊 Found ${cancelledSubscriptions.length} subscriptions to cancel`);

    for (const subscription of cancelledSubscriptions) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'CANCELLED',
          cancelAtPeriodEnd: false
        }
      });

      console.log(`✅ Cancelled subscription ${subscription.id}`);
    }
  } catch (error: any) {
    console.error('Error processing cancelled subscriptions:', error);
  }
};

/**
 * Manual trigger for billing automation (for testing/admin use)
 */
export const triggerBillingAutomation = async () => {
  console.log('🔧 Manual billing automation trigger');
  await processDueSubscriptions();
};

