FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
# COPY package*.json ./

# Copy the rest of the application
COPY . .

# RUN npm run build

# Expose port 3000 (default Next.js port)
EXPOSE 3000

# Run the application
# CMD ["npm", "run", "start"]
