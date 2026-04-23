FROM node:20-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Next.js collects telemetry data by default. Disable it completely for privacy.
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port Next.js application runs on
EXPOSE 3000

# Start the application in development mode as defined in docker-compose.yml command
CMD ["npm", "run", "dev"]
