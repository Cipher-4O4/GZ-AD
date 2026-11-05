FROM nginx:alpine

# Copy pre-compiled production build directly
COPY build /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing & API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
