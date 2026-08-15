const BrandRouter = require("express").Router();
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const BrandCtrl = require("./brand.controller");
const BrandDTO = require("./brand.validator");

BrandRouter.post(
  "/",
  checkLogin(["seller"]),
  uploader().single("logo"),
  bodyValidator(BrandDTO),
  BrandCtrl.create,
);

module.exports = BrandRouter;
