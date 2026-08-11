const mongoose = require("mongoose");
const dns = require("dns");
const { DbConfig } = require("./app.config");

// Use public DNS to resolve mongodb+srv SRV records on Windows/ISPs that block SRV queries
dns.setServers(["8.8.8.8", "1.1.1.1"]);

(async () => {
  try {
    await mongoose.connect(DbConfig.mongodb.url, {
      dbName: DbConfig.mongodb.dbName,
      autoCreate: true,
      autoIndex: true,
    });
    console.log("*********MongoDB connection sucessfully*********");
  } catch (exception) {
    console.log("MongoDB connection error:", exception);
  }
})();
