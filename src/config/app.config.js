const { mongo } = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const CloudinaryConfig = {
  className: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecrete: process.env.CLOUDINARY_API_SECRETE,
};

const DbConfig = {
  mongodb: {
    url: process.env.MONGODB_URL,
    dbName: process.env.MONGODB_DB,
  },
  pg: {
    url: process.env.PG_URL,
    dialect: "postgres",
  },
};

const SMTPConfig = {
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpFrom: process.env.SMTP_FROM,
  smtpProvider: process.env.SMTP_PROVIDER,
};

const AppConfig = {
  environment: (process.env.ENVIRONMENT || process.env.ENVIROMENT || "development").trim(),
  feUrl: (process.env.FRONTEND_URL || "http://localhost:5173").trim().replace(/\/+$/, ""),
  beUrl: (process.env.APP_URL || "http://localhost:9005").trim().replace(/\/+$/, ""),
  jwtSecret: (process.env.JWT_SECRET || "").trim(),
};

const KhaltiConfig = {
  url: (process.env.KHALTI_URL || "https://dev.khalti.com/api/v2/").trim().replace(/\/+$/, "") + "/",
  key: (process.env.KHALTI_API_KEY || "").trim(),
};

module.exports = {
  CloudinaryConfig,
  DbConfig,
  SMTPConfig,
  AppConfig,
  KhaltiConfig,
};

