const { Sequelize } = require("sequelize");
const { DbConfig } = require("./app.config");

const sequelize = new Sequelize(DbConfig.pg.url, {
  dialect: DbConfig.pg.dialect,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

const sqlInit = async () => {
  try {
    await sequelize.authenticate();
    console.log("*** SQL Server Connected ***");
  } catch (exception) {
    console.log("** Error connecting sql Server **");
    process.exit(1);
  }
};

module.exports = {
  Sequelize,
  sqlInit,
  sequelize,
};
