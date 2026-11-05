FROM oven/bun:alpine
WORKDIR /app

# Copy pre-compiled production build & mock API
COPY build ./build
COPY mock-server.ts ./

ENV PORT=80
EXPOSE 80
CMD ["bun", "run", "mock-server.ts"]
