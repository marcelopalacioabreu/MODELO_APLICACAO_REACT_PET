# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app
ENV NODE_PATH=/app/node_modules

# Copy package.json to leverage Docker cache
COPY package.json ./

# Install project dependencies
RUN apt-get update && apt-get install -y curl tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm config set strict-ssl false && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Copy all files for initial install
COPY . .

RUN rm -rf node_modules package-lock.json
RUN npx retry-cli -n 3 -- npm install || npm install || npm install

# Create all necessary upload directories with proper permissions (Animal Health Context)
RUN mkdir -p public/uploads/pets && \
    mkdir -p public/uploads/records && \
    mkdir -p public/uploads/users && \
    mkdir -p public/uploads/campaigns && \
    chmod -R 755 public/uploads

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define the command to run the app
CMD [ "npm", "start" ]
