FROM postgres:latest

WORKDIR /docker-entrypoint-initdb.d
COPY schema.sql .
EXPOSE 5432
