.PHONY: dev dev-db dev-app build start stop logs install db-generate db-push db-studio clean

# Development
dev: dev-db dev-app

dev-db:
	docker compose -f docker-compose.dev.yml up -d

dev-app:
	pnpm dev

dev-stop:
	docker compose -f docker-compose.dev.yml down

# Production
build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose down

restart:
	docker compose restart

# Database
db-generate:
	pnpm --filter @chatflow/database db:generate

db-push:
	pnpm --filter @chatflow/database db:push

db-studio:
	pnpm --filter @chatflow/database db:studio

db-migrate:
	pnpm --filter @chatflow/database db:migrate

# Logs
logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-worker:
	docker compose logs -f worker

logs-web:
	docker compose logs -f web

# Utilities
install:
	pnpm install

clean:
	docker compose down -v
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/.next
	rm -rf apps/*/dist

backup:
	docker compose exec postgres pg_dump -U chatflow chatflow > backup_$(shell date +%Y%m%d_%H%M%S).sql
