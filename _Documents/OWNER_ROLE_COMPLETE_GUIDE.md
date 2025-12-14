# Restaurant Owner - Complete Role Guide

## 🎯 Your Role as Restaurant Owner

As a **Restaurant Owner**, you have full control over your restaurant's operations through the DineFlow AI platform. This guide explains all your available features, actions, and workflows.

---

## 📊 Dashboard Overview

**Location:** `/owner` (Home Dashboard)

**What You See:**
- **Key Statistics Cards:**
  - Total Tables
  - Menu Items Count
  - Total Orders
  - Revenue Summary

**Quick Actions:**
- Navigate to any section via sidebar
- View real-time restaurant performance

---

## 🍽️ Menu Management

**Location:** `/owner/menu`

### ✅ Available Actions:

1. **View Menu Items**
   - Browse all items organized by category
   - See item availability status
   - View prices and descriptions

2. **Add New Menu Item**
   - Click "Add Item" button
   - Fill in:
     - Item name (required)
     - Category (required)
     - Price (required)
     - Description (optional)
     - Image URL (optional)
     - Availability toggle
   - Save item

3. **Edit Menu Item**
   - Click edit icon on any item
   - Update any field
   - Save changes

4. **Delete Menu Item**
   - Click delete icon
   - Confirm deletion

5. **Generate AI Description**
   - Click sparkles icon on items without AI description
   - AI automatically generates appealing description

6. **Search & Filter**
   - Search by name, description, or category
   - Filter by category
   - Sort by name or price

### 🔄 Workflow:
```
Dashboard → Menu → View Items
  ├─ Add Item → Fill Form → Save
  ├─ Edit Item → Update → Save
  ├─ Delete Item → Confirm
  └─ Generate AI Description → Auto-generate
```

---

## 🪑 Table Management

**Location:** `/owner/tables`

### ✅ Available Actions:

1. **View All Tables**
   - See table number, capacity, and status
   - View status indicators (Available/Occupied/Reserved)

2. **Add New Table**
   - Click "Add Table"
   - Enter:
     - Table number (required)
     - Capacity in guests (required)
     - Initial status
   - Save

3. **Edit Table**
   - Click edit icon
   - Update table number, capacity, or status
   - Save changes

4. **Generate QR Code**
   - Click "Generate QR" button
   - QR code is created automatically
   - View QR code in modal
   - Download QR code image
   - Print and place on table

5. **Update Table Status**
   - Quick status buttons on each table card
   - Switch between: Available, Occupied, Reserved

6. **Delete Table**
   - Click delete icon
   - Confirm deletion

### 🔄 Workflow:
```
Dashboard → Tables → View Tables
  ├─ Add Table → Set Number/Capacity → Save
  ├─ Generate QR → View/Download QR Code
  ├─ Update Status → Click Status Button
  └─ Delete Table → Confirm
```

---

## 🛒 Order Management

**Location:** `/owner/orders`

### ✅ Available Actions:

1. **View All Orders**
   - See order number, table, status, amount, date
   - Filter by status (Pending, Confirmed, Preparing, Ready, Completed, Cancelled)
   - Filter by date (Today, This Week, All Time)
   - Search by order number or item name

2. **View Order Details**
   - Click "View Details" button
   - See complete order information:
     - Order items with quantities
     - Individual prices
     - Total amount
     - Table information
     - Order timeline

3. **Update Order Status**
   - Status workflow: Pending → Confirmed → Preparing → Ready → Completed
   - Click status buttons to advance order
   - Can cancel orders if needed

4. **Order Statistics**
   - View counts by status on dashboard cards
   - Track order volume

### 🔄 Workflow:
```
Dashboard → Orders → View Orders
  ├─ Filter/Search Orders
  ├─ View Details → See Full Order Info
  ├─ Update Status → Advance Through Workflow
  │   ├─ Confirm Order
  │   ├─ Mark as Preparing
  │   ├─ Mark as Ready
  │   └─ Complete Order
  └─ Cancel Order (if needed)
```

