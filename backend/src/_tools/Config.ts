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

const reddit = {
  client: process.env.REDDIT_CLI_ID,
  secret: process.env.REDDIT_CLI_SECRET,
}

const wakatime = {
  client: process.env.WAKATIME_CLI_ID,
  secret: process.env.WAKATIME_CLI_SECRET,
}

const papi = {
  url: process.env.PAPI_URL,
  host: process.env.PAPI_CLI_HOST,
  secret: process.env.PAPI_CLI_SECRET,
}

const mailjet = {
  host: process.env.MAILJET_HOST,
  port: parseInt(process.env.MAILJET_PORT),
  user: process.env.MAILJET_USER,
  pass: process.env.MAILJET_PASS,
  email: process.env.MAILJET_EMAIL,
};

export {
  port as port,
  jwt as jwt,
  db as db,
  cache as cache,
  discord as discord,
  reddit as reddit,
  wakatime as wakatime,
  papi as papi,
  mailjet as mailjet,
};