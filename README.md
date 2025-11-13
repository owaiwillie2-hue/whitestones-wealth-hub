# Whitestones Markets - Investment Platform

A modern investment platform built with React, TypeScript, Vite, and Tailwind CSS. Features cryptocurrency trading, real estate investments, and more.

## 🚀 Features

- **Bitcoin Explainer Video** - Learn about cryptocurrency with embedded YouTube content
- **Company Information Pages** - Detailed pages for each investment category
- **User Dashboard** - Complete investment management interface
- **Authentication** - Secure login and signup with Supabase
- **Real-time Data** - Integration with financial APIs
- **Mobile Responsive** - Fully optimized for all devices
- **Dark/Light Mode** - Theme support

## 📋 Investment Options

- 🪙 Cryptocurrency Trading
- 🏢 Real Estate Investment
- ⛽ Oil & Gas
- 🖼️ NFT Marketplace
- 🏦 Retirement Planning
- 💰 Investment Loans

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI components
- **Backend:** Supabase (Auth, Database)
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/owaiwillie2-hue/whitestonesmarketng.git
cd whitestonesmarketng

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local
```

## 🚀 Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:8080
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard components
│   └── ui/              # Reusable UI components
├── pages/
│   ├── dashboard/       # Dashboard pages
│   ├── company/         # Company info pages
│   ├── Index.tsx        # Home page
│   ├── Login.tsx        # Login page
│   └── Signup.tsx       # Registration page
├── hooks/               # Custom React hooks
├── contexts/            # Context providers
├── integrations/        # Third-party integrations (Supabase)
├── utils/               # Utility functions
└── App.tsx              # Main app component
```

## 🔑 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | User login |
| `/signup` | User registration |
| `/dashboard` | User dashboard |
| `/cryptocurrencies` | Bitcoin explainer & crypto info |
| `/company/investments` | Investment services |
| `/company/real-estate` | Real estate opportunities |
| `/company/nft` | NFT marketplace info |
| `/admin/login` | Admin login (Ctrl+Alt+A) |

## 🔐 Secret Admin Access

Press **Ctrl + Alt + A** anywhere on the site to access the admin login page.

## 🗂️ Recent Features

### Added in v1.0

✅ YouTube video embed for Bitcoin explainer  
✅ 9 company information pages  
✅ Routing number field in bank account form  
✅ Secret admin keyboard shortcut  
✅ Vercel deployment configuration  
✅ Optimized code splitting for performance  

## 🚀 Deployment

### Deploy to Vercel

```bash
# One-click deploy (recommended)
# Visit https://vercel.com/new and import this repository
```

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

**Important:** The project includes `vercel.json` configuration with proper routing setup for client-side navigation.

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 📊 Performance Optimizations

- **Code Splitting:** Vendor chunks, UI components, and Supabase separated
- **Chunk Size Limit:** Set to 1MB for better performance
- **Build Optimization:** Minified production builds with Vite

## 🐛 Troubleshooting

### Routes show "Page Not Found"
- Ensure `vercel.json` and `public/_redirects` are deployed
- Clear browser cache and redeploy on Vercel

### Build fails with missing dependencies
- Run `npm install` again
- Check `.npmrc` has `legacy-peer-deps=true`

### Supabase connection issues
- Verify environment variables are set correctly
- Check Supabase project credentials

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [GitHub Push Summary](./GITHUB_PUSH_SUMMARY.md)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and owned by Whitestones Markets.

## 📧 Support

For issues or questions, please contact the development team.

---

**Repository:** https://github.com/owaiwillie2-hue/whitestonesmarketng  
**Live Demo:** Deployed on Vercel

**Last Updated:** November 13, 2025
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9a62c248-ed91-4a6e-8c6f-7612b992958c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
