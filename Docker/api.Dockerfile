FROM node:18-alpine
WORKDIR /app-api
COPY apps/api/package*.json ./
RUN npm install
COPY apps/api ./
RUN npm install prisma --save-dev
RUN npx prisma generate
EXPOSE 8800
CMD ["npm", "run", "dev"]