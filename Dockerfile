FROM node:22 as build

COPY . .
RUN yarn install
RUN yarn run build

FROM nginx

COPY --from=build dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf