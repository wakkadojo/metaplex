# Stage 1: Compile and Build the app

FROM node:16-alpine 

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git python3 py3-pip pkgconfig

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./js /app

# Install all the dependencies and build the app
RUN yarn install
RUN yarn bootstrap
RUN yarn build

# HERE ADD YOUR STORE WALLET ADDRESS
ENV REACT_APP_STORE_OWNER_ADDRESS_ADDRESS=EdZwBqVjHAtiAvSRcRrucRRPJT6LSUTywubGMaDrt3Rb

WORKDIR /app/packages/web

EXPOSE 3000

CMD ["yarn", "start"]
