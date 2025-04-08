# Use Node.js as the base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build:ci


FROM node:18-alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/utilplex ./

CMD node server/server.mjs

# Expose port 4000
EXPOSE 4000
