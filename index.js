const http = require("http");
const app = require("./src/config/express.config");

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 9005;
httpServer.listen(PORT, "0.0.0.0", (err) => {
  if (!err) {
    console.log(`Server is running on port: ${PORT}`);
  } else {
    console.log("App connection error:", err);
  }
});