### Order Status Flow:
```
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
   ↓
CANCELLED (can cancel at any stage)
```

---

## 💰 Bills & Invoices

**Location:** `/owner/bills`

### ✅ Available Actions:

1. **View All Bills**
   - See bill number, order number, table, amount, date
   - View payment status (Paid/Pending)
   - Filter by date (Today, This Week, This Month, All Time)
   - Search by bill number or order number

2. **View Bill Details**
   - Click "View" button
   - See complete breakdown:
     - Subtotal
     - Tax
     - Discounts
     - Total amount
     - Payment method
     - Payment status

3. **Download PDF Invoice**
   - Click "PDF" button on any bill
   - PDF downloads automatically
   - Share with customers or keep records

4. **Revenue Statistics**
   - Total Revenue card
   - Paid Bills count
   - Pending Bills count

### 🔄 Workflow:
```
Orders → Order Completed → Bill Generated
  ├─ View Bill Details
  ├─ Download PDF Invoice
  └─ Track Payment Status
```

---

## 🎁 Loyalty Programs

**Location:** `/owner/loyalty`

### ✅ Available Actions:

1. **View Loyalty Programs**
   - See all your loyalty programs
   - View program type (Points/Stamps/Tier)
   - See member count and rewards

2. **Create Loyalty Program**
   - Click "Create Program"
   - Enter:
     - Program name
     - Description
     - Program type (Points/Stamps/Tier)
     - Points per dollar (for points-based)
     - Points per order (for points-based)
   - Save and activate

3. **Edit Program**
   - Click edit icon
   - Update program settings
   - Save changes

4. **Activate/Deactivate**
   - Toggle program status
   - Pause programs temporarily

5. **Delete Program**
   - Click delete icon
   - Confirm deletion

### 🔄 Workflow:
```
Dashboard → Loyalty → View Programs
  ├─ Create Program → Configure Rules → Activate
  ├─ Edit Program → Update Settings → Save
  ├─ Activate/Deactivate → Toggle Status
  └─ Delete Program → Confirm
```

---

## 🎫 Coupon Engine

**Location:** `/owner/coupons`

### ✅ Available Actions:

1. **View All Coupons**
   - See coupon code, name, discount, status
   - View usage statistics
   - Filter by status (Active/Inactive/Expired/Paused)
   - Search by code or name

2. **Create Coupon**
   - Click "Create Coupon"
   - Configure:
     - Coupon code (e.g., WELCOME10)
     - Coupon name
     - Type: Percentage, Fixed Amount, or Free Item
     - Discount value
     - Minimum order amount (optional)
     - Maximum discount cap (for percentage)
     - Validity period (from/to dates)
     - Usage limit (optional)
     - Target audience (All/New/Existing customers)
   - Save and activate

3. **Edit Coupon**
   - Click edit icon
   - Update any settings
   - Save changes

4. **Copy Coupon Code**
   - Click "Copy" button
   - Code copied to clipboard
   - Share with customers

5. **Delete Coupon**
   - Click delete icon
   - Confirm deletion

6. **View Statistics**
   - Total coupons count
   - Active coupons count
   - Total usage count

### 🔄 Workflow:
```
Dashboard → Coupons → View Coupons
  ├─ Create Coupon → Configure → Activate
  ├─ Copy Code → Share with Customers
  ├─ Edit Coupon → Update → Save
  └─ Delete Coupon → Confirm
```

---

## ⚙️ Restaurant Profile & Settings

**Location:** `/owner/settings`

### ✅ Available Actions:

1. **Update Restaurant Information**
   - Restaurant name
   - Description
   - Address
   - Phone number
   - Email address

2. **Upload Restaurant Logo**
   - Enter logo image URL
   - Preview logo
   - Remove logo if needed

3. **Save Changes**
   - Click "Save Changes" button
   - Updates applied immediately

