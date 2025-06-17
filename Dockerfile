# Use Node.js 20 LTS for Angular 20 compatibility
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for better Docker layer caching
COPY package.json package-lock.json* ./

# Install dependencies with exact versions for reproducibility
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build:ci

# Production stage
FROM node:20-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy the built application and dependencies
COPY --from=build --chown=nextjs:nodejs /app/dist/utilplex ./dist/utilplex
COPY --from=build --chown=nextjs:nodejs /app/package.json ./
COPY --from=build --chown=nextjs:nodejs /app/package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Switch to non-root user
USER nextjs

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port 4000
EXPOSE 4000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["node", "dist/utilplex/server/server.mjs"]
