# Authentication API

## Introduction

This is a comprehensive Authentication API built with modern technologies including [Bun](https://bun.sh/), [Express](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm), [Redis](https://redis.io/), and [TypeScript](https://www.typescriptlang.org/). It offers robust authentication features such as email verification, JWT-based authentication, and secure password storage.

## Features

- **Authentication**: Provides email verification and JWT-based authentication (access tokens and refresh tokens) to secure user sessions.
- **Data Validation**: Uses [joi](https://joi.dev/) to ensure the integrity and security of user-submitted data.
- **Password Security**: Utilizes [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for hashing passwords securely.
- **Session Management**: Uses [Redis](https://redis.io/) for managing sessions and caching.
- **Email Service**: Uses [nodemailer](https://nodemailer.com/about/) for sending verification emails.
- **Security**: Implements security best practices with [helmet](https://helmetjs.github.io/) and [cors](https://github.com/expressjs/cors).

## Description

This Authentication API is designed to provide a secure and scalable solution for user authentication. It leverages PostgreSQL for reliable and robust data storage, Redis for caching and session management, and various libraries for enhancing security and data integrity.

## Installation

### Install Dependencies

```shell
bun install
```

### Setup .env file
Create a .env file in the root directory of your project and add the following environment variables:
``` shell
PORT
DATABASE_URL
REDIS_URL
NODE_ENV
ACTIVATION_TOKEN
ACTIVATION_EMAIL_TOKEN
ACCESS_TOKEN
REFRESH_TOKEN
ACCESS_TOKEN_EXPIRE
REFRESH_TOKEN_EXPIRE
SMTP_HOST
SMTP_PORT
SMTP_SERVICE
SMTP_MAIL
SMTP_PASSWORD
ORIGIN
```

### Start the app
```shell
bun run dev # Run in development mode with --watch
bun run db:generate # Generate database schema with Drizzle
bun run db:migrate # Apply database migrations with Drizzle
bun run db:studio # Open Drizzle Studio for database management
```

## Usage

### Register a new user

Endpoint: `/api/v2/auth/register`

- Method: POST
- Body:
  ```json
  {
    "username" : "username"
    "email": "user@example.com",
    "password": "yourpassword"
  }

  return : {
    "success": true,
    "activationToken": "yourToken"
  }

### Verify email

Endpoint: `/api/v2/auth/verify`

- Method: POST
- Body:
  ```json
  {
    "activationToken" : "yourToken",
    "activationCode" : "yourCode"
  }

  return : string


### Login

Endpoint: `/api/v2/auth/login`

- Method: POST
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }

  return : {
    "success": true,
    "user": {
        "id": "id",
        "username": "username",
        "email": "user@example.com",
        "createdAt": "createdAt",
        "updatedAt": "updatedAt"
    },
    "accessToken": "token"
  }
  
### Refresh AccessToken

Endpoint: `/api/v2/auth/refresh`

- Method: GET
- return:
  ```json

  return : {
    "success": true,
    "accessToken": "token"
  }

<i>Written by Ashkan.</i>