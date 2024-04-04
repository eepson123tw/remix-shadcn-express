# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the current directory contents into the container at WORKDIR
COPY . .

# You can pass the API_PATH as a build argument to your Docker build command
ARG API_PATH
ARG LOCAL_PATH
# Set the API_PATH environment variable
ENV API_PATH $API_PATH
ENV LOCAL_PATH $LOCAL_PATH
# Set NODE_ENV as production by default
ENV NODE_ENV production

# You can define a default .env file path
ENV ENV_FILE .env.prod

# Copy .env.prod to the location defined by ENV_FILE
COPY .env.prod $ENV_FILE

# Run npm build script
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Command to start your app
CMD [ "npm", "run", "start" ]
