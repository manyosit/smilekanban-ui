# Stage 1
FROM node:12.14.1  as react-build
WORKDIR /app
COPY src ./
RUN yarn
RUN yarn build --network-timeout 1000000
# Stage 2 - the production environment
FROM nginx:1.20.0

#RUN addgroup -S appgroup && adduser -S appuser -G appgroup




RUN  useradd -r -u 999 -g 0 appuser
COPY --chown=appuser:0 nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=appuser:0 --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
RUN chown -R appuser:0 /usr/share/nginx/html
COPY --chown=appuser:0 env.sh .
COPY --chown=appuser:0 .env .

RUN chown -R appuser:0 /usr/share/nginx/html && chmod -R 775 /usr/share/nginx/html && \
        chown -R appuser:0 /var/cache/nginx && \
        chmod -R 775 /var/cache/nginx && \
        chown -R appuser:0 /var/log/nginx && \
        chmod -R 775 /var/log/nginx && \
        chown -R appuser:0 /etc/nginx/conf.d && \
        chmod -R 775 /etc/nginx/conf.d && \
        touch /var/run/nginx.pid && \
        chown -R appuser:0 /var/run/nginx.pid && \
        chmod -R 775 /var/run/nginx.pid && \
        rm -rf /usr/share/nginx/html/env-config.js && \
        chmod +x env.sh
#RUN apk add --no-cache bash

# Make our shell script executable


USER appuser
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
