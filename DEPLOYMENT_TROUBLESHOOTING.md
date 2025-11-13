# Deployment Troubleshooting - Blank Page Issue

## ⚠️ Issue: Blank page showing on Netlify/Vercel after deployment

### Quick Diagnosis Checklist:

#### 1. **Check Build Status**
- [ ] Go to Netlify Dashboard → Site Settings → Deploy Log
- [ ] Go to Vercel Dashboard → Project → Deployments
- [ ] Look for "Build failed" or "Build succeeded" status
- If build FAILED, scroll down to see the error message

#### 2. **Environment Variables Not Set**
Your Netlify/Vercel deployments need these environment variables:

```
VITE_SUPABASE_URL=https://elrofncgydzlvixekjxj.supabase.co
VITE_SUPABASE_PROJECT_ID=elrofncgydzlvixekjxj
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscm9mbmNneWR6bHZpeGVranhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mzc3MDIsImV4cCI6MjA3ODUxMzcwMn0.kBf8YdXZn3cH9x-OXY0JXcP8SY03LQ_PiZpKSWT6QqQ
```

**For Netlify:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add each variable above

**For Vercel:**
1. Go to Settings → Environment Variables
2. Add each variable above

#### 3. **Browser Console Errors**
Open browser DevTools (F12) and check:
- [ ] Console tab for JavaScript errors (red errors)
- [ ] Network tab for failed requests (404, 500 errors)
- [ ] Look specifically for Supabase connection errors

#### 4. **Cache Issues**
- [ ] Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- [ ] Try incognito/private window
- [ ] Clear all browser cache for the site

### Common Issues & Solutions:

| Issue | Solution |
|-------|----------|
| **"Cannot find module" errors in build** | Run `npm install` locally and push changes |
| **Blank white page, no errors** | Check Environment Variables are set in deployment platform |
| **"Failed to fetch from Supabase"** | Verify Supabase URL and keys are correct |
| **Page loads but no styling** | CSS not compiled - rebuild locally with `npm run build` |
| **Routes not working (404 on refresh)** | SPA redirects not configured - we added `_redirects` and `netlify.toml` |

### Step-by-Step Fix:

**1. For Netlify:**
```
Go to: Site Settings → Build & Deploy → Environment
Add 3 env variables listed above
Click "Trigger deploy" to rebuild
Wait 2-3 minutes for new build
```

**2. For Vercel:**
```
Go to: Project Settings → Environment Variables
Add 3 env variables listed above
Push a new commit to trigger rebuild
Wait 2-3 minutes for new deployment
```

**3. Verify Locally First:**
```powershell
# Build locally
npm run build

# Verify no errors appear
# Check dist/ folder is created
```

---

## If Still Not Working:

Open Browser DevTools (F12) → Console Tab and tell me:
1. Are there any red error messages? What do they say?
2. What is the actual URL showing? (e.g., whitestonesmarkets.netlify.app)
3. Is the page completely blank or showing some content?

---

**Config Files We Added:**
- ✅ `/public/_redirects` - For Netlify SPA routing
- ✅ `/vercel.json` - For Vercel SPA routing  
- ✅ `/netlify.toml` - Netlify build configuration

**These should handle all routing automatically now.**
