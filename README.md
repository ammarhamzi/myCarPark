# Car Park Management System

A modern, professional Vue 3 + TypeScript system for car park management, with a beautiful admin dashboard, advanced theming, and Docker support.

## Features

- Vue 3 + TypeScript + Vite
- Professional theming (light/dark/custom, gradients, font options)
- Responsive admin dashboard for car park operations
- Bookings, parking spaces, shuttle, car wash, and reports
- Role-based access (Admin, Superadmin, Manager, User, Customer)
- Pinia state management, Vue Router, I18n
- Database: MySQL, PostgreSQL, or SQLite (via Knex.js)
- Dockerized for easy deployment

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## Theming

- Open the Theme Customizer from the user menu
- Choose from professional color schemes (including "pro"), light/dark mode, and border radius
- Gradients and premium fonts included in the "pro" theme

## Database & Deployment

- Configure your database in `.env` (see `.env.example`)
- Run migrations:
  ```bash
  pnpm run migrate:latest
  ```
- For Docker:
  ```bash
  pnpm run docker:full      # App + DB
  pnpm run docker:app-only  # App only
  ```

## Project Structure

```
mycar-park/
├── src/
│   ├── assets/         # CSS, fonts, images
│   ├── components/     # Vue components (UI, layout, etc.)
│   ├── layouts/        # App layouts
│   ├── pages/          # App pages (admin, superadmin, etc.)
│   ├── router/         # Vue Router config
│   ├── services/       # API/services
│   ├── stores/         # Pinia stores
│   └── types/          # TypeScript types
├── migrations/         # DB migrations
├── seeds/              # DB seeders
├── public/             # Static assets
├── templates/          # Project templates
├── docker-compose.yml  # Docker config
└── ...
```

## License

MIT
