const healthRouter = require("express").Router();

const handleHealthCheck = (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Server is online and operational",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
};

healthRouter
  .route("/")
  .head(handleHealthCheck)
  .get(handleHealthCheck);

module.exports = healthRouter;
