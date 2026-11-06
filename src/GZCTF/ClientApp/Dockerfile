FROM oven/bun:alpine
WORKDIR /app

RUN apk add --no-cache openssl

# Copy pre-compiled production build & mock API
COPY build ./build
COPY mock-server.ts ./

ENV PORT=80
EXPOSE 80 443
CMD ["bun", "run", "mock-server.ts"]
