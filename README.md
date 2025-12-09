# Nikbot

Платформа нового поколения для автоматизации чат-ботов в Telegram, Instagram и TikTok с визуальным редактором flow и AI.

🌐 **Website:** https://nikbot.space

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Локальная разработка
```bash
# 1. Установите зависимости
pnpm install

# 2. Запустите базы данных
docker compose -f docker-compose.dev.yml up -d

# 3. Создайте .env файл
cp .env.example .env

# 4. Примените схему БД
pnpm db:generate
pnpm db:push

# 5. Запустите приложение
pnpm dev
```

### Доступ

- Frontend: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs

## 📁 Структура проекта
```
nikbot/
├── apps/
│   ├── api/          # NestJS Backend
│   ├── web/          # Next.js Frontend
│   └── worker/       # BullMQ Worker
├── packages/
│   ├── database/     # Prisma Schema
│   └── shared/       # Shared Types
├── docker/           # Dockerfiles
└── docs/             # Documentation
```

## 🛠 Технологии

- **Backend:** NestJS, Prisma, PostgreSQL, Redis, BullMQ
- **Frontend:** Next.js 14, React, TailwindCSS, React Flow
- **AI:** OpenAI GPT-4
- **Payments:** Stripe
- **Deploy:** Docker, Nginx

## 📝 Лицензия

MIT
