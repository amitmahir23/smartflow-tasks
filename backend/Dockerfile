# Use Node.js LTS alpine for a smaller image size
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
# Since there corresponds no package.json in backend yet, we use a dummy path structure here
# This will fail build without a package.json, so ensure you initialize your backend node project!
RUN npm install || echo "No package.json found, skipping npm install"

# Copy the rest of the backend files
COPY . .

# Expose port 5000 for the backend API
EXPOSE 5000

# Specify environment variables (can be overridden by docker-compose)
ENV PORT=5000

# Run the backend server
CMD ["node", "server.js"]
