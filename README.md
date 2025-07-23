# Car Park Management System

## Vision & Motivation

I lived very near to KLIA, so I noticed that there's many businesses that offer parking services for people who want to fly. Every day, travelers look for safe, convenient, and affordable places to park their cars while they're away. However, most of these parking businesses still rely on manual processes, WhatsApp bookings, and lack a modern, digital management system.

This project was born out of the idea to bring a professional, enterprise-grade solution to the airport parking industry. The goal is to empower parking operators with a robust, beautiful, and easy-to-use platform—making it effortless to manage bookings, spaces, shuttles, car wash services, and more. Ultimately, I want to help both operators and travelers have a seamless, digital-first parking experience.

---

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

## Coming Soon

- WhatsApp integration for seamless customer communication and booking
- AI-powered features (recommendations, analytics, smart pricing, etc.)
- More integrations and automation tools
- ...and more!

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
