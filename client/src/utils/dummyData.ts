// Dummy data generators for testing

const restaurantNames = [
  'The Golden Spoon', 'Bella Vista', 'Ocean Breeze', 'Mountain Peak', 'Sunset Grill',
  'Royal Palace', 'Garden Terrace', 'Coastal Kitchen', 'Urban Eats', 'Heritage Diner',
  'Spice Route', 'Fresh Market', 'The Corner Cafe', 'Luxury Lounge', 'Riverside Bistro',
  'Skyline Restaurant', 'Green Leaf', 'Fire & Ice', 'The Vintage', 'Modern Fusion',
  'Taste of Home', 'Elite Dining', 'The Harbor', 'Country Kitchen', 'Metro Grill'
];

const ownerNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Jessica Martinez', 'Christopher Lee', 'Amanda Taylor', 'Matthew Anderson', 'Lisa Thomas',
  'Daniel Jackson', 'Michelle White', 'Robert Harris', 'Jennifer Martin', 'William Garcia',
  'Nicole Rodriguez', 'James Lewis', 'Ashley Walker', 'Andrew Hall', 'Stephanie Young'
];

const ownerEmails = [
  'john.smith@restaurant.com', 'sarah.j@dining.com', 'mike.brown@food.com', 'emily.d@bistro.com', 'david.w@cafe.com',
  'jessica.m@restaurant.com', 'chris.lee@dining.com', 'amanda.t@food.com', 'matt.a@bistro.com', 'lisa.t@cafe.com',
  'daniel.j@restaurant.com', 'michelle.w@dining.com', 'robert.h@food.com', 'jennifer.m@bistro.com', 'william.g@cafe.com',
  'nicole.r@restaurant.com', 'james.l@dining.com', 'ashley.w@food.com', 'andrew.h@bistro.com', 'stephanie.y@cafe.com'
];

const addresses = [
  '123 Main St, New York, NY 10001', '456 Oak Ave, Los Angeles, CA 90001', '789 Pine Rd, Chicago, IL 60601',
  '321 Elm St, Houston, TX 77001', '654 Maple Dr, Phoenix, AZ 85001', '987 Cedar Ln, Philadelphia, PA 19101',
  '147 Birch Way, San Antonio, TX 78201', '258 Spruce St, San Diego, CA 92101', '369 Willow Ave, Dallas, TX 75201',
  '741 Cherry Blvd, San Jose, CA 95101', '852 Poplar St, Austin, TX 78701', '963 Ash Rd, Jacksonville, FL 32201',
  '159 Magnolia Dr, Fort Worth, TX 76101', '357 Cypress Ln, Columbus, OH 43201', '468 Hickory Way, Charlotte, NC 28201',
  '579 Sycamore St, Seattle, WA 98101', '680 Walnut Ave, Denver, CO 80201', '791 Chestnut Rd, Boston, MA 02101',
  '802 Beech Blvd, Detroit, MI 48201', '913 Fir St, Nashville, TN 37201', '024 Hemlock Ln, Portland, OR 97201',
  '135 Redwood Way, Oklahoma City, OK 73101', '246 Sequoia Dr, Las Vegas, NV 89101', '357 Eucalyptus Ave, Memphis, TN 38101',
  '468 Acacia Rd, Louisville, KY 40201', '579 Juniper St, Baltimore, MD 21201'
];

const phoneNumbers = [
  '+1 (555) 100-0001', '+1 (555) 100-0002', '+1 (555) 100-0003', '+1 (555) 100-0004', '+1 (555) 100-0005',
  '+1 (555) 100-0006', '+1 (555) 100-0007', '+1 (555) 100-0008', '+1 (555) 100-0009', '+1 (555) 100-0010',
  '+1 (555) 200-0001', '+1 (555) 200-0002', '+1 (555) 200-0003', '+1 (555) 200-0004', '+1 (555) 200-0005',
  '+1 (555) 200-0006', '+1 (555) 200-0007', '+1 (555) 200-0008', '+1 (555) 200-0009', '+1 (555) 200-0010',
  '+1 (555) 300-0001', '+1 (555) 300-0002', '+1 (555) 300-0003', '+1 (555) 300-0004', '+1 (555) 300-0005',
  '+1 (555) 300-0006', '+1 (555) 300-0007', '+1 (555) 300-0008', '+1 (555) 300-0009', '+1 (555) 300-0010'
];

const planNames = ['Basic Plan', 'Standard Plan', 'Premium Plan', 'Enterprise Plan', 'Pro Plan'];
const statuses = ['active', 'pending', 'blocked', 'inactive', 'suspended'];
const subscriptionStatuses = ['active', 'cancelled', 'expired', 'pending'];
const billingCycles = ['monthly', 'yearly'];

const cuisineTypes = ['Italian', 'Japanese', 'American', 'Mexican', 'Chinese', 'Indian', 'French', 'Mediterranean', 'Thai', 'Seafood', 'Steakhouse', 'Vegetarian', 'Fast Food', 'Cafe', 'Bar & Grill'];
const operatingHours = [
  { open: '09:00', close: '22:00' },
  { open: '10:00', close: '23:00' },
  { open: '11:00', close: '22:00' },
  { open: '08:00', close: '21:00' },
  { open: '12:00', close: '00:00' },
];
const priceRanges = ['$', '$$', '$$$', '$$$$'];
const websites = [
  'www.restaurant.com', 'www.dinewithus.com', 'www.foodie.com', 'www.eatout.com',
  'www.gourmet.com', 'www.taste.com', 'www.flavor.com', 'www.cuisine.com',
];
const socialMedia = [
  { facebook: 'facebook.com/restaurant', instagram: '@restaurant', twitter: '@restaurant' },
  { facebook: 'facebook.com/dine', instagram: '@dine', twitter: '@dine' },
  { facebook: 'facebook.com/food', instagram: '@food', twitter: '@food' },
];

