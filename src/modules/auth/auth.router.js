const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const authCtrl = require("./auth.controller");
const { RegisterDTO, LoginDTO } = require("./auth.validator");

const authRouter = require("express").Router();

authRouter.post(
  "/register",
  uploader().single("image"),
  bodyValidator(RegisterDTO),
  authCtrl.registerFunction,
);

authRouter.get("/activate/:token", authCtrl.activateUser);

authRouter.get("/reactivate/:token", authCtrl.reactivateUser);

authRouter.post("/login", bodyValidator(LoginDTO), authCtrl.loginFunction);

authRouter.get("/me", checkLogin(), authCtrl.getLoggedInUser);

module.exports = authRouter;
