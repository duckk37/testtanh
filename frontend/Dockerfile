# Step 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy the built app to nginx HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to handle React Router and reverse proxy for backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
