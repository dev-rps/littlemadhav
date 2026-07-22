# Little Madhav — Build Notes & Execution Log

> **Read this file before every execution session to pick up where you left off.**

---

## 🎯 Project Overview
Full e-commerce website for **Little Madhav** — an Indian festive accessories D2C brand (Rakhi, Jhumka, gifting).

---

## 🛠️ Tech Stack
| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite via Prisma ORM |
| State | Zustand + localStorage cart persistence |
| Payments | Razorpay (test) + COD |
| Images | next/image + Unsplash/generated placeholders |
| Auth (admin) | NextAuth.js (simple credentials) |

---

## 🎨 Design Tokens
```js
colors: {
  maroon:  { DEFAULT: '#8B1E3F', light: '#A63255', dark: '#6B1630' },
  gold:    { DEFAULT: '#D4A017', light: '#E8B928', dark: '#B8890F' },
  cream:   { DEFAULT: '#FFF8F0', card: '#FFFBF5' },
  festive: { green: '#2D6A4F', orange: '#E76F51' },
}
fonts: {
  display: ['Yeseva One', 'Playfair Display', 'serif'],
  body:    ['Poppins', 'Inter', 'sans-serif'],
}
```

---

## 📁 Folder Structure (target)
```
Little Madhav/
├── app/                    # Next.js App Router pages
│   ├── (shop)/             # Shop layout group
│   │   ├── page.tsx        # Homepage
│   │   ├── collections/[slug]/page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── order-confirmation/page.tsx
│   ├── (info)/             # Info pages
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/              # Admin panel
│   │   └── page.tsx
│   └── api/                # API routes
│       ├── products/
│       ├── cart/
│       ├── orders/
│       └── payment/
├── components/
│   ├── layout/             # Header, Footer, CartDrawer
│   ├── home/               # Hero, TrustStrip, CategoryGrid, Bestsellers
│   ├── product/            # ProductCard, ProductGallery, VariantSelector
│   ├── cart/               # CartItem, CartSummary
│   ├── checkout/           # AddressForm, PaymentOptions
│   └── ui/                 # Button, Badge, Countdown, etc.
├── lib/
│   ├── prisma.ts
│   ├── store.ts            # Zustand cart store
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── tailwind.config.ts
└── BUILD_NOTES.md          ← this file
```

---

## ✅ Build Phases & Status

### Phase 1 — Scaffold & Config
- [x] `npx create-next-app` with TS + Tailwind + App Router
- [x] Install dependencies (Prisma, Zustand, Razorpay, etc.)
- [x] `tailwind.config.ts` — custom palette + fonts
- [x] `globals.css` — base styles, font imports
- [x] Prisma schema (Product, Order, CartItem, Review)
- [x] Seed data (12–15 products)

### Phase 2 — Core Layout
- [x] Announcement bar (rotating offers)
- [x] Header: logo, mega-menu, search, wishlist, cart icon
- [x] Footer: links, newsletter, payment icons
- [x] CartDrawer (slide-in)

### Phase 3 — Homepage
- [x] Hero carousel with countdown timer
- [x] Trust strip
- [x] Category grid
- [x] Bestsellers grid (hover-swap images, quick add)
- [x] Exit-intent popup
- [x] WhatsApp floating button

### Phase 4 — Collection & Product Pages
- [x] `/collections/[slug]` — filtered grid + sidebar
- [x] `/products/[slug]` — gallery, variants, tabs, reviews carousel
- [x] "You may also like" section

### Phase 5 — Cart & Checkout
- [x] Cart drawer (quantity edit, free-ship progress bar)
- [x] `/checkout` — address form, payment options
- [x] Razorpay test integration (Mocked)
- [x] `/order-confirmation` page

### Phase 6 — Info Pages
- [x] `/about` — founder story, trust elements
- [x] `/contact` — WhatsApp, map embed, form
- [x] `/search` — search functionality
- [x] `/wishlist` — persistent client-side wishlist

### Phase 7 — Admin Panel
- [ ] Product CRUD (Deferred)
- [ ] Order view & status update (Deferred)

### Phase 8 — Polish & SEO
- [x] Meta tags, Open Graph per page
- [x] Lazy loading audit
- [x] Mobile responsiveness check (375/768/1440px)
- [x] Performance pass

---

## 📝 Decisions Log
| Date | Decision | Reason |
|------|----------|--------|
| 2026-07-10 | SQLite (dev) → PostgreSQL path via Prisma | Easy local dev, production-ready ORM |
| 2026-07-10 | Zustand for cart state | Lightweight, localStorage middleware built-in |
| 2026-07-10 | Next.js API routes only (no separate Express) | Simplify deployment, single project |
| 2026-07-10 | Mock payment flow | No Razorpay keys yet; easy swap later |
| 2026-07-10 | Placeholder/AI images | Speed; real photos added later |
| 2026-07-10 | Admin panel deferred | Build later as separate phase |
| 2026-07-10 | Vercel deployment target | SQLite for local dev; Prisma env-switch to Neon/Postgres for prod |

---

## 🐛 Issues / Blockers
_None yet_

---

## 🔗 Key Refs
- Razorpay test docs: https://razorpay.com/docs/payments/testing/
- Prisma SQLite: https://www.prisma.io/docs/getting-started/quickstart
- Tailwind custom config: https://tailwindcss.com/docs/configuration
