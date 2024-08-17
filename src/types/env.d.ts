declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT : string;
      NODE_ENV : string;
      REDIS_URL : string;
      ACTIVATION_TOKEN : string;
      ACCESS_TOKEN : string;
      REFRESH_TOKEN : string;
      ACCESS_TOKEN_EXPIRE : string;
      REFRESH_TOKEN_EXPIRE : string;
      SMTP_HOST : string;
      SMTP_PORT : number;
      SMTP_USER : string;
      SMTP_PASSWORD : string;
      API_BASEURL : string;
      SENTRY_KEY : string;
    }
  }
}

export {}
