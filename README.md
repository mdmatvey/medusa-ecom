# Megobari Tea Shop

Premium European tea e-commerce platform built with Medusa v2 and Next.js.

## 🏗️ Project Structure (Monorepo)

```
/
├── backend/          # Medusa v2 Backend
│   ├── src/         # API routes, modules, workflows
│   ├── medusa-config.ts
│   └── package.json
│
└── storefront/      # Next.js 16 Storefront
    ├── app/         # App router pages
    ├── components/  # React components
    ├── lib/         # Utilities, hooks, SDK config
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start database:**
```bash
npm run docker:up
```

4. **Run migrations:**
```bash
npx medusa db:migrate
```

5. **Seed data (optional):**
```bash
npm run seed
```

6. **Start backend:**
```bash
npm run dev
```

Backend runs on http://localhost:9000
Admin dashboard: http://localhost:9000/app

### Storefront Setup

1. **Install dependencies:**
```bash
cd storefront
npm install
```

2. **Get publishable API key:**
   - Visit http://localhost:9000/app
   - Go to Settings → Publishable API Keys
   - Copy the key

3. **Configure environment:**
```bash
# Create .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_key_here
```

4. **Start storefront (CRITICAL: Port 8000 for CORS):**
```bash
npm run dev -- --port 8000
```

Storefront runs on http://localhost:8000

## ✨ Features

### Backend (Medusa v2)
- Product catalog management
- Category hierarchy
- Cart & checkout
- Order management
- Admin dashboard
- Custom API routes

### Storefront (Next.js 16)
- 🏠 **Homepage** with hero, featured categories, products
- 📦 **Product pages** with variant selection, image gallery
- 🗂️ **Category pages** with filtering and sorting
- 🛒 **Shopping cart** with quantity management
- 🎨 **Pastel green theme** with Tailwind v4
- 📱 **Responsive design** with mobile menu
- 🔗 **Medusa SDK integration** with React Query

## 🎨 Design System

The storefront uses a minimalistic pastel green theme:
- Primary: Sage Green (#A8B99C)
- Accent: Terracotta (#D4A574)
- Background: Cream (#FAF8F3)
- Text: Charcoal (#3A3A3A)

## 📋 Remaining Features

- [ ] Checkout flow implementation
- [ ] Cart popup/mini cart
- [ ] Order confirmation page
- [ ] Animations and scroll effects
- [ ] Image optimization
- [ ] SEO enhancements

## 🛠️ Development

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run docker:up    # Start PostgreSQL
npm run docker:down  # Stop PostgreSQL
```

### Storefront Commands
```bash
cd storefront
npm run dev -- --port 8000  # Start dev server
npm run build              # Build for production
npm run start              # Start production server
```

## 📚 Documentation

- [Medusa v2 Docs](https://docs.medusajs.com/)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/)

## 🤝 Contributing

This is a private project for Megobari Tea Shop.

## 📄 License

Proprietary - All rights reserved
