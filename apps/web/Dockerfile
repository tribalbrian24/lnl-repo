# Use Node.js image
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/constants/package.json ./packages/constants/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN pnpm install

# Copy the rest of the monorepo source
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Start the application in development mode
CMD ["pnpm", "--filter", "web", "dev", "--port", "9000"]
