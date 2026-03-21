# Stage 1: Build the React Application (multi-stage build)
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files (package.json and lock files)
COPY package*.json bun.lock* ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built files from the previous stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to serve on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 for the frontend
EXPOSE 3000

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
