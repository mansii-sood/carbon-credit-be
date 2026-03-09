# Backend Dockerfile
# Place this file in your backend root directory (carbon-credit-backend)

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your backend runs on (change if different)
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
