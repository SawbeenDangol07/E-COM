const CategoryRouter = require("express").Router();
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const CategoryCtrl = require("./category.controller");
const CategoryDTO = require("./category.validator");

CategoryRouter.post(
  "/",
  checkLogin(["seller"]),
  uploader().single("logo"),
  bodyValidator(CategoryDTO),
  CategoryCtrl.create,
);

CategoryRouter.put(
  "/",
  checkLogin(["seller"]),
  uploader().single("logo"),
  bodyValidator(CategoryDTO),
  CategoryCtrl.update,
);

CategoryRouter.get("/", checkLogin(), CategoryCtrl.listAll);

CategoryRouter.get("/:CategoryId", checkLogin(), CategoryCtrl.getDetail);

CategoryRouter.delete(
  "/:CategoryId",
  checkLogin(["seller"]),
  CategoryCtrl.delete,
);

module.exports = CategoryRouter;
