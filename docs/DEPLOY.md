# Деплой ChatFlow на VPS

## Требования к серверу

- **Минимум:** 2 vCPU, 4GB RAM, 40GB SSD
- **ОС:** Ubuntu 22.04 LTS
- **Рекомендуемые хостинги:**
  - Hetzner CX21: €5.39/мес
  - DigitalOcean: $24/мес
  - Vultr: $20/мес

## 1. Настройка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Перелогиньтесь для применения группы docker
exit
```

## 2. Настройка домена

Добавьте DNS записи:
- `A @ YOUR_SERVER_IP`
- `A www YOUR_SERVER_IP`
- `A api YOUR_SERVER_IP`

## 3. Деплой приложения
```bash
# Клонируйте или загрузите проект
cd ~
mkdir chatflow && cd chatflow
# ... загрузите файлы проекта

# Создайте .env.production
cp .env.production.example .env.production
nano .env.production

# Сгенерируйте секреты
openssl rand -base64 32  # для JWT_SECRET
openssl rand -base64 32  # для JWT_REFRESH_SECRET

# Заполните переменные в .env.production

# Соберите и запустите
docker compose build
docker compose up -d

# Проверьте статус
docker compose ps
docker compose logs -f
```

## 4. SSL сертификат (Let's Encrypt)
```bash
# Установите certbot
sudo apt install certbot -y

# Получите сертификат
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com

# Скопируйте сертификаты
sudo mkdir -p ~/chatflow/docker/nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ~/chatflow/docker/nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ~/chatflow/docker/nginx/ssl/
sudo chown -R $USER:$USER ~/chatflow/docker/nginx/ssl
```

## 5. Проверка

- https://yourdomain.com - Frontend
- https://api.yourdomain.com/api/docs - Swagger
- https://api.yourdomain.com/api/v1/health - Health check

## 6. Бэкапы
```bash
# Создание бэкапа
docker compose exec postgres pg_dump -U chatflow chatflow > backup.sql

# Восстановление
cat backup.sql | docker compose exec -T postgres psql -U chatflow chatflow
```

## 7. Обновление
```bash
cd ~/chatflow
git pull  # или загрузите новые файлы
docker compose build
docker compose up -d
```

## Troubleshooting

**Контейнер не запускается:**
```bash
docker compose logs api
docker compose logs web
```

**Проблемы с БД:**
```bash
docker compose exec postgres psql -U chatflow -c "SELECT 1"
```

**Перезапуск всего:**
```bash
docker compose down
docker compose up -d
```
