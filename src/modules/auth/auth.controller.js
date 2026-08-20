const { AppConfig } = require("../../config/app.config");
const { Status } = require("../../config/constant");
const generateRandomString = require("../../utilities/randomStringGenerator");
const userService = require("../user/user.service");
const authService = require("./auth.service");
const cloudinaryService = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  //register function for registering user
  async registerFunction(req, res, next) {
    try {
      const data = await authService.transformForUser(req);

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
      const token = req.params.token;
      const user = await userService.getSingleUserByFilter({
        token: token,
      });

      if (!user) {
        throw {
          code: 422,
          message: "Token not found",
          status: "TOKEN_NOT_FOUND",
        };
      }

      const data = {
        token: generateRandomString(),
        expiryTime: new Date(Date.now() + 86400000),
      };

      let userDetail = await userService.updateSingleRowByFilter(
        { _id: user._id },
        data,
      );

      let meta = {};

      if (AppConfig.environment === "local") {
        await authService.ReAccActivationEmail(userDetail);
      } else {
        meta = {
          activationLink: `${AppConfig.feUrl}/activate/${userDetail.token}`,
        };
      }

      res.json({
        data: userService.getPublicProfileOfUser(user),
        message: "Activation email resent successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //login function for the registered user
  async loginFunction(req, res, next) {
    try {
      const { email, password } = req.body;
      const userDetail = await userService.getSingleUserByFilter({
        email: email,
      });

      if (!userDetail) {
        throw {
          code: 422,
          message: "User doesn't exist",
          status: "USER_NOT_REGISTERED",
        };
      }

      if (!bcrypt.compareSync(password, userDetail.password)) {
        throw {
          code: 422,
          message: "Credentials does not match",
          status: "INVALID_CREDENTIALS",
        };
      }

      if (userDetail.status !== Status.ACTIVE) {
        throw {
          code: 403,
          message:
            "User is not activated. Please check your email to activate your account before logging in.",
          status: "USER_NOT_ACTIVATED",
          data: userDetail.token,
        };
      }

      let authToken = jwt.sign({ sub: userDetail._id }, AppConfig.jwtSecret, {
        expiresIn: "10d",
      });

      res.json({
        data: authToken,
        message: "You're loggedIn",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //get function for logged in user
  async getLoggedInUser(req, res, next) {
    try {
      res.json({
        data: req.loggedInUser,
        message: "Your Profile",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  // Update profile and avatar for logged in user
  async updateProfile(req, res, next) {
    try {
      const userId = req.loggedInUser._id;
      const updateData = {};

      if (req.body.name && req.body.name.trim()) {
        updateData.name = req.body.name.trim();
      }
      if (req.body.phone) {
        updateData.phone = req.body.phone;
      }
      if (req.body.address) {
        updateData.address = req.body.address;
      }
      if (req.body.storeName) {
        updateData.storeName = req.body.storeName;
      }

      if (req.file) {
        const uploadedImg = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/user",
        );
        updateData.image = uploadedImg;
      }

      const updatedUser = await userService.updateSingleRowByFilter(
        { _id: userId },
        updateData,
      );

      res.json({
        data: userService.getPublicProfileOfUser(updatedUser),
        message: "Profile updated successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }
}

let authCtrl = new AuthController();

module.exports = authCtrl;