### 🔄 Workflow:
```
Dashboard → Settings → Edit Profile
  ├─ Update Information
  ├─ Upload Logo
  └─ Save Changes
```

---

## 💳 Billing Configuration

**Location:** `/owner/billing-configuration`

### ✅ Available Actions:

1. **Configure Tax Settings**
   - Set tax percentage
   - Enable/disable tax

2. **Service Charge**
   - Set service charge percentage
   - Configure rules

3. **Payment Methods**
   - Enable payment gateways
   - Configure Stripe/UPI settings

4. **Discount Rules**
   - Set default discount policies

---

## 📱 Navigation Menu

Your sidebar includes:

1. **Dashboard** - Overview and statistics
2. **Tables** - Manage tables and QR codes
3. **Menu** - Manage menu items
4. **Orders** - View and process orders
5. **Bills** - View invoices and payments
6. **Loyalty** - Manage loyalty programs
7. **Coupons** - Create and manage coupons
8. **Billing Config** - Configure billing settings
9. **Settings** - Restaurant profile

---

## 🔐 Your Permissions

### ✅ You CAN:
- Manage your restaurant's menu items
- Create and manage tables
- View and update orders
- Generate and manage bills
- Create loyalty programs
- Create and manage coupons
- Update restaurant profile
- Generate QR codes
- Use AI features for menu optimization
- View your restaurant's analytics

### ❌ You CANNOT:
- Access other restaurants' data
- Create other restaurants
- Create other owners
- Manage system-wide settings
- Access admin-only features
- Modify subscription plans (view only)

---

## 🚀 Quick Start Guide

### First Time Setup:

1. **Login** → `/login` with your owner credentials
2. **Set Up Tables** → Go to Tables → Add tables → Generate QR codes
3. **Create Menu** → Go to Menu → Add menu items
4. **Configure Settings** → Go to Settings → Update restaurant info
5. **Set Up Loyalty** (Optional) → Create loyalty program
6. **Create Coupons** (Optional) → Create promotional coupons

### Daily Operations:

1. **Morning:** Check dashboard for overnight orders
2. **During Service:**
   - Monitor Orders page for new orders
   - Update order status as kitchen progresses
   - Generate bills when orders complete
3. **End of Day:**
   - Review Bills page for daily revenue
   - Check order statistics
   - Update table statuses

---

## 📈 Key Metrics You Can Track

- **Total Tables** - Number of tables configured
- **Menu Items** - Total items in your menu
- **Orders** - Total orders received
- **Revenue** - Total revenue generated
- **Order Status Distribution** - Orders by status
- **Bill Status** - Paid vs pending bills

---

## 🎯 Best Practices

1. **Menu Management:**
   - Keep items organized by category
   - Use AI descriptions for better appeal
   - Update availability in real-time
   - Add high-quality images

2. **Table Management:**
   - Generate QR codes for all tables
   - Keep table status updated
   - Print and place QR codes prominently

3. **Order Processing:**
   - Update status promptly
   - Confirm orders quickly
   - Mark ready when kitchen finishes
   - Complete orders after service

4. **Loyalty & Coupons:**
   - Create attractive loyalty programs
   - Use coupons for promotions
   - Monitor usage and effectiveness

---

## 🔗 Access Points

- **Login:** `/login`
- **Dashboard:** `/owner`
- **Tables:** `/owner/tables`
- **Menu:** `/owner/menu`
- **Orders:** `/owner/orders`
- **Bills:** `/owner/bills`
- **Loyalty:** `/owner/loyalty`
- **Coupons:** `/owner/coupons`
- **Settings:** `/owner/settings`

---

## 💡 Tips

- Use search and filters to quickly find items
- Generate QR codes immediately after creating tables
- Update order status in real-time for better customer experience
- Download PDF invoices for record keeping
- Monitor loyalty program engagement
- Track coupon usage to measure effectiveness

---

**Last Updated:** All features implemented and ready to use!
**Status:** ✅ Complete

