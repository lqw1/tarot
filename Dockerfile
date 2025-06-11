FROM nginx:stable-alpine
# add builded static assets
COPY ./build /usr/share/nginx/html/tarot
# add nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]