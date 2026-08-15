const uploader = require("../../middlewares/uploader.middleware");
const authCtrl = require("./auth.controller");

const authRouter = require("express").Router();

authRouter.post(
  "/register",
  uploader().single("image"),
  authCtrl.registerFunction,
);
authRouter.get("/activate/:token", authCtrl.activateUser);
authRouter.get("/reactivate/:token", authCtrl.reactivateUser);
authRouter.post("/login", authCtrl.loginFunction);
authRouter.get("/me", checkLogin(), authCtrl.getLoggedInUser);

module.exports = authRouter;
