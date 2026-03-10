# Backend Dockerfile
# Place this file in your backend root directory (carbon-credit-backend)

FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the correct port matching docker-compose
EXPOSE 5000

# Start the application correctly
CMD ["node", "server.js"]
