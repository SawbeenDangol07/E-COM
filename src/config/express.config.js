const express = require("express");
const cors = require("cors");
const router = require("./router.config");
const { sqlInit } = require("./sequelize.config");
const { default: helmet } = require("helmet");
const { default: rateLimit } = require("express-rate-limit");

require("./mongodb.config");
sqlInit();

const app = express();

app.use(cors());
app.use(helmet());

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2000, // Generous limit for real-time app interactions and chat polling
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    code: 429,
    message: "Too many requests, please try again in a few moments.",
    status: "RATE_LIMIT_EXCEEDED",
  },
});

app.use(limit);

app.use(express.urlencoded({ limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));

app.use("/api/v1", router);

app.use((req, res, next) => {
  res.status(404).json({
    error: null,
    message: "Not Found",
    status: "Not Found",
  });
});

app.use((error, req, res, next) => {
  console.log("Global Error:", error);

  let code = error.code ?? 500;
  let details = error.detail ?? error.details ?? error.error ?? null;
  let msg = error.message ?? "App server error";
  let status = error.status ?? "SERVER_ERROR";

  // Handle MongoDB duplicate key error (code 11000)
  if (error.code === 11000) {
    code = 422;
    status = "DUPLICATE_RESOURCE";
    const keys = Object.keys(error.keyPattern || error.keyValue || {});
    const duplicateField = keys.length ? keys[0] : "field";
    msg = `${duplicateField} already exists. Please use a different ${duplicateField}.`;
    details = {
      [duplicateField]: `${duplicateField} is already registered`,
    };
  }

  let data = error.data ?? null;

  // Ensure code is a valid HTTP status code between 100 and 599
  if (typeof code !== "number" || code < 100 || code >= 600) {
    code = 500;
  }

  res.status(code).json({
    data: data,
    error: details,
    message: msg,
    status: status,
  });
});

module.exports = app;
