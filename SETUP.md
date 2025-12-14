# 🚀 DineFlow AI - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- MongoDB (optional, for analytics)
- OpenAI API key (optional, for AI features)

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

#### PostgreSQL Setup

1. Create a PostgreSQL database:
```bash
createdb dineflow
```

2. Update `server/.env` with your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dineflow?schema=public"
```

3. Run Prisma migrations:
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

#### MongoDB Setup (Optional)

1. Install MongoDB locally or use MongoDB Atlas
2. Update `server/.env`:
```
MONGODB_URI="mongodb://localhost:27017/dineflow-ai"
```

### 3. Environment Variables

#### Server (`server/.env`)

Copy `server/.env.example` to `server/.env` and update:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/dineflow?schema=public"
MONGODB_URI="mongodb://localhost:27017/dineflow-ai"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key-here
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-email@ethereal.email
EMAIL_PASS=your-ethereal-password
FRONTEND_URL=http://localhost:5173
```

#### Client (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create Admin User

You can create an admin user manually in the database or use Prisma Studio:

```bash
cd server
npx prisma studio
```

Create a user with:
- email: admin@dineflow.ai
- password: (hash with bcrypt)
- role: ADMIN

Or use this script:

```bash
cd server
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log('Hashed password:', hash);
"
```

Then insert into database:
```sql
INSERT INTO users (id, email, password, role, \"createdAt\", \"updatedAt\")
VALUES (gen_random_uuid(), 'admin@dineflow.ai', '<hashed-password>', 'ADMIN', NOW(), NOW());
```

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Login Credentials

After creating a restaurant, the admin will receive:
- Owner email: `owner-{timestamp}@dineflow.ai`
- Temporary password: `DineFlow{random}`

## Features

### Admin Panel
- Create restaurants
- Auto-generate owner accounts
- View all restaurants and owners
- Manage system-wide settings

### Owner Dashboard
- Configure tables
- Manage menu items
- Generate AI descriptions
- View orders and bills
- Generate QR codes for tables

### Customer View
- Scan QR code to access menu
- Browse menu items
- Add items to cart
- View bill and download PDF

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

### Port Already in Use
- Change PORT in `server/.env`
- Change port in `client/vite.config.ts`

### CORS Issues
- Ensure FRONTEND_URL matches your client URL
- Check CORS settings in `server/src/index.ts`

## Production Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Build the server:
```bash
cd server
npm run build
```

3. Set NODE_ENV=production
4. Use a process manager like PM2
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

## Support

For issues or questions, check the README.md or create an issue in the repository.















