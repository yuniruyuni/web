# Base stage - Dependencies
FROM oven/bun:latest AS base

WORKDIR /work

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Development stage - Vite dev server
FROM base AS dev

EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]

# Build stage - SSG build
FROM base AS build

RUN bun run build

# Production stage - Nginx
FROM nginx:alpine-slim AS prod

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /work/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
