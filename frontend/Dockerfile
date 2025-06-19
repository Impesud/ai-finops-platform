# ---------- STAGE 1: build (all deps inclused) ----------
FROM node:18.19.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- STAGE 2: runtime (only prod deps) ----------
FROM node:18.19.1-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm prune --production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]


