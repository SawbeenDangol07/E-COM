const authRouter = require("../modules/auth/auth.router");
const bannerRouter = require("../modules/banners/banner.router");
const BrandRouter = require("../modules/brand/brand.router");
const CategoryRouter = require("../modules/category/category.router");
const orderRouter = require("../modules/order/order.router");
const productRouter = require("../modules/product/product.router");
const chatRouter = require("../modules/chat/chat.router");
const healthRouter = require("../modules/health/health.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", BrandRouter);
router.use("/category", CategoryRouter);
router.use("/product", productRouter);
router.use("/banner", bannerRouter);
router.use("/order", orderRouter);
router.use("/oder", orderRouter);
router.use("/chat", chatRouter);
router.use("/health", healthRouter);

module.exports = router;
