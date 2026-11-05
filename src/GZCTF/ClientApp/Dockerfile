# Stage 1: Build the React frontend
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy dependency specifications
COPY package.json bun.lock* pnpm-lock.yaml* ./
RUN bun install

# Copy application source code
COPY . .

# Build production bundle
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
