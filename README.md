# Authentication REST API With [Bun](https://bun.sh/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/)

# [V 1.0.0](https://jwtauthentication.liara.run/)

### Description 
My api allows you to easily integrate user authentication into different projects.
### Routes
```typescript
/api/v1/auth/register // for Register
/api/v1/auth/verify // for the verify code that sended in user email
/api/v1/auth/login // for login
```
### Setup .env file
``` shell
PORT
DATABASE_URL
JWT_SECRET
SMTP_HOST
SMTP_PORT
SMTP_SERVICE
SMTP_MAIL
SMTP_PASSWORD
```

### Start the app
```shell
bun run dev
```

<i>Ashkan<i>
