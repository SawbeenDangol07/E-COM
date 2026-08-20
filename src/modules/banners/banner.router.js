const { UserRoles } = require("../../config/constant");
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const bannerController = require("./banner.controller");
const { BannerDTO } = require("./banner.validator");

const bannerRouter = require("express").Router();

bannerRouter.post(
  "/",
  checkLogin([UserRoles.ADMIN]),
  uploader().single("image"),
  bodyValidator(BannerDTO),
  bannerController.createBanner,
);
bannerRouter.get(
  "/",
  checkLogin([UserRoles.ADMIN]),
  bannerController.listAllBanners,
);

bannerRouter.get("/home", bannerController.listForHome);

bannerRouter.get(
  "/:bannerId",
  checkLogin([UserRoles.ADMIN]),
  bannerController.getDetailById,
);
bannerRouter.put(
  "/:bannerId",
  checkLogin([UserRoles.ADMIN]),
  uploader().single("image"),
  bodyValidator(BannerDTO),
  bannerController.updateBannerById,
);
bannerRouter.delete(
  "/:bannerId",
  checkLogin([UserRoles.ADMIN]),
  bannerController.deleteById,
);

module.exports = bannerRouter;
