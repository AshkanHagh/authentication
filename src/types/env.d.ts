declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT : string;
      REDIS_URL : string;
      ACTIVATION_TOKEN : string;
      ACCESS_TOKEN : string;
      REFRESH_TOKEN : string;
      ACCESS_TOKEN_EXPIRE : string;
      REFRESH_TOKEN_EXPIRE : string;
      SENTRY_KEY : string;
      SMTP_HOST : string;
      SMTP_PORT : string;
      SMTP_SERVICE : string;
      SMTP_MAIL : string;
      SMTP_PASSWORD : string;
    }
  }
}

export {}
