# Deployment Guide

This project has a **frontend** (React + Vite) and **backend** (Node.js + Express). They need to be deployed separately.

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import the GitHub repository
4. Configure project:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://expense-tracker-api.railway.app`)

6. Click "Deploy"

Your frontend will be live at a Vercel URL like `https://expense-pro.vercel.app`

---

## Backend Deployment (Railway / Render / Fly.io)

Choose one of these services for the backend:

### Option A: Railway (Recommended - Simple)

1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect the backend and create a service
5. Set environment variables in the Railway dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string (use Railway's Postgres add-on)
   - `JWT_SECRET`: A random secure string
   - `PORT`: 4000

6. Deploy - Railway will build and run the backend
7. Get your backend URL from the Railway dashboard (e.g., `https://expense-tracker-api.railway.app`)

### Option B: Render (Free Tier Available)

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: expense-tracker-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npx tsc -p .`
   - **Start Command**: `cd backend && node dist/src/index.js`
   - **Plan**: Free (for testing)

5. Add Environment Variables:
   - `DATABASE_URL`: PostgreSQL URL (create database on Render or use external)
   - `JWT_SECRET`: Random secure string
   - `NODE_ENV`: production

6. Deploy

### Option C: Fly.io

1. Go to https://fly.io and sign up
2. Install Fly CLI: `brew install flyctl`
3. In the backend folder, run: `flyctl launch`
4. Configure and deploy

---

## Database Setup

You need a PostgreSQL database. Options:

1. **Railway**: Create a Postgres add-on (easiest)
2. **Render**: Create a free PostgreSQL instance
3. **Neon (Current Setup)**: Keep using your existing Neon database
4. **AWS RDS / DigitalOcean**: For production

Get your `DATABASE_URL` and set it as an environment variable on your hosting platform.

---

## After Deployment

1. **Update Frontend `VITE_API_URL`**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Set `VITE_API_URL` to your backend's live URL
   - Redeploy frontend

2. **Test the app**:
   - Visit your Vercel frontend URL
   - Register a new account
   - Add expenses and verify they save to the database
   - Log out and log in to verify persistence

3. **Run backend migrations** (if needed):
   ```bash
   cd backend
   npx prisma migrate deploy
   npm run prisma:seed
   ```

---

## Troubleshooting

### Frontend can't reach backend
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify backend is running and returning health check: `curl https://your-backend-url/health`
- Check browser console for CORS errors

### Database connection fails
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check that your database allows connections from your backend's IP
- For Neon: ensure database is accessible from the internet

### Build fails on Vercel/Render
- Check build logs for TypeScript errors
- Ensure all dependencies are in `package.json`
- For backend: ensure tsconfig.json is correct

---

## Summary

```
┌─────────────────────────────────────────┐
│  GitHub Repository                      │
│  (expense-tracker)                      │
└─────────────┬──────────┬────────────────┘
              │          │
        ┌─────┴──┐    ┌──┴─────┐
        │         │    │        │
    ┌───▼──┐  ┌──▼────▼───┐   │
    │      │  │           │   │
  [Vercel]  [Railway/Render]  [Neon DB]
  Frontend   Backend        (PostgreSQL)
  URL:       URL:           Connection: 
  https://   https://       DATABASE_URL
  expense-pro expense-tracker
  .vercel.app -api.railway.app
```

---

Enjoy your deployed expense tracker!
