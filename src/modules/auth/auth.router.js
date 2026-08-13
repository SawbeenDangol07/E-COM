const uploader = require("../../middlewares/uploader.middleware");

const authRouter = require("express").Router();

authRouter.post("/register", uploader.single("image"),);

module.exports = authRouter;
