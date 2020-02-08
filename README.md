## Meetapp

Rest API with routes to manage users and jwt authentication.

## Features

- Authentication
- Manager Users

## Technologies

- NodeJS
- Express
- JWT
- PostgreSQL
- Sequelize
- Express Validator
- Docker
- Nodemon
- Sucrase
- Eslint
- Prettier

## Environment

Up postgres container running the following command:

```sh
docker run --name meetapp-postgres -e POSTGRES_PASSWORD=secret -p 5433:5432 -d postgres
```

```sh
docker start meetapp-postgres
```

## Motivation

This app is a challenge from Rocketseat GoStack Bootcamp:
