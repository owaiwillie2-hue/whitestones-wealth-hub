# Vercel Deployment Guide

## Problem Fixed
The error `sh: line 1: vite: command not found` occurred because Vercel wasn't installing dev dependencies needed for the build.

## Solution Implemented

### 1. **vercel.json** Configuration
Created a `vercel.json` file that explicitly tells Vercel how to:
- Install all dependencies (including dev dependencies) 
- Run the build command
- Set the output directory to `dist`

```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm ci"
}
```

### 2. **.npmrc** Configuration
Added `.npmrc` with `legacy-peer-deps=true` to handle any peer dependency conflicts.

## Steps to Deploy on Vercel

### Option 1: **Automatic Deployment (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub account
4. Select the repository: `whitestones-wealth-hub`
5. Vercel will automatically detect the configuration and deploy!

### Option 2: **Manual Deployment**
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   vercel
   ```

3. Follow the CLI prompts to link your project

## What Happens During Deployment

1. ✅ Vercel clones your repository
2. ✅ Installs all dependencies via `npm ci`
3. ✅ Runs `npm run build` to create the production build
4. ✅ Deploys the `dist` folder to Vercel's CDN
5. ✅ Provides you with a live URL

## Troubleshooting

If you still get the "vite: command not found" error:

1. **Clear Vercel Cache**:
   - Go to your Vercel project settings
   - Click "Advanced" → "Environment Variables"
   - Clear cache and redeploy

2. **Check Build Logs**:
   - Go to your project on Vercel
   - Click on the failed deployment
   - Review the build logs for specific errors

3. **Verify package.json**:
   - Ensure `vite` is in `devDependencies` ✅ (already configured)

## Environment Variables (if needed)

If your project uses environment variables:
1. Go to Vercel Project Settings
2. Click "Environment Variables"
3. Add any required variables (e.g., API keys, Supabase URLs)

## Your Project is Ready!

The configuration is now in place. Simply push your changes to GitHub, and Vercel will automatically:
- Detect new pushes
- Build your project
- Deploy to production

Your deployment URL will be something like: `https://whitestones-wealth-hub.vercel.app`

---

**Last Updated:** November 13, 2025
