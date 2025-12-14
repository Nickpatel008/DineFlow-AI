# 🗄️ Database Setup Guide

## Issue: Login Failed

The login is failing because:
1. **Database connection is not configured** - The `.env` file has placeholder credentials
2. **Admin user doesn't exist** - Need to create it after database is set up

## Quick Fix Steps

### Step 1: Update Database URL

Edit `server/.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

**Current (placeholder):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dineflow?schema=public"
```

**Update to your actual credentials:**
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/dineflow?schema=public"
```

**Common examples:**
- Default PostgreSQL user: `postgresql://postgres:your_password@localhost:5432/dineflow?schema=public`
- If no password: `postgresql://postgres@localhost:5432/dineflow?schema=public`
- Custom user: `postgresql://myuser:mypassword@localhost:5432/dineflow?schema=public`

### Step 2: Create the Database

```bash
# Option 1: Using createdb command
createdb dineflow

# Option 2: Using psql
psql -U postgres -c "CREATE DATABASE dineflow;"

# Option 3: If you have a custom user
psql -U YOUR_USERNAME -c "CREATE DATABASE dineflow;"
```

### Step 3: Run Database Migrations

```bash
cd server
npx prisma migrate dev
```

This will:
- Create all the tables
- Set up the database schema
- Generate Prisma Client

### Step 4: Create Admin User

```bash
cd server
npm run setup-admin
```

Or manually using the register endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dineflow.ai",
    "password": "admin123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### Step 5: Test Login

1. Go to: http://localhost:5173/login
2. Enter:
   - Email: `admin@dineflow.ai`
   - Password: `admin123`

## Troubleshooting

### Error: "Authentication failed against database server"

**Solution**: Update `DATABASE_URL` in `server/.env` with correct credentials.

### Error: "Database does not exist"

**Solution**: Create the database first:
```bash
createdb dineflow
```

### Error: "relation does not exist"

**Solution**: Run migrations:
```bash
cd server
npx prisma migrate dev
```

### Error: "Admin user already exists"

**Solution**: The admin user is already created. Try logging in, or delete and recreate:
```bash
cd server
npx prisma studio
# Delete the admin user, then run setup-admin again
```

## Verify Database Connection

Test your database connection:

```bash
cd server
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connected successfully!');
    return prisma.\$disconnect();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"
```

## Quick Setup Script

Run this to set everything up at once (after updating DATABASE_URL):

```bash
cd server

# Create database (if it doesn't exist)
createdb dineflow 2>/dev/null || echo "Database may already exist"

# Run migrations
npx prisma migrate dev

# Create admin user
npm run setup-admin
```

## Need Help?

1. Check `server/.env` has correct `DATABASE_URL`
2. Verify PostgreSQL is running: `pg_isready`
3. Check database exists: `psql -l | grep dineflow`
4. Check server logs for detailed error messages















