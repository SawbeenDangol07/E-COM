const authRouter = require("../modules/auth/auth.router");
const BrandRouter = require("../modules/brand/brand.router");

const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/brand", BrandRouter);

module.exports = router;
