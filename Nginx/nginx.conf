#!/bin/bash -e
sed -i s/DOMAIN_NAME/$DOMAIN_NAME/g /etc/nginx/nginx.conf
cat /etc/nginx/nginx.conf
exec "$@"
