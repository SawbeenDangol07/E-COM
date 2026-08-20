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

BrandRouter.put(
  "/:brandId",
  checkLogin(["seller"]),
  uploader().single("logo"),
  bodyValidator(BrandDTO),
  BrandCtrl.update,
);

BrandRouter.get("/", BrandCtrl.listAll);
BrandRouter.get("/for-home", BrandCtrl.listAll);
BrandRouter.get("/slug/:slug", BrandCtrl.getDetailBySlug);
BrandRouter.get("/:slug/detail", BrandCtrl.getDetailBySlug);

BrandRouter.get("/:brandId", checkLogin(), BrandCtrl.getDetail);

BrandRouter.delete("/:brandId", checkLogin(["seller"]), BrandCtrl.delete);

module.exports = BrandRouter;
