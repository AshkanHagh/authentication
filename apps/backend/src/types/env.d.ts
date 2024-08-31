declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT: string;
      readonly NODE_ENV: string;
      readonly TURSO_DATABASE_URL: string;
      readonly TURSO_AUTH_TOKEN: string;
      readonly REDIS_URL: string;
      readonly ACTIVATION_TOKEN: string;
      readonly ACCESS_TOKEN: string;
      readonly REFRESH_TOKEN: string;
      readonly ACCESS_TOKEN_EXPIRE: string;
      readonly REFRESH_TOKEN_EXPIRE: string;
      readonly MAIL_HOST: string;
      readonly MAIL_PORT: string;
      readonly MAIL_USERNAME: string;
      readonly MAIL_PASSWORD: string;
      readonly API_BASEURL: string;
      readonly SENTRY_KEY: string;
      readonly SENTRY_AUTH_TOKEN: string;
      readonly ORIGIN: string;
      readonly CLOUDINARY_CLOUD_NAME: string;
      readonly CLOUDINARY_API_KEY: string;
      readonly CLOUDINARY_API_SECRET: string;
      readonly TIMEOUT_SEC: number;
      readonly MAGIC_LINK_URL: string;
      readonly MAIL_SENDER: string;
    }
  }
}

export {}
