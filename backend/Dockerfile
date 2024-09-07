FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install --loglevel verbose
COPY src ./src
RUN npm run build
CMD ["node", "dist/main.js"]