FROM node:18

WORKDIR /app

# ✅ FIX: copy from nested folder
COPY nextjs_app/package*.json ./

RUN npm install

# ✅ FIX: copy app from nested folder
COPY nextjs_app/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
