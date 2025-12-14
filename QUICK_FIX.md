# ⚡ Quick Fix for Login Error

## The Problem
Login is failing because the database connection isn't configured properly.

## Immediate Solution

### 1. Edit `server/.env` file

Open `server/.env` and change this line:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dineflow?schema=public"
```

To your actual PostgreSQL credentials. **Most common:**

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/dineflow?schema=public"
```

**If you don't know your PostgreSQL password:**
- Try: `postgresql://postgres@localhost:5432/dineflow?schema=public` (no password)
- Or check your PostgreSQL setup

### 2. Create the database

```bash
createdb dineflow
```

### 3. Run migrations

```bash
cd server
npx prisma migrate dev
```

### 4. Create admin user

```bash
cd server
npm run setup-admin
```

### 5. Try logging in again

- Email: `admin@dineflow.ai`
- Password: `admin123`

---

## Alternative: Use Register Endpoint

If you can't run the script, register via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dineflow.ai",
    "password": "admin123",
    "name": "Admin",
    "role": "ADMIN"
  }'
```

Then login with those credentials.















