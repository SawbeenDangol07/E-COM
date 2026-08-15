const { AppConfig } = require("../../config/app.config");
const userService = require("../user/user.service");
const authService = require("./auth.service");

class AuthController {
  async registerFunction(req, res, next) {
    try {
      const data = authService.transformForUser(req);
      const user = await userService.storeUser(data);
      let meta = {};
      if (AppConfig.environment === "local") {
        await authService.AccActivationEmail(user);
      } else {
        meta = {
          activationLink: `${AppConfig.feUrl}/activate/${user.token}`,
        };
      }

      res.json({
        data: data,
        message: "User registered successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }
  async loginFunction(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }
  async activateUser(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }
  async reactivateUser(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }
  async getLoggedInUser(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }
}
