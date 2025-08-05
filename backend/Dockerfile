# Use Node.js Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# ✅ FIX: Expose the correct port
EXPOSE 8000

# Run the server
CMD ["node", "--experimental-json-modules", "src/index.js"]
