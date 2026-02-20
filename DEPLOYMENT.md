# 🚀 Deployment Guide — Krishna Millet App

**Stack:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)
**Cost:** Completely FREE on all three platforms.

---

## Step 1: MongoDB Atlas (Database)

### 1.1 Create a Free Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Sign up / Log in
2. Click **"Build a Database"** → Select **M0 Free Tier**
3. Choose provider: **AWS**, Region: **Mumbai (ap-south-1)** (closest to India)
4. Cluster name: `krishna-millet-cluster` → Click **Create Cluster**

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar) → **Add New Database User**
2. Authentication: **Password**
   - Username: `krishna_admin`
   - Password: *generate a strong password* (copy it!)
3. Database User Privileges: **Atlas Admin** → Click **Add User**

### 1.3 Whitelist IP Addresses

1. Go to **Network Access** (left sidebar) → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)  
   > ⚠️ Required for Render's dynamic IPs. For production, use Render's static outbound IPs.
3. Click **Confirm**

### 1.4 Get Connection String

1. Go to **Database** → Click **Connect** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **6.0 or later**
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://krishna_admin:<password>@krishna-millet-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add the database name before `?`:
   ```
   mongodb+srv://krishna_admin:YOUR_PASSWORD@krishna-millet-cluster.xxxxx.mongodb.net/krishna-millet-app?retryWrites=true&w=majority
   ```

Save this — you'll need it for Render.

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```bash
cd c:\milletApp

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Krishna Millet App"
```

### 2.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `krishna-millet-app`
3. Visibility: **Public** (required for free Render/Vercel)
4. Do NOT initialize with README (we already have code)
5. Click **Create repository**

### 2.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/krishna-millet-app.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

### 3.1 Create Web Service

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **Web Service**
3. Connect your `krishna-millet-app` repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `krishna-millet-api` |
| **Region** | Oregon (US West) or Singapore |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### 3.2 Set Environment Variables

In Render dashboard → **Environment** tab, add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://krishna_admin:YOUR_PASSWORD@...` (from Step 1.4) |
| `JWT_SECRET` | `krishna_millet_prod_secret_key_2026_xyz` (make this unique!) |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | *(leave empty for now — add after Vercel deploy)* |

5. Click **Create Web Service**
6. Wait 2-5 minutes for the build to complete
7. Your backend URL will be like: `https://krishna-millet-api.onrender.com`

### 3.3 Verify Backend

Open in browser:
```
https://krishna-millet-api.onrender.com/api/health
```
You should see: `{"success":true,"message":"Krishna Millet App API is running 🌾"}`

> ⚠️ **Note:** Free Render services sleep after 15 minutes of inactivity. First request after sleep takes ~30-50 seconds to spin up. This is normal for the free tier.

---

## Step 4: Seed Production Database

After your Render backend is live, seed data into MongoDB Atlas:

### Option A: Seed from your local machine

```bash
cd c:\milletApp\server

# Temporarily set MONGO_URI to your Atlas connection string
set MONGO_URI=mongodb+srv://krishna_admin:YOUR_PASSWORD@krishna-millet-cluster.xxxxx.mongodb.net/krishna-millet-app?retryWrites=true&w=majority

# Run seed
node seed/seedData.js
```

### Option B: Seed via Render Shell

1. Go to your Render service → **Shell** tab
2. Run: `node seed/seedData.js`

You should see: `✅ 35 food items seeded! ✅ 175 reviews seeded!`

---

## Step 5: Deploy Frontend on Vercel

### 5.1 Import Project

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **Project**
3. Import your `krishna-millet-app` repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |

### 5.2 Set Environment Variable

Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://krishna-millet-api.onrender.com` |

> ⚠️ **No trailing slash!** The URL should NOT end with `/`

5. Click **Deploy**
6. Wait 1-2 minutes for the build
7. Your frontend URL will be like: `https://krishna-millet-app.vercel.app`

---

## Step 6: Connect Frontend ↔ Backend

### 6.1 Update Render's CLIENT_URL

1. Go back to Render dashboard → your web service → **Environment**
2. Add/update the `CLIENT_URL` variable:
   ```
   https://krishna-millet-app.vercel.app
   ```
3. Click **Save Changes** → Render will auto-redeploy

### 6.2 Verify Everything Works

1. Open `https://krishna-millet-app.vercel.app`
2. ✅ Homepage should load with food cards and real images
3. ✅ Click on a food item → detail page loads
4. ✅ Register a new account → login works
5. ✅ Add items to cart → checkout flow works

---

## Troubleshooting

### Frontend shows fallback data instead of real data
- **Cause:** `VITE_API_URL` not set or wrong
- **Fix:** In Vercel → Settings → Environment Variables, ensure `VITE_API_URL` is set to your Render backend URL (no trailing slash). **Redeploy** after changing env vars.

### CORS errors in browser console
- **Cause:** `CLIENT_URL` not set on Render
- **Fix:** Add your Vercel URL to `CLIENT_URL` in Render env vars. Redeploy.

### Backend returns 502/503 
- **Cause:** Render free tier put the service to sleep
- **Fix:** Wait 30-50 seconds — it auto-wakes on first request. For always-on, upgrade to Render's paid plan ($7/month).

### MongoDB connection timeout
- **Cause:** IP not whitelisted in Atlas
- **Fix:** Go to Atlas → Network Access → Ensure `0.0.0.0/0` is allowed

### "Cannot GET /menu" or blank page on route refresh
- **Cause:** Missing SPA rewrites
- **Fix:** Ensure `client/vercel.json` exists with the rewrites config. Redeploy.

---

## Architecture Overview

```
┌────────────────────┐     HTTPS      ┌────────────────────┐     MongoDB     ┌──────────────────┐
│                    │ ──────────────► │                    │ ─────────────► │                  │
│   Vercel (Free)    │                 │   Render (Free)    │                │  Atlas (Free)    │
│                    │ ◄────────────── │                    │ ◄───────────── │                  │
│   React Frontend   │    JSON API     │   Express Backend  │    Mongoose    │  MongoDB M0      │
│   - Vite build     │                 │   - REST API       │                │  - 512 MB        │
│   - TailwindCSS    │                 │   - JWT Auth       │                │  - Shared RAM    │
│   - Redux          │                 │   - Rate Limiting  │                │  - Auto backups  │
│                    │                 │                    │                │                  │
└────────────────────┘                 └────────────────────┘                └──────────────────┘
    vercel.app                          onrender.com                         mongodb.net
```

---

## Free Tier Limits

| Service | Limit | Impact |
|---------|-------|--------|
| **Vercel** | 100 GB bandwidth/month, 6000 mins build | More than enough for portfolio/demo |
| **Render** | 750 hours/month, sleeps after 15 min idle | Cold starts take ~30-50s after sleep |
| **MongoDB Atlas** | 512 MB storage, shared vCPU | Plenty for 35 items + reviews + users |

> 💡 **Tip:** To keep Render awake, set up a free cron job at [cron-job.org](https://cron-job.org) to ping `https://your-api.onrender.com/api/health` every 14 minutes.
