FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

FROM base AS dependencies

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=dependencies /app/packages ./packages

# Copy source
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.json ./

# Generate Prisma Client
WORKDIR /app/packages/database
RUN pnpm db:generate

# Build application
WORKDIR /app/apps/api
RUN pnpm build

FROM base AS runner

WORKDIR /app

# Copy built application
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api/package.json ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main.js"]
