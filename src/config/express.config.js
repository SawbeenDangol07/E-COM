const express = require("express");
const cors = require("cors");
const router = require("./router.config");

require("./mongodb.config");

const app = express();

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

  // Ensure code is a valid HTTP status code between 100 and 599
  if (typeof code !== "number" || code < 100 || code >= 600) {
    code = 500;
  }

  res.status(code).json({
    error: details,
    message: msg,
    status: status,
  });
});

module.exports = app;
