# Meridian — Admin Dashboard

A production-style React admin dashboard built for a Front-End Internship assignment. Catalog management, analytics, and settings powered by the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **TanStack Table** patterns (custom table implementation)
- **Recharts**
- **TanStack Query**
- **React Hook Form** + Zod
- **Lucide Icons**
- **@dnd-kit** (column reorder)

## Features

| Area | Details |
|------|---------|
| Layout | Collapsible sidebar, mobile drawer, top navbar with search, notifications, theme toggle, user menu |
| Products | Search, multi-category filter, rating/stock filters, sort, pagination, URL-synced state, skeletons, empty/error states, mobile cards |
| Product detail | Image carousel, pricing/inventory/info cards |
| Analytics | Stat cards with trends, pie/bar/area charts (lazy-loaded) |
| Performance | Debounced search (500ms), `useMemo`, `useCallback`, `React.memo`, dynamic imports |
| Bonus | 15s polling + live badge, column show/hide + drag reorder + `localStorage` |
| UX | Dark mode, toasts, error boundaries, breadcrumbs, tooltips, accessible forms |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/dashboard`.

### Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint
```

## Project structure

```
src/
├── app/
│   ├── (dashboard)/          # Shell layout (sidebar + navbar)
│   │   ├── dashboard/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── analytics/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx              # redirects to /dashboard
├── components/
│   ├── analytics/            # Charts + stat cards
│   ├── common/               # Breadcrumbs, empty states, error boundary
│   ├── dashboard/
│   ├── layout/               # Sidebar, navbar, shell
│   ├── products/
│   ├── providers/
│   └── ui/                   # shadcn primitives
├── hooks/                    # debounce, filters, columns, queries
├── lib/                      # analytics, filters, formatters
├── services/                 # DummyJSON API client
└── types/
```

## URL filter examples

Shareable product list states:

- `/products?category=beauty,fragrances`
- `/products?rating=4&stock=low-stock`
- `/products?sort=price-desc&search=phone`
- `/products?page=2`

## Environment

No API keys required — DummyJSON is public. Optional: set nothing; fetches run client-side via React Query.

## Design notes

Neutral palette, restrained shadows, no glassmorphism or heavy gradients. Layout inspired by Linear / Stripe / Vercel-style admin tools.

## License

MIT — assignment/demo use.
