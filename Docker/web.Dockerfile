FROM node:18
WORKDIR /app-web
COPY apps/web/package*.json ./
RUN npm install 
COPY apps/web ./
RUN npm install react-chartjs-2 chart.js zod react-icons sweetalert2-react-content
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]