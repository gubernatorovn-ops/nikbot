# Deployment Guide для nikbot.space

## 🌐 Конфигурация DNS

Настройте следующие DNS записи для домена `nikbot.space`:

### A Records (или CNAME)
```
nikbot.space        →  YOUR_SERVER_IP
api.nikbot.space    →  YOUR_SERVER_IP
www.nikbot.space    →  YOUR_SERVER_IP
```

## 🐳 Docker Deployment

### 1. Подготовка сервера

```bash
# Установка Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Клонирование репозитория

```bash
git clone https://github.com/YOUR_USERNAME/nikbot.git
cd nikbot
```

### 3. Настройка переменных окружения

```bash
# Создайте .env файл на основе примера
cp .env.production.example .env

# Отредактируйте .env файл
nano .env
```

Заполните следующие переменные:
```env
DB_PASSWORD=YOUR_SECURE_DB_PASSWORD
JWT_SECRET=YOUR_SECURE_JWT_SECRET_MIN_32_CHARS
JWT_REFRESH_SECRET=YOUR_SECURE_REFRESH_SECRET_MIN_32_CHARS
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
API_URL=https://api.nikbot.space
APP_URL=https://nikbot.space
NEXT_PUBLIC_API_URL=https://api.nikbot.space/api/v1
DOMAIN=nikbot.space
```

### 4. Настройка SSL/TLS с Certbot

```bash
# Установка Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Получение сертификатов
sudo certbot --nginx -d nikbot.space -d www.nikbot.space -d api.nikbot.space
```

### 5. Настройка Nginx

Создайте файл `/etc/nginx/sites-available/nikbot.space`:

```nginx
# Frontend - nikbot.space
server {
    listen 80;
    listen [::]:80;
    server_name nikbot.space www.nikbot.space;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nikbot.space www.nikbot.space;

    ssl_certificate /etc/letsencrypt/live/nikbot.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nikbot.space/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API - api.nikbot.space
server {
    listen 80;
    listen [::]:80;
    server_name api.nikbot.space;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.nikbot.space;

    ssl_certificate /etc/letsencrypt/live/nikbot.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nikbot.space/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/nikbot.space /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Запуск приложения

```bash
# Сборка и запуск через Docker Compose
docker-compose up -d

# Или запуск через pnpm
pnpm install
pnpm db:push
pnpm build
pm2 start ecosystem.config.js
```

## 🔧 Альтернатива: Deployment на Vercel + Railway

### Frontend на Vercel

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения:
   - `NEXT_PUBLIC_API_URL=https://api.nikbot.space/api/v1`
3. Deploy автоматически подхватит `apps/web`

### Backend на Railway

1. Создайте новый проект на Railway
2. Добавьте PostgreSQL и Redis из Railway Marketplace
3. Настройте переменные окружения
4. Deploy `apps/api`

### DNS настройка для Vercel
```
nikbot.space     CNAME  cname.vercel-dns.com
www.nikbot.space CNAME  cname.vercel-dns.com
```

## 📊 Мониторинг

### Проверка работы сервисов

```bash
# Проверка Docker контейнеров
docker-compose ps

# Логи
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f worker

# Проверка доступности
curl https://api.nikbot.space/api/v1/health
curl https://nikbot.space
```

### PM2 Monitoring (если используется PM2)

```bash
pm2 status
pm2 logs
pm2 monit
```

## 🔄 CI/CD с GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/nikbot
            git pull origin main
            pnpm install
            pnpm build
            pm2 restart all
```

## 🛡️ Security Checklist

- [ ] Настроены SSL сертификаты
- [ ] Включен firewall (ufw)
- [ ] Настроены безопасные пароли БД
- [ ] JWT секреты сгенерированы (32+ символов)
- [ ] Регулярные бэкапы БД настроены
- [ ] Rate limiting включен на Nginx
- [ ] CORS правильно настроен
- [ ] Секреты не коммитятся в Git

## 📱 Контакты и поддержка

- Website: https://nikbot.space
- API Docs: https://api.nikbot.space/api/docs
