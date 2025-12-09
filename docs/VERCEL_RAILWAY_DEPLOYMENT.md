# 🚀 Деплой Nikbot на Vercel + Railway

## Архитектура

- **Frontend (Next.js)** → Vercel → nikbot.space
- **Backend (NestJS)** → Railway → api.nikbot.space
- **Database (PostgreSQL)** → Railway
- **Cache (Redis)** → Railway

---

## 📦 Часть 1: Railway (Backend + Database)

### Шаг 1: Создайте аккаунт на Railway

1. Перейдите на https://railway.app
2. Войдите через GitHub
3. Нажмите **"New Project"**

### Шаг 2: Добавьте PostgreSQL

1. В проекте нажмите **"+ New"**
2. Выберите **"Database"** → **"Add PostgreSQL"**
3. Railway автоматически создаст базу данных
4. Скопируйте **DATABASE_URL** из вкладки **"Connect"**

### Шаг 3: Добавьте Redis

1. Снова нажмите **"+ New"**
2. Выберите **"Database"** → **"Add Redis"**
3. Скопируйте **REDIS_URL** из вкладки **"Connect"**

### Шаг 4: Деплой API на Railway

#### Вариант A: Через GitHub (Рекомендуется)

1. Загрузите проект на GitHub
2. В Railway нажмите **"+ New"** → **"GitHub Repo"**
3. Выберите ваш репозиторий
4. Railway автоматически обнаружит Dockerfile

#### Вариант B: Через Railway CLI

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите в аккаунт
railway login

# Инициализируйте проект
railway init

# Деплой
railway up
```

### Шаг 5: Настройте переменные окружения в Railway

В настройках сервиса API добавьте:

```env
# База данных (скопируйте из Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:...@...railway.app:5432/railway

# Redis (скопируйте из Railway Redis)
REDIS_URL=redis://default:...@...railway.app:6379

# JWT секреты (сгенерируйте надежные!)
JWT_SECRET=ваш_секретный_jwt_ключ_минимум_32_символа
JWT_REFRESH_SECRET=ваш_секретный_refresh_ключ_минимум_32_символа

# OpenAI (если используете AI функции)
OPENAI_API_KEY=sk-ваш-ключ

# Stripe (если используете платежи)
STRIPE_SECRET_KEY=sk_test_ваш_ключ
STRIPE_WEBHOOK_SECRET=whsec_ваш_секрет

# URLs
APP_URL=https://nikbot.space
API_URL=https://api.nikbot.space

# Node
NODE_ENV=production
PORT=4000
```

### Шаг 6: Получите домен Railway для API

1. В настройках сервиса API перейдите в **"Settings"**
2. В разделе **"Domains"** вы увидите автоматически созданный домен:
   ```
   your-app-production-xxxx.up.railway.app
   ```
3. Запишите этот URL - он понадобится для Vercel!

### Шаг 7: Примените миграции базы данных

В Railway выполните команду (в разделе "Deployments" → "Logs"):
```bash
railway run pnpm db:push
```

Или подключитесь локально:
```bash
# Скопируйте DATABASE_URL из Railway
export DATABASE_URL="postgresql://..."
pnpm db:push
```

---

## 🌐 Часть 2: Vercel (Frontend)

### Шаг 1: Создайте аккаунт на Vercel

1. Перейдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите **"Add New..."** → **"Project"**

### Шаг 2: Импортируйте репозиторий

1. Выберите ваш GitHub репозиторий
2. Vercel автоматически определит Next.js проект

### Шаг 3: Настройте проект

**Root Directory:**
```
apps/web
```

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm --filter @nexbot/web build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
pnpm install
```

### Шаг 4: Настройте переменные окружения

Добавьте в Vercel:

```env
# API URL от Railway (из Шага 6 Railway)
NEXT_PUBLIC_API_URL=https://your-app-production-xxxx.up.railway.app/api/v1
```

### Шаг 5: Деплой

1. Нажмите **"Deploy"**
2. Vercel соберет и задеплоит проект
3. Вы получите URL вида: `your-project.vercel.app`

---

## 🔗 Часть 3: Подключение домена nikbot.space

### Шаг 1: Настройте Cloudflare (рекомендуется)

1. Зарегистрируйтесь на https://cloudflare.com
2. Добавьте домен `nikbot.space`
3. Cloudflare даст вам DNS-серверы (например):
   ```
   bella.ns.cloudflare.com
   danny.ns.cloudflare.com
   ```

### Шаг 2: Обновите DNS на reg.ru

1. Войдите в панель управления reg.ru
2. Выберите домен `nikbot.space`
3. Укажите DNS-серверы от Cloudflare (из Шага 1)
4. Сохраните (обновление займет до 24 часов)

### Шаг 3: Настройте DNS записи в Cloudflare

После активации Cloudflare, добавьте записи:

#### Для Frontend (Vercel):
```
Тип     Имя    Содержание                          Proxy
CNAME   @      cname.vercel-dns.com                ✓
CNAME   www    cname.vercel-dns.com                ✓
```

#### Для API (Railway):
```
Тип     Имя    Содержание                                      Proxy
CNAME   api    your-app-production-xxxx.up.railway.app         ✓
```

### Шаг 4: Добавьте домен в Vercel

1. В проекте Vercel перейдите в **"Settings"** → **"Domains"**
2. Добавьте:
   - `nikbot.space`
   - `www.nikbot.space`
3. Vercel проверит DNS и выдаст SSL сертификат

### Шаг 5: Добавьте домен в Railway

1. В сервисе API перейдите в **"Settings"** → **"Domains"**
2. Нажмите **"Custom Domain"**
3. Добавьте `api.nikbot.space`
4. Railway проверит DNS и выдаст SSL сертификат

### Шаг 6: Обновите переменные окружения

#### В Vercel обновите:
```env
NEXT_PUBLIC_API_URL=https://api.nikbot.space/api/v1
```

#### В Railway обновите:
```env
APP_URL=https://nikbot.space
API_URL=https://api.nikbot.space
```

---

## ✅ Проверка работы

После настройки проверьте:

1. **Frontend:** https://nikbot.space
2. **API Health:** https://api.nikbot.space/api/v1/health
3. **API Docs:** https://api.nikbot.space/api/docs

---

## 🔄 Автоматический деплой

### GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Vercel автоматически деплоит при push
      # Railway автоматически деплоит при push

      - name: Notify deployment
        run: echo "Deployment triggered!"
```

---

## 💰 Стоимость

### Бесплатные лимиты:

**Vercel (Free Plan):**
- 100 GB bandwidth/месяц
- Serverless функции
- Автоматический SSL
- Unlimited проектов

**Railway (Free Trial):**
- $5 бесплатных кредитов/месяц
- После окончания: ~$5-10/месяц за базовый проект
- PostgreSQL + Redis + API

**Cloudflare (Free Plan):**
- Unlimited bandwidth
- Бесплатный SSL
- Базовый DDoS protection

---

## 📞 Поддержка

Если возникнут проблемы:

1. Проверьте логи в Railway: **Deployments** → **View Logs**
2. Проверьте логи в Vercel: **Deployments** → кликните на deploy → **View Function Logs**
3. Проверьте DNS: https://dnschecker.org/#A/nikbot.space

---

## 🎉 Готово!

После выполнения всех шагов у вас будет:

✅ Рабочий сайт на https://nikbot.space
✅ API на https://api.nikbot.space
✅ Автоматический деплой при push в main
✅ Бесплатный SSL
✅ CDN и кэширование через Cloudflare
