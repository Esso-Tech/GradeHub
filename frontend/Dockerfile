FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
COPY . .
ENV VITE_API_ORIGIN=
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx-rate-limit.conf /etc/nginx/conf.d/00-rate-limit.conf
COPY nginx-security-headers.inc /etc/nginx/snippets/security-headers.inc
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-ssl.conf /etc/nginx/conf.d/ssl-server.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
