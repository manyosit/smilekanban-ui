# Stage 1
FROM node:12.14.1  as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build --network-timeout 1000000
# Stage 2 - the production environment
FROM nginx:1.20.0
# Stage 2 - the production environment
FROM nginx:1.20.0
RUN groupadd -g 999 appuser && useradd -r -u 999 -g appuser appuser
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --chown=appuser:appuser nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=appuser:appuser --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
# Copy .env file and shell script to container

WORKDIR /usr/share/nginx/html
RUN chown -R appuser:appuser /usr/share/nginx/html
COPY --chown=appuser:appuser ./env.sh .
COPY --chown=appuser:appuser .env .


RUN chown -R appuser:appuser /usr/share/nginx/html && chmod -R 775 /usr/share/nginx/html && \
        chown -R appuser:appuser /var/cache/nginx && \
        chmod -R 775 /var/cache/nginx && \
        chown -R appuser:appuser /var/log/nginx && \
        chmod -R 775 /var/log/nginx && \
        chown -R appuser:appuser /etc/nginx/conf.d && \
        chmod -R 775 /etc/nginx/conf.d && \
        touch /var/run/nginx.pid && \
        chown -R appuser:appuser /var/run/nginx.pid && \
        chmod -R 775 /var/run/nginx.pid && \
        rm -rf /usr/share/nginx/html/env-config.js && \
        chmod +x env.sh

# Add bash
#RUN apk add --no-cache bash

# Make our shell script executable

USER appuser

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
