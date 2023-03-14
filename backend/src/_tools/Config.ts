import * as dotenv from 'dotenv';
import * as process from "process";
dotenv.config();

const port = process.env.PORT;

const jwt = {
  secret: process.env.SECRET,
  expire: process.env.EXPIRES_IN,
  salt_round: parseInt(process.env.SALT_ROUNDS)
}

const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  uri: process.env.DB_URI ||
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin&directConnection=true`,
}

const cache = {
  host: process.env.CACHE_HOST,
  port: parseInt(process.env.CACHE_PORT),
  ttl: parseInt(process.env.CACHE_TTL),
}

const discord = {
  client: process.env.DISCORD_CLI_ID,
  secret: process.env.DISCORD_CLI_SECRET,
};

const mailjet = {
  host: process.env.MAILJET_HOST,
  port: parseInt(process.env.MAILJET_PORT),
  user: process.env.MAILJET_USER,
  pass: process.env.MAILJET_PASS,
  email: process.env.MAILJET_EMAIL,
};

const auth0 = {
  domain: process.env.AUTH0_DOMAIN,
  // token:
  client: process.env.AUTH0_CLI_ID,
  secret: process.env.AUTH0_CLI_SECRET,
};

export {
  port as port,
  jwt as jwt,
  db as db,
  cache as cache,
  discord as discord,
  mailjet as mailjet,
  auth0 as auth0,
};