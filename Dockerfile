# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy your .env file (optional — if not passed at runtime)
# COPY .env .env

EXPOSE 3000

CMD ["yarn", "start"]