export const generateDummyRestaurants = (count: number = 25): any[] => {
  const restaurants = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < count; i++) {
    const baseName = restaurantNames[i % restaurantNames.length];
    const suffix = i >= restaurantNames.length ? ` ${Math.floor(i / restaurantNames.length) + 1}` : '';
    const name = `${baseName}${suffix}`.trim();
    const status = statuses[i % statuses.length];
    const createdAt = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString();
    const emailDomain = baseName.toLowerCase().replace(/\s+/g, '') + (i >= restaurantNames.length ? i : '');
    
    // Use Picsum Photos for reliable placeholder images (food/restaurant themed)
    // Using different seeds for variety, with food/restaurant related numbers
    const imageSeed = 100 + i; // Start from 100 for food-related images
    const logo = `https://picsum.photos/seed/restaurant${imageSeed}/200/200`;
    
    // Generate multiple images for gallery (3-5 images per restaurant)
    const imageCount = 3 + (i % 3); // 3-5 images
    const images = Array.from({ length: imageCount }, (_, idx) => 
      `https://picsum.photos/seed/restaurant${imageSeed + idx}/400/300`
    );
    
    const cuisineType = cuisineTypes[i % cuisineTypes.length];
    const hours = operatingHours[i % operatingHours.length];
    const capacity = 20 + (i % 5) * 10; // 20-60 capacity
    const rating = (4.0 + (i % 10) * 0.1).toFixed(1); // 4.0-4.9 rating
    const totalReviews = 50 + (i % 200); // 50-250 reviews
    const priceRange = priceRanges[i % priceRanges.length];
    const website = `https://${websites[i % websites.length]}`;
    const social = socialMedia[i % socialMedia.length];
    
    restaurants.push({
      id: `rest-${i + 1}`,
      name: name,
      address: addresses[i % addresses.length],
      phone: phoneNumbers[i % phoneNumbers.length],
      email: `info@${emailDomain}.com`,
      logo: logo,
      images: images,
      description: `${name} offers authentic ${cuisineType.toLowerCase()} cuisine with a modern twist. Our chefs use only the finest ingredients to create memorable dining experiences. Whether you're looking for a romantic dinner, family gathering, or business lunch, we provide exceptional service in a warm and inviting atmosphere.`,
      cuisineType: cuisineType,
      operatingHours: {
        monday: hours,
        tuesday: hours,
        wednesday: hours,
        thursday: hours,
        friday: hours,
        saturday: hours,
        sunday: { open: hours.open, close: hours.close === '00:00' ? '23:00' : hours.close },
      },
      capacity: capacity,
      rating: parseFloat(rating),
      totalReviews: totalReviews,
      priceRange: priceRange,
      website: website,
      socialMedia: social,
      amenities: ['Wi-Fi', 'Parking', 'Outdoor Seating', 'Wheelchair Accessible', 'Live Music'][i % 5] ? 
        ['Wi-Fi', 'Parking', 'Outdoor Seating', 'Wheelchair Accessible'].slice(0, 2 + (i % 3)) : 
        ['Wi-Fi', 'Parking'],
      status: status,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
  }
  
  return restaurants;
};

export const generateDummyOwners = (count: number = 20, restaurantIds: string[] = []): any[] => {
  const owners = [];
  const baseDate = new Date('2024-01-15');
  
  for (let i = 0; i < count; i++) {
    const name = ownerNames[i % ownerNames.length];
    const email = ownerEmails[i % ownerEmails.length].replace('@', `${i}@`);
    const restaurantId = restaurantIds[i % restaurantIds.length] || null;
    const createdAt = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString();
    
    owners.push({
      id: `owner-${i + 1}`,
      email: email,
      name: name,
      password: 'owner123',
      role: 'owner',
      restaurantId: restaurantId,
      createdAt: createdAt,
      restaurant: restaurantId ? {
        id: restaurantId,
        name: `Restaurant ${i + 1}`
      } : undefined
    });
  }
  
  return owners;
};

export const generateDummySubscriptions = (count: number = 20, restaurantIds: string[] = []): any[] => {
  const subscriptions = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < count; i++) {
    const status = subscriptionStatuses[i % subscriptionStatuses.length];
    const billingCycle = billingCycles[i % billingCycles.length];
    const planName = planNames[i % planNames.length];
    const restaurantId = restaurantIds[i % restaurantIds.length] || `rest-${i + 1}`;
    const startDate = new Date(baseDate.getTime() + i * 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);
    const nextBillingDate = new Date(startDate.getTime() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);
    
    subscriptions.push({
      id: `sub-${i + 1}`,
      restaurantId: restaurantId,
      planId: `plan-${(i % planNames.length) + 1}`,
      status: status,
      billingCycle: billingCycle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      createdAt: startDate.toISOString(),
      restaurant: {
        id: restaurantId,
        name: `Restaurant ${i + 1}`
      },
      plan: {
        id: `plan-${(i % planNames.length) + 1}`,
        name: planName,
        monthlyPrice: [29.99, 49.99, 79.99, 129.99, 199.99][i % planNames.length],
        yearlyPrice: [299.99, 499.99, 799.99, 1299.99, 1999.99][i % planNames.length]
      }
    });
  }
  
  return subscriptions;
};

