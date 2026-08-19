const categoryRouter = require("express").Router();
const { UserRoles } = require("../../config/constant");
const { CategoryDataDTO } = require("./category.validator");
const uploader = require("../../middlewares/uploader.middleware");
const categoryCtrl = require("./category.controller");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");

categoryRouter.get("/for-home", categoryCtrl.getAllActiveCategories);
categoryRouter.get("/:slug/detail", categoryCtrl.getDetailsBySlug);

// CRUD
categoryRouter.post(
  "/",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  uploader().single("image"),
  bodyValidator(CategoryDataDTO),
  categoryCtrl.addCategory,
);

categoryRouter.get(
  "/",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  categoryCtrl.getAllCategories,
);
categoryRouter.get(
  "/:id",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  categoryCtrl.getCategoryById,
);
categoryRouter.put(
  "/:id",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  uploader().single("image"),
  bodyValidator(CategoryDataDTO),
  categoryCtrl.updateCategoryData,
);
categoryRouter.delete(
  "/:id",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  categoryCtrl.deleteCategoryById,
);

module.exports = categoryRouter;
