const express = require("express");
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
  console.log(error);
  let code = error.code ?? 500;
  let details = error.detail ?? error.details ?? null;
  let msg = error.message ?? "App server error";
  let status = error.status;

  res.status(code).json({
    error: details,
    message: msg,
    status: status,
  });
});

module.exports = app;
