const productRouter = require("express").Router();
const { UserRoles } = require("../../config/constant");
const checkLogin = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const productCtrl = require("./product.controller");
const { ProductDTO } = require("./product.validator");

productRouter.get("/:slug/detail", productCtrl.getProductBySlug);
productRouter.get("/get-all", productCtrl.getPublicProduct);

productRouter.post(
  "/",
  checkLogin([UserRoles.SELLER]),
  uploader().array("images"),
  bodyValidator(ProductDTO),
  productCtrl.createProduct,
);

productRouter.get(
  "/",
  checkLogin([UserRoles.SELLER]),
  productCtrl.getAllProduct,
);

productRouter.get(
  "/:id",
  checkLogin([UserRoles.SELLER]),
  productCtrl.getProductById,
);
productRouter.put(
  "/:id",
  checkLogin([UserRoles.SELLER]),
  uploader().array("images"),
  bodyValidator(ProductDTO),
  productCtrl.updateProductById,
);

productRouter.delete(
  "/:id",
  checkLogin([UserRoles.SELLER]),
  productCtrl.deleteProductById,
);

module.exports = productRouter;
