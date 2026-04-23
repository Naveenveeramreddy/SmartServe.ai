FROM node:18

WORKDIR /app

# Copy package files from nested folder
COPY nextjs_app/package*.json ./

# Install dependencies
RUN npm install

# Copy full app
COPY nextjs_app/ .

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
