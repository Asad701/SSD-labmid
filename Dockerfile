# Use Node.js 18 Alpine base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy entire app
COPY . .

# Build Next.js and then run postbuild
RUN npm run build && npm run postbuild

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
