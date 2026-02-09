# Base image - Switching to slim (Debian) for better Prisma compatibility
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies needed for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
# We set a dummy DATABASE_URL for the build step because Prisma/TypeScript config 
# validation requires it, even though we don't connect to the DB here.
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"
RUN npx prisma generate

# Build the application
# We comment this out because 'npm run build' tries to connect to the DB and checks env vars
# which aren't available during Docker build. For specific production builds, we would handle this differently.
# RUN npm run build

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
