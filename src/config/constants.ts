import * as dotenv from 'dotenv';
dotenv.config();

interface Whitelist {
  users: {
    create: string[];
  };
}

interface Config {
  JWT_EXPIRATION?: string | undefined;
  JWT_SECRET?:string | undefined;
  DB_USER?: string | undefined;
  DB_PASSWORD?: string | undefined;
  DB_NAME?: string | undefined;
  DB_PORT?: string | undefined;
  DB_DOMAIN?: string | undefined;
  ALLOWED_DOMAIN?: string | undefined;
  S3_ACCESS_KEY?: string | undefined;
  S3_SECRET_KEY?: string | undefined;
  S3_BUCKET_NAME?: string | undefined;
  TWILIO_ACCOUNT_SID?: string | undefined;
  TWILIO_AUTH_TOKEN?: string | undefined;
  TWILIO_PHONE_NUMBER?: string | undefined;
  OPENAI_API_KEY?: string | undefined;
  REPLICATE_API_KEY?: string | undefined;
  NODE_ENV?: string | undefined;
  VERCEL_URL_ORIGIN?: string | undefined;
  WHATS_APP_URL?: string | undefined;
  WHATS_APP_TOKEN?: string | undefined;
  RAZORPAY_KEY_ID?: string | undefined;
  RAZORPAY_SECRET_KEY?: string | undefined;
  PORT: string | number;
  WHITELIST: Whitelist;
  isDev: boolean;
}

const WHITELIST: Whitelist = {
  users: {
    create: ['first_name', 'last_name', 'email', 'password', 'phone_number'],
  },
};

const config: Config = {
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_SECRET : process.env.JWT_SECRET,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_DOMAIN: process.env.DB_DOMAIN,
  ALLOWED_DOMAIN: process.env.DASHBOARD_APP_ORIGIN,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL_ORIGIN: process.env.VERCEL_URL_ORIGIN,
  WHATS_APP_URL: process.env.WHATS_APP_URL,
  WHATS_APP_TOKEN: process.env.WHATS_APP_TOKEN,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY,
  PORT: process.env.PORT || 9000,
  WHITELIST,
  isDev: process.env.NODE_ENV === 'development',
};

export default config;
