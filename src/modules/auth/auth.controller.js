const authService = require("./auth.service");

class AuthController {
  async registerFunction(req, res, next) {
    try {
      const data = authService.transformForUser(req);
      const user = await userService
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
