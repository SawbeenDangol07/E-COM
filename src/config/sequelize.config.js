const { Sequelize } = require("sequelize");
const { DbConfig } = require("./app.config");

let sequelize = null;
if (DbConfig.pg?.url) {
  sequelize = new Sequelize(DbConfig.pg.url, {
    dialect: DbConfig.pg.dialect || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
}

const sqlInit = async () => {
  if (!sequelize) return;
  try {
    await sequelize.authenticate();
    console.log("*** SQL Server Connected ***");
  } catch (exception) {
    console.warn("** Warning: SQL Server connection failed:", exception.message);
  }
};

module.exports = {
  Sequelize,
  sqlInit,
  sequelize,
};
