# Customer-Facing Features - Implementation Plan

## 📋 Overview
This document outlines the complete implementation plan for customer-facing features that end users will use in restaurants via QR code scanning.

---

## 🎯 Current Status

### ✅ **Already Implemented**
1. **Basic Menu Browsing** (`CustomerMenuPage.tsx`)
   - View menu items by category
   - Restaurant information display
   - Table number display

2. **Shopping Cart** (`CustomerMenuPage.tsx`)
   - Add items to cart
   - Remove items from cart
   - Quantity management
   - Cart sidebar

3. **Order Placement** (`CustomerMenuPage.tsx`)
   - Basic order creation
   - Order submission

4. **Order Confirmation** (`OrderConfirmationPage.tsx`)
   - Order details display
   - Order number display
   - Basic status display

---

## 🚀 Implementation Plan

### **Phase 1: Core Customer Experience (High Priority)**

#### 1.1 **QR Code Entry Point**
**Status:** ❌ Not Implemented  
**Priority:** 🔴 Critical

**Features:**
- QR code scanner page (`/scan` or `/qr/:code`)
- QR code validation
- Auto-redirect to menu with restaurant ID and table number
- Error handling for invalid/expired QR codes
- Mobile-optimized camera access

**Files to Create:**
- `client/src/pages/customer/QRScanPage.tsx`
- `client/src/components/customer/QRScanner.tsx`

**API Endpoints Needed:**
- `GET /tables/:tableId/validate` - Validate table QR code
- `GET /restaurants/:id/public` - Get restaurant public info (exists)

**Dependencies:**
- QR code scanning library (e.g., `react-qr-reader`, `html5-qrcode`)
- Camera permissions handling

---

#### 1.2 **Enhanced Menu Experience**
**Status:** 🟡 Partially Implemented  
**Priority:** 🔴 Critical

**Enhancements Needed:**
- ✅ Menu browsing (exists)
- ❌ Search functionality
- ❌ Filter by dietary preferences (vegetarian, vegan, gluten-free, etc.)
- ❌ Sort options (price, popularity, name)
- ❌ Item availability indicators (real-time)
- ❌ Item recommendations (AI-powered)
- ❌ Favorite items
- ❌ Recently viewed items
- ❌ Menu item details modal (full description, ingredients, allergens)

**Files to Update:**
- `client/src/pages/customer/CustomerMenuPage.tsx`

**New Components:**
- `client/src/components/customer/MenuSearch.tsx`
- `client/src/components/customer/MenuFilters.tsx`
- `client/src/components/customer/MenuItemModal.tsx`
- `client/src/components/customer/ItemRecommendations.tsx`

---

#### 1.3 **Enhanced Cart & Checkout**
**Status:** 🟡 Partially Implemented  
**Priority:** 🔴 Critical

**Enhancements Needed:**
- ✅ Basic cart (exists)
- ❌ Apply coupon codes
- ❌ Apply loyalty points/discounts
- ❌ Special instructions per item
- ❌ Cart persistence (localStorage)
- ❌ Estimated preparation time
- ❌ Order notes/comments
- ❌ Split bill option
- ❌ Save cart for later

**Files to Update:**
- `client/src/pages/customer/CustomerMenuPage.tsx`

**New Components:**
- `client/src/components/customer/CouponInput.tsx`
- `client/src/components/customer/LoyaltyPointsRedeem.tsx`
- `client/src/components/customer/CartItemOptions.tsx`
- `client/src/components/customer/OrderNotes.tsx`

**API Endpoints Needed:**
- `POST /coupons/validate` - Validate coupon code
- `GET /loyalty/points/:customerId` - Get customer loyalty points
- `POST /loyalty/redeem` - Redeem loyalty points

---

#### 1.4 **Payment Integration**
**Status:** ❌ Not Implemented  
**Priority:** 🔴 Critical

**Features:**
- Multiple payment methods:
  - Credit/Debit Card (Stripe)
  - UPI (India)
  - Digital Wallets
  - Cash on Delivery (if enabled)
- Payment gateway integration
- Secure payment processing
- Payment confirmation
- Receipt generation

**Files to Create:**
- `client/src/pages/customer/PaymentPage.tsx`
- `client/src/components/customer/PaymentMethods.tsx`
- `client/src/components/customer/StripePayment.tsx`
- `client/src/components/customer/UPIPayment.tsx`

