const { AppConfig } = require("../../config/app.config");
const { Status } = require("../../config/constant");
const userService = require("../user/user.service");
const authService = require("./auth.service");

class AuthController {
  //register function for registering user
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

  //activating registered user
  async activateUser(req, res, next) {
    try {
      const token = req.params.token;
      const user = await userService.getSingleUserByFilter({ token: token });

      if (!user) {
        throw {
          code: 422,
          message: "Token not found",
          status: "TOKEN_NOT_FOUND",
        };
      }

      const today = Date.now();
      const expiryTime = user.expiryTime;

      if (today > expiryTime) {
        throw {
          code: 422,
          message: "Activation token expired",
          status: "ACTIVATION_TOKEN_EXPIRED",
        };
      }

      user.status = Status.ACTIVE;
      user.token = null;
      user.expiryTime = null;

      await user.save();

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "User activated successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //reactivating user
  async reactivateUser(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }

  //login function for the registered user
  async loginFunction(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }

  //get function for logged in user
  async getLoggedInUser(req, res, next) {
    try {
    } catch (exception) {
      next(exception);
    }
  }
}
