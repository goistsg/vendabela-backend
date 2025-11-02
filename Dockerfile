FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Clean previous build and build the application (explicitly build default project)
RUN rm -rf dist/ || true
RUN echo "Starting build process..." && npx nest build && echo "Build command completed" || (echo "Build command failed with exit code $?" && exit 1)

# Debug: Show what was created
RUN echo "=== Contents of /app ===" && ls -la /app/
RUN echo "=== Contents of dist/ ===" && ls -la dist/ || echo "dist/ directory does not exist"
RUN echo "=== Build output check ===" && find . -name "main.js" -type f 2>/dev/null || echo "main.js not found anywhere"

# Verify build output exists
RUN test -d dist/ || (echo "Build failed - dist directory not found" && exit 1)
RUN test -f dist/src/main.js || (echo "Build failed - dist/src/main.js not found. Contents of dist/:" && ls -laR dist/ && exit 1)
RUN echo "Build successful! Files in dist:" && ls -la dist/

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Verify files exist
RUN ls -la dist/ && test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found!" && exit 1)

EXPOSE 3000

# Run directly with node
CMD ["node", "dist/src/main.js"]