declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      DATABASE_URL : string;
      REDIS_URL: string;
      ACTIVATION_TOKEN: string;
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
      ACCESS_TOKEN_EXPIRE: string;
      REFRESH_TOKEN_EXPIRE: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_SERVICE: string;
      SMTP_MAIL: string;
      SMTP_PASSWORD: string;
      API_BASEURL: string;
      SENTRY_KEY: string;
      SENTRY_AUTH_TOKEN: string;
      ORIGIN: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_YEARLY_PRICE_ID: string;
      STRIPE_MONTHLY_PRICE_ID: string;
      STRIPE_WEBHOOK_KEY: string;
      STRIPE_SUCCESS_URL: string;
      STRIPE_CANCEL_URL: string;
      STRIPE_BASE_URL: string;
      STRIPE_WEBHOOK_SECRET_DEV_ENV: string;
      STRIPE_WEBHOOK_SECRET_LIVE_ENV: string;
    }
  }
}

export {}
