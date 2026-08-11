const http = require("http");
const app = require("./src/config/express.config");

const httpServer = http.createServer(app);

const HOST = "localhost";
const PORT = 9005;
httpServer.listen(PORT, HOST, (err) => {
  if (!err) {
    console.log("server is connected to port: " + PORT);
    console.log("Press ctrl+c to exit");
  } else {
    console.log("App connection error");
  }
});
