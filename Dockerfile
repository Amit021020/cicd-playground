FROM node:20

WORKDIR /app

# Install Docker CLI and Git
RUN apt-get update \
    && apt-get install -y docker.io git \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]