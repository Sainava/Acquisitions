# Multi-stage Dockerfile for Acquisitions API

# --- Production image (default) ---
FROM node:22-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Only copy package files first for better layer caching
COPY package*.json ./

# Install production deps in a separate layer
RUN npm ci --omit=dev

# Copy app source
COPY src ./src
COPY drizzle.config.js ./

# Expose port
EXPOSE 3000

# Default command (can be overridden by compose)
CMD ["node", "src/index.js"]


# --- Development image (includes devDependencies like drizzle-kit) ---
FROM node:22-alpine AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development

COPY package*.json ./
# Install ALL deps including devDependencies for tooling (drizzle-kit, eslint, etc.)
RUN npm ci

# Copy entire project (source + configs)
COPY . .

EXPOSE 3000
# Default dev command (compose may override)
CMD ["npm", "run", "dev"]
