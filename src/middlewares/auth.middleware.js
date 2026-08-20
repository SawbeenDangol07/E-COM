const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/app.config");
const userService = require("../modules/user/user.service");
const { UserRoles, Status } = require("../config/constant");

const checkLogin = (role = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"] ?? null;

      if (!token) {
        return next({
          code: 401,
          message: "Missing access token",
          status: "MISSING_ACCESS_TOKEN_ERR",
        });
      }

      token = token.replace("Bearer ", "");
      const data = jwt.verify(token, AppConfig.jwtSecret);

      const userDetail = await userService.getSingleUserByFilter({
        _id: data.sub,
      });

      if (!userDetail) {
        return next({
          code: 403,
          message: "User doesn't exist",
          status: "USER_ALREADY_DELETED",
        });
      }

      if (userDetail.status !== Status.ACTIVE) {
        return next({
          code: 403,
          message: "User account is not activated",
          status: "USER_NOT_ACTIVATED",
        });
      }

      req.loggedInUser = userService.getPublicProfileOfUser(userDetail);

      if (
        userDetail.role === UserRoles.ADMIN ||
        role === null ||
        (Array.isArray(role) && role.includes(userDetail.role))
      ) {
        next();
      } else {
        next({
          code: 403,
          message: "User access denied",
          status: "UNAUTHORIZED_ACCESS",
        });
      }
    } catch (exception) {
      let errorBag = {
        code: 401,
        message: exception.message,
        status: "AUTH_ERR",
      };
      next(errorBag);
    }
  };
};

module.exports = checkLogin;
