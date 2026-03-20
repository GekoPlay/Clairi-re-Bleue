FROM php:8.3-apache
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    vim \
    nano \
    curl \
    telnet

RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY . .
RUN cp db/db_connect.php.docker db/db_connect.php
