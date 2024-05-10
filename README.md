# Authentication REST API With [Bun](https://bun.sh/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/)

# [V 1.0.0](https://jwtauthentication.liara.run/)

### Description 
My api allows you to easily integrate user authentication into different projects.

### How to use 
signup Body : [name, email, password], login Body : [email, password], after signup user most check his email for verify code after that use route /api/v1/auth/verify to verify that code in user email and complete the signup
### Routes
```typescript
/api/v1/auth/register // for Register
/api/v1/auth/verify // for the verify code that sended in user email
/api/v1/auth/login // for login
/api/v1/auth/logout // for logout
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

ORIGIN
Redis_Url
```

### Start the app
```shell
bun run dev
```

<i>Ashkan<i>
