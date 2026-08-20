const { UserRoles } = require("../../config/constant");
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const orderController = require("./oder.controller");
const {
  ProductDTO,
  UpdateCartDTO,
  CheckoutDTO,
  PaymentDTO,
} = require("./order.validator");

const orderRouter = require("express").Router();

orderRouter.post(
  "/add-to-cart",
  checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]),
  bodyValidator(ProductDTO),
  orderController.addToCart,
);

orderRouter.get(
  "/get-cart",
  checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]),
  orderController.getCartList,
);

orderRouter.patch(
  "/cart-update/:cartId",
  checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]),
  bodyValidator(UpdateCartDTO),
  orderController.updateOrRemovefromCart,
);

orderRouter.post(
  "/checkout",
  checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]),
  bodyValidator(CheckoutDTO),
  orderController.checkoutOrder,
);

orderRouter.get(
  "/order-list",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER, UserRoles.CUSTOMER]),
  orderController.getOrderLists,
);

orderRouter.patch(
  "/status/:orderId",
  checkLogin([UserRoles.ADMIN, UserRoles.SELLER]),
  orderController.updateOrderStatus,
);

orderRouter.post(
  "/khalti-pay",
  checkLogin([UserRoles.ADMIN, UserRoles.CUSTOMER]),
  bodyValidator(PaymentDTO),
  orderController.initiatePayment,
);

orderRouter.get("/payment-success", orderController.paymentSuccess);

module.exports = orderRouter;
