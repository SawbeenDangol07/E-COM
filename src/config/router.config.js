const authRouter = require("../modules/auth/auth.router");
const BrandRouter = require("../modules/brand/brand.router");
const CategoryRouter = require("../modules/category/category.router");
const productRouter = require("../modules/product/product.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", BrandRouter);
router.use("/category", CategoryRouter);
router.use("/product", productRouter);

module.exports = router;
