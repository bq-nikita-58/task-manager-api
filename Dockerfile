
# Use Node.js 24 Alpine as the base image.
FROM node:24-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy dependency manifests first.
COPY package*.json ./

# Install only production dependencies.
RUN npm ci --omit=dev

# Copy application source code.
COPY src ./src

# Application listens on port 3000.
EXPOSE 3000

# Start the application.
CMD ["npm", "start"]
