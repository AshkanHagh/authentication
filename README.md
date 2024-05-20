# Authentication REST API With [Bun](https://bun.sh/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [TypeScript](https://www.typescriptlang.org/)

# [Demo](https://authentication-tk68.onrender.com/)

### Features :

* [JsonWebToken](https://jwt.io/) based Authentication
* Data validation with [Joi](https://joi.dev/)
* Verify email code with [Nodemailer](https://www.nodemailer.com/)
* [Redis](https://redis.io/) session store

### Description 
My api allows you to easily integrate user authentication into different projects.

### How to use 
signup Body : [name, email, password], login Body : [email, password], after signup user most check his email for verify code after that use route /api/v1/auth/verify to verify that code in user email and complete the signup, user access token will expire in 5 day, for refresh user access token use /api/v1/auth/refresh
### Routes
```typescript
/api/v1/auth/register // for Register
/api/v1/auth/verify // for the verify code that sended in user email
/api/v1/auth/login // for login
/api/v1/auth/logout // for logout
/api/v1/auth/refresh // for refresh token
```
### Setup .env file
``` shell
PORT
DATABASE_URL
NODE_ENV

ACTIVATION_SECRET
ACCESS_TOKEN
REFRESH_TOKEN
ACCESS_TOKEN_EXPIRE
REFRESH_TOKEN_EXPIRE

SMTP_HOST
SMTP_PORT
SMTP_SERVICE
SMTP_MAIL
SMTP_PASSWORD

ORIGIN # client url
Redis_Url
```

### Install Dependencies and Start the app
```shell
bun install
bun run dev
```

<i>Ashkan<i>
