# Krishna Millet App — Deployment Guide

## Local Development

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed   # Seeds 30 food items + admin/demo users
npm run dev    # Starts on port 5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev    # Starts on port 5173 (proxies API to 5000)
```

### Demo Accounts
| Role     | Email                        | Password     |
|----------|------------------------------|-------------|
| Admin    | admin@krishnamillets.com     | admin123456 |
| Customer | demo@customer.com            | demo123456  |

---

## Production Deployment

### Backend → Render.com
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = strong random string
   - `JWT_EXPIRE` = 7d
   - `NODE_ENV` = production
   - `CLIENT_URL` = your Vercel frontend URL

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Set root directory to `client`
3. Framework preset: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g., https://krishna-millets-api.onrender.com)
5. Deploy!

### MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string and set as `MONGO_URI`
4. Whitelist IPs (0.0.0.0/0 for Render)

---

## Security Best Practices
- ✅ JWT tokens with expiration
- ✅ bcrypt password hashing (12 salt rounds)
- ✅ Helmet.js security headers
- ✅ Rate limiting (100 req/15min)
- ✅ CORS whitelist
- ✅ Input validation on all models
- ✅ Admin-only route protection
- ✅ Environment variables for secrets

## Production Optimizations
- ✅ Gzip compression (compression middleware)
- ✅ MongoDB indexes on frequently queried fields
- ✅ Vite production build with tree-shaking
- ✅ Lazy loading ready (code split by routes)
- ✅ Image optimization ready (swap emoji placeholders for optimized images)

## Scaling for Multiple Food Trucks
- Add `vendor` field to FoodItem and Order schemas
- Create Vendor model with location, hours, menu
- Add vendor-specific dashboards
- Implement geolocation-based vendor discovery
- Use MongoDB geospatial indexes for nearby vendors
