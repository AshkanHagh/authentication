declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT : string;
      readonly NODE_ENV : string;
      readonly DATABASE_URL  : string;
      readonly REDIS_URL : string;
      readonly ACTIVATION_TOKEN : string;
      readonly ACCESS_TOKEN : string;
      readonly REFRESH_TOKEN : string;
      readonly ACCESS_TOKEN_EXPIRE : string;
      readonly REFRESH_TOKEN_EXPIRE : string;
      readonly SMTP_HOST : string;
      readonly SMTP_PORT : string;
      readonly SMTP_SERVICE : string;
      readonly SMTP_MAIL : string;
      readonly SMTP_PASSWORD : string;
      readonly API_BASEURL : string;
      readonly SENTRY_KEY : string;
      readonly TIMEOUT_SEC : string;
      readonly SENTRY_AUTH_TOKEN : string;
      readonly ORIGIN : string;
      readonly STRIPE_SECRET_KEY : string;
      readonly STRIPE_YEARLY_PRICE_ID : string;
      readonly STRIPE_MONTHLY_PRICE_ID : string;
      readonly STRIPE_WEBHOOK_KEY : string;
      readonly STRIPE_SUCCESS_URL : string;
      readonly STRIPE_CANCEL_URL : string;
      readonly STRIPE_BASE_URL : string;
      readonly STRIPE_WEBHOOK_SECRET_DEV_ENV : string;
      readonly STRIPE_WEBHOOK_SECRET_LIVE_ENV : string;
      readonly OPENAI_KEY : string;
      readonly CLOUDINARY_CLOUD_NAME : string;
      readonly CLOUDINARY_API_KEY : string;
      readonly CLOUDINARY_API_SECRET : string
    }
  }
}

export {}
