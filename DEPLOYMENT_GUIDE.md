# 🚀 Deploy OpenAux to Render - Complete Guide

## 📋 Overview

This guide will walk you through deploying OpenAux to Render (backend) and Vercel (frontend). The entire process takes about 15-20 minutes.

---

## ✅ Prerequisites

Before you start, ensure you have:

- [ ] GitHub account
- [ ] Render account ([Sign up free](https://render.com))
- [ ] Vercel account ([Sign up free](https://vercel.com))
- [ ] MongoDB Atlas database (already configured)
- [ ] YouTube API key (already configured)
- [ ] Your OpenAux code pushed to GitHub

---

## 🔧 Part 1: Prepare Your Code

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
cd c:\OpenAux
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - OpenAux ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/openaux.git
git branch -M main
git push -u origin main
```

### Step 2: Verify Environment Files

**Make sure `.gitignore` includes:**
```
# Server
server/.env
server/node_modules

# Client
client/.env
client/node_modules
client/dist
```

**DO NOT commit `.env` files!** We'll add them in Render/Vercel.

---

## 🖥️ Part 2: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not connected
   - Find and select your **openaux** repository
   - Click **"Connect"**

### Step 3: Configure Build Settings

Fill in the following settings:

#### **Basic Settings:**
```
Name: openaux-server
Region: Choose closest to you (e.g., Oregon, Frankfurt)
Branch: main
```

#### **Build & Deploy:**
```
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

#### **Instance Type:**
```
Select: Free (0.1 CPU, 512 MB RAM)
```

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `5000` | `5000` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user1:password@cluster0.fojlexo.mongodb.net/openaux?retryWrites=true&w=majority&appName=Cluster0` |
| `YOUTUBE_API_KEY` | Your YouTube API key | `AIzaSyA37H9zHDgH8rGHeyIJR0MjGqqOdl6DvPw` |
| `CLIENT_URL` | `https://openaux.vercel.app` | (We'll update this after deploying frontend) |

**Important Notes:**
- ⚠️ For `CLIENT_URL`, use a placeholder for now (e.g., `https://openaux.vercel.app`)
- ⚠️ We'll update it after deploying the frontend
- ⚠️ Make sure MongoDB URI is URL-encoded (special characters like `#` should be `%23`)

### Step 5: Create Web Service

1. Review all settings
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)

### Step 6: Verify Backend Deployment

Once deployed, you'll see:
```
✅ Deploy succeeded
Your service is live at https://openaux-server.onrender.com
```

**Test your backend:**
1. Copy the URL (e.g., `https://openaux-server.onrender.com`)
2. Open in browser
3. You should see: `{"message":"OpenAux API is running"}` or similar

**Save this URL!** You'll need it for the frontend.

---

## 🌐 Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your **openaux** repository
3. Click **"Import"**

### Step 3: Configure Project Settings

#### **Framework Preset:**
```
Framework: Vite
```

#### **Root Directory:**
```
Click "Edit" next to Root Directory
Select: client
Click "Continue"
```

#### **Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variables

Click **"Environment Variables"** section

Add these variables:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://openaux-server.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://openaux-server.onrender.com` |

**Important:**
- Replace `openaux-server` with YOUR actual Render service name
- Include `/api` at the end of `VITE_API_BASE_URL`
- Do NOT include `/api` in `VITE_SOCKET_URL`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (3-5 minutes)
3. You'll see: **"Congratulations! Your project has been deployed."**

### Step 6: Get Your Frontend URL

Once deployed, you'll see:
```
✅ Production Deployment
https://openaux-abc123.vercel.app
```

**Copy this URL!** We need to update the backend.

---

## 🔄 Part 4: Update Backend with Frontend URL

### Step 1: Go Back to Render

1. Open [Render Dashboard](https://dashboard.render.com)
2. Click on your **openaux-server** service

### Step 2: Update CLIENT_URL

1. Click **"Environment"** tab (left sidebar)
2. Find `CLIENT_URL` variable
3. Click **"Edit"** (pencil icon)
4. Update value to your Vercel URL:
   ```
   https://openaux-abc123.vercel.app
   ```
   (Replace with YOUR actual Vercel URL)
5. Click **"Save Changes"**

### Step 3: Redeploy Backend

1. Render will automatically redeploy
2. Wait for deployment to complete (2-3 minutes)
3. Look for: **"Deploy succeeded"**

---

## ✅ Part 5: Test Your Deployment

### Step 1: Open Your App

1. Go to your Vercel URL: `https://openaux-abc123.vercel.app`
2. You should see the OpenAux homepage

### Step 2: Test Create Room

1. Click **"Create Room"**
2. Browser will ask for location permission
3. Click **"Allow"**
4. Enter your name (optional)
5. Click **"Create Room"**
6. You should see the Host Dashboard with a room code

### Step 3: Test Join Room (on Mobile)

1. Open the Vercel URL on your phone
2. Click **"Join as Guest"**
3. Enter the room code from Step 2
4. Allow location permission
5. You should join the room

### Step 4: Test Song Search

1. As a guest, search for a song (e.g., "Blinding Lights")
2. Click **"Search"**
3. Results should appear
4. Click **"+"** to add to queue
5. Song should appear in the queue

### Step 5: Test Voting

1. Click **↑** or **↓** on a song
2. Vote count should update
3. All users should see the update

---

## 🐛 Troubleshooting

### Issue 1: Backend Deployment Failed

**Error:** "Build failed" or "Start command failed"

**Solutions:**
1. Check `server/package.json` has:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```
2. Verify `Root Directory` is set to `server`
3. Check Render logs for specific errors

### Issue 2: Frontend Build Failed

**Error:** "Build failed" or "Command failed"

**Solutions:**
1. Check `client/package.json` has:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```
2. Verify `Root Directory` is set to `client`
3. Check environment variables are correct

### Issue 3: CORS Error

**Error:** "Access to fetch at '...' from origin '...' has been blocked by CORS"

**Solutions:**
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly
2. Make sure there's no trailing slash
3. Redeploy backend after updating `CLIENT_URL`

### Issue 4: Socket Connection Failed

**Error:** "Failed to connect to server" or yellow reconnection banner

**Solutions:**
1. Check `VITE_SOCKET_URL` in Vercel
2. Ensure it's `https://` not `http://`
3. Verify backend is running (visit backend URL)
4. Check Render logs for errors

### Issue 5: Location Not Working

**Error:** "Location access required"

**Solutions:**
1. Ensure you're using HTTPS (Vercel provides this automatically)
2. Check browser location permissions
3. Try on a different browser
4. Ensure location services are enabled on device

### Issue 6: YouTube Search Not Working

**Error:** "Failed to search songs"

**Solutions:**
1. Verify `YOUTUBE_API_KEY` in Render environment variables
2. Check API quota in Google Cloud Console
3. Check Render logs for YouTube API errors

---

## 📊 Deployment Checklist

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] `.env` files NOT committed
- [ ] MongoDB Atlas database created
- [ ] YouTube API key obtained

### Backend (Render):
- [ ] Web Service created
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables added
- [ ] Deployment succeeded
- [ ] Backend URL saved

### Frontend (Vercel):
- [ ] Project imported
- [ ] Root Directory: `client`
- [ ] Framework: Vite
- [ ] Environment variables added
- [ ] Deployment succeeded
- [ ] Frontend URL saved

### Final Steps:
- [ ] Updated `CLIENT_URL` in Render
- [ ] Backend redeployed
- [ ] Tested create room
- [ ] Tested join room
- [ ] Tested song search
- [ ] Tested voting
- [ ] Tested on mobile

---

## 🎉 Success!

If all tests pass, your OpenAux app is now live!

### Your URLs:
- **Frontend**: `https://openaux-abc123.vercel.app`
- **Backend**: `https://openaux-server.onrender.com`

### Share Your App:
1. Share the frontend URL with friends
2. Create a room
3. Have them join and test
4. Enjoy your democratic jukebox!

---

## 🔧 Post-Deployment

### Custom Domain (Optional)

#### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

#### Render:
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records

### Monitoring

#### Render:
- View logs: Service → Logs tab
- Monitor metrics: Service → Metrics tab
- Set up alerts: Service → Settings → Notifications

#### Vercel:
- View deployments: Project → Deployments
- Check analytics: Project → Analytics
- Monitor performance: Project → Speed Insights

### Auto-Deploy

Both Render and Vercel automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render and Vercel will automatically deploy!
```

---

## 📝 Environment Variables Reference

### Backend (Render)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/openaux?retryWrites=true&w=majority
YOUTUBE_API_KEY=AIzaSyA37H9zHDgH8rGHeyIJR0MjGqqOdl6DvPw
CLIENT_URL=https://openaux-abc123.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_BASE_URL=https://openaux-server.onrender.com/api
VITE_SOCKET_URL=https://openaux-server.onrender.com
```

---

## 🆘 Need Help?

### Render Support:
- [Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

### Vercel Support:
- [Documentation](https://vercel.com/docs)
- [Community](https://github.com/vercel/vercel/discussions)
- [Status Page](https://www.vercel-status.com)

### OpenAux Issues:
- Check server logs in Render
- Check browser console (F12)
- Review [Troubleshooting Guide](./DIAGNOSTIC_GUIDE.md)

---

## 🎊 Congratulations!

You've successfully deployed OpenAux to production!

**Next Steps:**
- Share with friends and test
- Add custom domain (optional)
- Monitor usage and performance
- Add to your portfolio
- Share on social media

**Your app is live!** 🚀🎵

---

<div align="center">

**Happy Deploying!** 🎉

[⬆ Back to Top](#-deploy-openaux-to-render---complete-guide)

</div>