**API Endpoints Needed:**
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/upi` - Process UPI payment
- `GET /payments/:paymentId/status` - Check payment status

**Dependencies:**
- Stripe.js for card payments
- UPI payment gateway integration
- Payment state management

---

#### 1.5 **Order Tracking**
**Status:** ❌ Not Implemented  
**Priority:** 🟠 High

**Features:**
- Real-time order status updates
- Order status timeline (Pending → Confirmed → Preparing → Ready → Completed)
- Estimated time remaining
- Push notifications (optional)
- Order history
- Re-order functionality

**Files to Create:**
- `client/src/pages/customer/OrderTrackingPage.tsx`
- `client/src/pages/customer/OrderHistoryPage.tsx`
- `client/src/components/customer/OrderStatusTimeline.tsx`
- `client/src/components/customer/OrderCard.tsx`

**API Endpoints Needed:**
- `GET /orders/:orderId/track` - Get order status
- `GET /orders/customer/:customerId` - Get customer order history
- WebSocket connection for real-time updates (optional)

**Real-time Updates:**
- WebSocket integration for live status
- Polling fallback
- Browser notifications

---

### **Phase 2: Engagement Features (Medium Priority)**

#### 2.1 **Loyalty Program Integration**
**Status:** ❌ Not Implemented  
**Priority:** 🟠 High

**Features:**
- View loyalty points balance
- Points earning display (on order)
- Points redemption at checkout
- Loyalty tier display
- Rewards catalog
- Points history

**Files to Create:**
- `client/src/pages/customer/LoyaltyPage.tsx`
- `client/src/components/customer/LoyaltyPointsDisplay.tsx`
- `client/src/components/customer/RewardsCatalog.tsx`
- `client/src/components/customer/PointsHistory.tsx`

**API Endpoints Needed:**
- `GET /loyalty/customer/:customerId` - Get customer loyalty info
- `GET /loyalty/rewards/:restaurantId` - Get available rewards
- `POST /loyalty/redeem` - Redeem reward
- `GET /loyalty/transactions/:customerId` - Get points history

---

#### 2.2 **Coupon System**
**Status:** ❌ Not Implemented  
**Priority:** 🟠 High

**Features:**
- View available coupons
- Apply coupon at checkout
- Coupon validation
- Discount display
- Coupon expiration tracking
- Promotional banners

**Files to Create:**
- `client/src/components/customer/CouponBanner.tsx`
- `client/src/components/customer/AvailableCoupons.tsx`
- `client/src/components/customer/CouponModal.tsx`

**API Endpoints Needed:**
- `GET /coupons/available/:restaurantId` - Get available coupons
- `POST /coupons/apply` - Apply coupon to order
- `GET /coupons/:code/validate` - Validate coupon code

---

#### 2.3 **Customer Account/Profile**
**Status:** ❌ Not Implemented  
**Priority:** 🟡 Medium

**Features:**
- Customer registration (optional)
- Guest checkout option
- Profile management
- Order history
- Favorite restaurants
- Saved addresses
- Payment methods management
- Notification preferences

**Files to Create:**
- `client/src/pages/customer/ProfilePage.tsx`
- `client/src/pages/customer/RegisterPage.tsx`
- `client/src/components/customer/ProfileForm.tsx`
- `client/src/components/customer/SavedAddresses.tsx`

**API Endpoints Needed:**
- `POST /customers/register` - Register customer
- `GET /customers/:id` - Get customer profile
- `PUT /customers/:id` - Update profile
- `GET /customers/:id/addresses` - Get saved addresses
- `POST /customers/:id/addresses` - Add address

---

### **Phase 3: Advanced Features (Lower Priority)**

#### 3.1 **Bill/Invoice Viewing**
**Status:** ❌ Not Implemented  
**Priority:** 🟡 Medium

**Features:**
- View bill after order completion
- Download PDF invoice
- Email receipt option
- Bill breakdown
- Tax details
- Payment confirmation

**Files to Create:**
- `client/src/pages/customer/BillViewPage.tsx`
- `client/src/components/customer/BillDetails.tsx`

**API Endpoints Needed:**
- `GET /bills/:billId/public` - Get bill details
- `GET /bills/:billId/pdf` - Download PDF
- `POST /bills/:billId/email` - Email receipt

---

#### 3.2 **Reviews & Ratings**
**Status:** ❌ Not Implemented  
**Priority:** 🟡 Medium

**Features:**
- Rate order experience
- Write reviews
- View restaurant ratings
- Photo uploads (optional)
- Review history

**Files to Create:**
- `client/src/pages/customer/ReviewPage.tsx`
- `client/src/components/customer/RatingForm.tsx`
- `client/src/components/customer/ReviewCard.tsx`

**API Endpoints Needed:**
- `POST /reviews` - Submit review
- `GET /reviews/:restaurantId` - Get restaurant reviews
- `GET /reviews/customer/:customerId` - Get customer reviews

---

#### 3.3 **AI Recommendations**
**Status:** ❌ Not Implemented  
**Priority:** 🟢 Low

**Features:**
- Personalized menu recommendations
- "You might also like" suggestions
- Popular items
- Trending items
- Dietary preference recommendations

**Files to Create:**
- `client/src/components/customer/AIRecommendations.tsx`
- `client/src/components/customer/PopularItems.tsx`

**API Endpoints Needed:**
- `GET /ai/recommendations/:restaurantId` - Get AI recommendations
- `GET /menu/popular/:restaurantId` - Get popular items

---

#### 3.4 **Social Features**
**Status:** ❌ Not Implemented  
**Priority:** 🟢 Low

**Features:**
- Share order on social media
- Refer friends
- Group ordering
- Split bills with friends

**Files to Create:**
- `client/src/components/customer/ShareOrder.tsx`
- `client/src/components/customer/ReferralCode.tsx`

---

## 📁 File Structure

```
client/src/
├── pages/
│   └── customer/
│       ├── QRScanPage.tsx              [NEW]
│       ├── CustomerMenuPage.tsx         [ENHANCE]
│       ├── PaymentPage.tsx              [NEW]
│       ├── OrderTrackingPage.tsx        [NEW]
│       ├── OrderHistoryPage.tsx         [NEW]
│       ├── OrderConfirmationPage.tsx    [ENHANCE]
│       ├── LoyaltyPage.tsx              [NEW]
│       ├── ProfilePage.tsx              [NEW]
│       ├── BillViewPage.tsx             [NEW]
│       └── ReviewPage.tsx               [NEW]
│
├── components/
│   └── customer/
│       ├── QRScanner.tsx                [NEW]
│       ├── MenuSearch.tsx               [NEW]
│       ├── MenuFilters.tsx              [NEW]
│       ├── MenuItemModal.tsx            [NEW]
│       ├── CouponInput.tsx              [NEW]
│       ├── LoyaltyPointsRedeem.tsx      [NEW]
│       ├── PaymentMethods.tsx           [NEW]
│       ├── StripePayment.tsx            [NEW]
│       ├── UPIPayment.tsx               [NEW]
│       ├── OrderStatusTimeline.tsx       [NEW]
│       ├── OrderCard.tsx                 [NEW]
│       ├── LoyaltyPointsDisplay.tsx     [NEW]
│       ├── RewardsCatalog.tsx           [NEW]
│       ├── CouponBanner.tsx              [NEW]
│       ├── AvailableCoupons.tsx         [NEW]
│       ├── ProfileForm.tsx              [NEW]
│       ├── BillDetails.tsx              [NEW]
│       ├── RatingForm.tsx                [NEW]
│       └── AIRecommendations.tsx        [NEW]
│
└── utils/
    ├── payment.ts                       [NEW]
    ├── loyalty.ts                       [NEW]
    ├── coupons.ts                       [NEW]
    └── qrScanner.ts                     [NEW]
