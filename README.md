# Libray — University Library

A modern, responsive university library web application built with TypeScript and Next.js. It provides a clean UI, authentication, a database-backed catalog, admin tools, and utilities for PDF generation, image handling, and more.

## Table of contents
- [Demo](#demo)
- [Features](#features)
- [Used technologies](#used-technologies)
- [Scripts](#scripts)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [UI & Design guidelines](#ui--design-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Demo
(Replace with a link or GIF)
- Live demo: (https://libray-xi.vercel.app/)

## Features
- Authentication (NextAuth)
- Responsive UI with dark/light themes
- File/image handling and upload support
- Searchable catalog of books/resources
- Role-based admin pages (migrate, seed, studio)
- PDF generation for reports (react-pdf)
- Database migrations and dev tools (drizzle-kit)

## Used technologies
Core
- TypeScript
- Next.js
- React

Styling & UI
- Tailwind CSS
- tailwindcss-animate / tw-animate-css
- Radix UI primitives (Avatar, Select, Popover, Dropdown)
- lucide-react (icons)
- class-variance-authority (component variants)
- tailwind-merge

Forms & validation
- react-hook-form
- @hookform/resolvers
- zod

Auth, themes & state
- next-auth
- next-themes

Data & backend
- drizzle-orm (database mapping)
- drizzle-kit (migrations & studio)
- @neondatabase/serverless (Postgres serverless driver)
- upstash/redis & upstash/ratelimit (cache / rate limiting)
- @upstash/workflow (optional workflows)

Media & export
- imagekit / @imagekit/next (image hosting / optimization)
- @react-pdf/renderer (PDF export)

Utilities
- dayjs (dates)
- bcryptjs (password hashing)
- sonner (toasts)
- react-colorful (color picker for theming)
- clsx

## Scripts
Use npm, pnpm, or yarn. Example below uses npm.

- Start dev server
  - npm run dev
- Build for production
  - npm run build
- Start production server
  - npm run start
- Lint
  - npm run lint
- Seed the database
  - npm run seed
- Drizzle: generate types
  - npm run db:generate
- Drizzle: run migrations
  - npm run db:migrate
- Drizzle: open studio
  - npm run db:studio

(These scripts are defined in package.json. Adjust if you use pnpm or yarn.)

## Quick start

1. Clone
   - git clone https://github.com/mshaheerz/libray.git
   - cd libray

2. Install
   - npm install

3. Create .env
   - Copy `.env.example` to `.env` (create one if not present) and fill values (see below).

4. Database & migrations
   - npm run db:generate          # (if you need generated types)
   - npm run db:migrate           # run migrations
   - npm run seed                 # seed initial data

5. Start dev server
   - npm run dev
   - Open http://localhost:3000

6. Build & run production
   - npm run build
   - npm run start

## Environment variables (examples)
Create a `.env` in the project root and configure these (names below are typical — confirm exact names in your code/config):
- DATABASE_URL=postgresql://...           # neon/other Postgres URL
- NEXTAUTH_URL=https://your-domain.com
- NEXTAUTH_SECRET=your_nextauth_secret
- IMAGEKIT_PRIVATE_KEY=... / NEXT_PUBLIC_IMAGEKIT_ENDPOINT=...
- UPSTASH_REDIS_REST_URL=...
- UPSTASH_REDIS_REST_TOKEN=...
- NEXT_PUBLIC_ENV_... (any public keys used by the app)
- Other keys used by provider integrations (email, oauth, etc.)

## UI & Design guidelines
Goal: a clear, accessible, and modern interface that scales across devices.

Layout & responsiveness
- Use mobile-first breakpoints (Tailwind).
- Keep primary navigation simple and persistent on larger screens; use a collapsible menu on mobile.
- Use a centered content column for lists with clear filters/sidebar for browsing.

Visual system
- Use a neutral base palette with 1–2 accent colors (expose accent color via react-colorful for theming).
- Typography: readable sizes and generous line-height. Use system fonts or a performant web font.
- Spacing: use consistent spacing scale (4, 8, 16, 24, 32 px etc).

Components
- Build small, reusable primitives (Button, Input, Select, Modal, Dropdown) using Radix + Tailwind.
- Use class-variance-authority to manage variant styles (primary, outline, ghost).
- Use lucide-react for consistent iconography.

Forms & accessibility
- Validate client-side with zod + react-hook-form and show clear inline errors.
- Ensure label association, keyboard navigation, and aria attributes for interactive controls.

Animations
- Keep motion subtle and optional (use prefers-reduced-motion).
- Use tailwindcss-animate for small micro-interactions (toasts, badges, dropdowns).

Images & PDFs
- Use imagekit or external CDN for image resizing/optimization.
- For PDF generation, ensure exported documents match the brand styles and are accessible.

UX tips
- Provide meaningful empty states and helpful CTAs.
- Use toasts (sonner) for confirmations and error messages.
- Show progress states for long operations (migrations, seed, imports).

Design tokens & theme
- Expose colors, spacing, radius in one Tailwind/theme file for consistency.
- Provide a dark mode via next-themes with a toggle.

## Contributing
- Open an issue for new features or bugs.
- Create PRs against the main branch, run lint/tests before requesting review.
- Add changelogs for non-trivial changes.

## License
Specify your license (e.g., MIT). Replace this line with actual license info.
