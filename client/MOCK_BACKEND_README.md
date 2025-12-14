# Mock Backend Setup

The frontend now uses a fake backend with dummy data for MVP testing. No backend server is required!

## How It Works

- All API requests are intercepted and return data from `src/data/fakeBackend.json`
- Mock mode is **enabled by default**
- To toggle mock mode, set `VITE_USE_FAKE_BACKEND=true` or `VITE_USE_FAKE_BACKEND=false` in your `.env` file

## Test Credentials

### Admin Login
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

### Owner Login (Italian Bistro)
- **Email:** `owner@italianbistro.com`
- **Password:** `owner123`
- **Restaurant ID:** `rest-1`

### Owner Login (Sushi House)
- **Email:** `owner@sushihouse.com`
- **Password:** `owner123`
- **Restaurant ID:** `rest-2`

## Available Data

The mock backend includes:
- ✅ 2 Restaurants (Italian Bistro & Sushi House)
- ✅ 3 Users (1 Admin, 2 Owners)
- ✅ 10 Menu Items (5 per restaurant)
- ✅ 6 Tables (4 for Italian Bistro, 2 for Sushi House)
- ✅ 3 Sample Orders
- ✅ 1 Sample Bill
- ✅ Restaurant statistics

## Testing Customer Menu

To test the customer menu page:
- Italian Bistro: `/menu/rest-1?table=1`
- Sushi House: `/menu/rest-2?table=1`

## Files

- `src/data/fakeBackend.json` - All dummy data
- `src/utils/mockApi.ts` - Mock API service
- `src/utils/api.ts` - Updated to use mock API

## Notes

- All API calls will show a console log: "🔧 Mock API Mode: ENABLED"
- Network delays are simulated (300-1000ms) for realistic feel
- QR code generation works (returns mock QR code URLs)
- PDF download works (returns mock PDF blob)

