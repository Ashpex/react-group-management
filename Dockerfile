FROM node:16-alpine
# Create app directory
WORKDIR /app
# Bundle app src
COPY package.json ./
RUN npm install --force \
    && npm cache clean --force

COPY . .
RUN npm run build 

EXPOSE 3000

CMD ["npm", "start"]