```

---

## 🔄 User Flows

### **Flow 1: Complete Ordering Flow**
```
1. Customer scans QR code at table
   ↓
2. QR Scan Page validates and redirects
   ↓
3. Customer Menu Page loads
   ↓
4. Customer browses menu (with search/filters)
   ↓
5. Customer adds items to cart
   ↓
6. Customer applies coupon (optional)
   ↓
7. Customer redeems loyalty points (optional)
   ↓
8. Customer proceeds to checkout
   ↓
9. Payment Page loads
   ↓
10. Customer selects payment method
   ↓
11. Payment processed
   ↓
12. Order Confirmation Page
   ↓
13. Order Tracking Page (real-time updates)
   ↓
14. Bill/Invoice available after completion
```

### **Flow 2: Order Tracking Flow**
```
1. Customer places order
   ↓
2. Order Confirmation shows order number
   ↓
3. Customer can view Order Tracking Page
   ↓
4. Real-time status updates:
   - Pending → Confirmed → Preparing → Ready → Completed
   ↓
5. Notification when ready
   ↓
6. Bill available for download
```

### **Flow 3: Loyalty & Rewards Flow**
```
1. Customer views menu
   ↓
2. Loyalty points balance displayed
   ↓
3. Customer earns points on order
   ↓
4. Customer can view rewards catalog
   ↓
