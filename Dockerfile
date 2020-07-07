# stage1 as builder
FROM node:current-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install && mkdir /react-ui && mv ./node_modules ./react-ui

WORKDIR /react-ui

COPY . .

# Build the project and copy the files
RUN npm run build


FROM nginx:mainline-alpine

#!/bin/sh

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /react-ui/build /usr/share/nginx/html
COPY --from=builder /react-ui/build /var/www

EXPOSE 4000

ENTRYPOINT ["nginx", "-g", "daemon off;"]