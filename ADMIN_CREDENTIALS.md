# 🔐 Admin Credentials

**⚠️ IMPORTANT: This file is for development/testing purposes only. Do NOT commit sensitive credentials to production.**

## Default Admin Account

### Login Credentials

- **Email**: `admin@dineflow.ai`
- **Password**: `admin123`
- **Role**: `ADMIN`

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

Run the setup script to create the admin user:

```bash
cd server
npm run setup-admin
```

Or manually:

```bash
cd server
node scripts/create-admin.js
```

### Option 2: Manual Database Setup

1. **Hash the password**:

```bash
cd server
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

2. **Insert into database** (replace `<HASHED_PASSWORD>` with the output from step 1):

```sql
INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@dineflow.ai',
  '<HASHED_PASSWORD>',
  'ADMIN',
  NOW(),
  NOW()
);
```

### Option 3: Using Prisma Studio

1. Open Prisma Studio:

```bash
cd server
npx prisma studio
```

2. Navigate to the `users` table
3. Click "Add record"
4. Fill in:
   - email: `admin@dineflow.ai`
   - password: (use bcrypt hash from Option 2)
   - role: `ADMIN`

## Security Notes

- ⚠️ **Change the default password** before deploying to production
- ⚠️ **Never commit this file** to version control (already in .gitignore)
- ⚠️ **Use environment variables** for production credentials
- ✅ **This file is for local development only**

## Testing the Admin Account

1. Start the application: `npm run dev`
2. Navigate to: http://localhost:5173/login
3. Login with:
   - Email: `admin@dineflow.ai`
   - Password: `admin123`

## Creating Additional Admin Users

To create additional admin users, use the same process but change the email and password values.














