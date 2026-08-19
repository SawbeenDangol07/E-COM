const { DbConfig } = require("./app.config");

module.exports = {
  development: {
    url: DbConfig.pg.url,
    dialect: DbConfig.pg.dialect,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
  test: {
    url: DbConfig.pg.url,
    dialect: DbConfig.pg.dialect,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
  production: {
    url: DbConfig.pg.url,
    dialect: DbConfig.pg.dialect,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
};