5. Customer can redeem points at checkout
   ↓
6. Points history available
```

---

## 🎨 UI/UX Considerations

### **Mobile-First Design**
- All pages must be mobile-optimized
- Touch-friendly buttons and interactions
- Responsive layouts
- Fast loading times

### **Accessibility**
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

### **Performance**
- Lazy loading for images
- Code splitting
- Optimistic UI updates
- Caching strategies

### **User Experience**
- Clear navigation
- Loading states
- Error handling
- Success feedback
- Offline support (PWA)

---

## 🔌 API Integration Requirements

### **Backend Endpoints Needed**

#### **QR & Menu**
- `GET /tables/:tableId/validate` - Validate QR code
- `GET /restaurants/:id/public` - ✅ Exists
- `GET /items/public/:restaurantId` - ✅ Exists

#### **Orders**
- `POST /billing/orders/public` - ✅ Exists (needs enhancement)
- `GET /orders/:orderId/track` - Get order status
- `GET /orders/customer/:customerId` - Get order history
- `PUT /orders/:orderId/cancel` - Cancel order

#### **Payments**
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/upi` - Process UPI
- `GET /payments/:paymentId/status` - Payment status

#### **Loyalty**
- `GET /loyalty/customer/:customerId` - Get loyalty info
- `GET /loyalty/rewards/:restaurantId` - Get rewards
- `POST /loyalty/redeem` - Redeem points
- `GET /loyalty/transactions/:customerId` - Points history

#### **Coupons**
- `GET /coupons/available/:restaurantId` - Available coupons
- `POST /coupons/apply` - Apply coupon
- `GET /coupons/:code/validate` - Validate coupon

#### **Bills**
- `GET /billing/bills/:billId/public` - Get bill
- `GET /billing/bills/:billId/pdf` - Download PDF
- `POST /billing/bills/:billId/email` - Email receipt

#### **Customers**
- `POST /customers/register` - Register
- `GET /customers/:id` - Get profile
- `PUT /customers/:id` - Update profile

#### **Reviews**
- `POST /reviews` - Submit review
- `GET /reviews/:restaurantId` - Get reviews

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^2.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "html5-qrcode": "^2.3.0",
    "socket.io-client": "^4.5.0",
    "react-share": "^4.4.0",
    "react-rating-stars-component": "^2.2.0"
  }
}
```

---

## 🧪 Testing Requirements

### **Unit Tests**
- Component rendering
- User interactions
- State management
- API calls

### **Integration Tests**
- Complete order flow
- Payment processing
- Coupon application
- Loyalty redemption

### **E2E Tests**
- QR code scanning to order completion
- Payment flow
- Order tracking

---

## 📊 Success Metrics

### **Key Performance Indicators (KPIs)**
- Order completion rate
- Average order value
- Payment success rate
- Cart abandonment rate
- Time to complete order
- Customer satisfaction score
- Loyalty program engagement
- Coupon redemption rate

---

## 🚦 Implementation Priority

### **Sprint 1 (Week 1-2): Core Experience**
1. QR Code Entry Point
2. Enhanced Menu (search, filters)
3. Enhanced Cart (coupons, loyalty)
4. Payment Integration (basic)

### **Sprint 2 (Week 3-4): Order Management**
1. Order Tracking
2. Order History
3. Bill/Invoice Viewing
4. Real-time Updates

### **Sprint 3 (Week 5-6): Engagement**
1. Loyalty Program Integration
2. Coupon System
3. Customer Profile
4. Reviews & Ratings

### **Sprint 4 (Week 7-8): Polish & Advanced**
1. AI Recommendations
2. Social Features
3. Performance Optimization
4. Testing & Bug Fixes

---

## 🔐 Security Considerations

1. **Payment Security**
   - PCI DSS compliance
   - Secure payment tokenization
   - No card data storage

2. **Data Privacy**
   - GDPR compliance
   - Customer data encryption
   - Privacy policy

3. **Authentication**
   - Guest checkout option
   - Secure customer registration
   - Session management

4. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration

---

## 📝 Notes

- All customer pages should be public (no authentication required for basic features)
- Guest checkout should be supported
- Progressive Web App (PWA) features for offline support
- Multi-language support (future consideration)
- Dark mode support (future consideration)

---

**Last Updated:** Based on BRD and current codebase analysis  
**Status:** Ready for implementation  
**Next Steps:** Start with Phase 1, Sprint 1 features

