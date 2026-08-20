const generateRandomString = require("../../utilities/randomStringGenerator");
const { UserRoles } = require("../../config/constant");
const productService = require("../product/product.service");
const orderService = require("./order.service");
const { AppConfig, KhaltiConfig } = require("../../config/app.config");

class orderController {
  async addToCart(req, res, next) {
    try {
      const { product, quantity } = req.body;
      const loggedInUser = req.loggedInUser;

      const productInfo = await productService.getSingleRowByFilter({
        _id: product,
      });

      if (!productInfo) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        };
      }

      let cart = await orderService.getSingleRowByFilter({
        status: "cart",
        buyer: loggedInUser._id,
      });

      let orderDetail = null;
      let orderCostCalculation = {
        subTotal: 0,
        serviceCharge: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };
      let msg = "";
      let transaction = null;
      let order = null;

      if (cart) {
        orderDetail = cart.detail;

        let index = null;
        orderDetail.map((orderDet, ind) => {
          if (orderDet.product._id.equals(product)) {
            index = ind;
          }
        });

        if (index === null) {
          orderDetail.push(
            await orderService.createOrderDetailObject(productInfo, quantity),
          );
        } else {
          orderDetail[index].quantity =
            +orderDetail[index].quantity + +quantity;

          orderDetail[index].price = productInfo.afterDiscount;
          orderDetail[index].subTotal =
            productInfo.afterDiscount * orderDetail[index].quantity;
        }

        orderCostCalculation = orderService.createOrderCalculation(orderDetail);

        const updateData = {
          detail: orderDetail,
          ...orderCostCalculation,
          updatedBy: loggedInUser._id,
        };

        order = await orderService.updatedSingleRowByFilter(
          { _id: cart._id },
          updateData,
        );

        msg = "cart Updated sucessfully";
      } else {
        orderDetail = [
          await orderService.createOrderDetailObject(productInfo, quantity),
        ];

        orderCostCalculation = orderService.createOrderCalculation(orderDetail);

        msg = "Cart Created successfully";

        let orderInfo = {
          orderId: generateRandomString(15),
          buyer: loggedInUser._id,
          detail: orderDetail,
          ...orderCostCalculation,
          transaction: transaction,
          createdBy: loggedInUser._id,
          status: "cart",
        };

        order = await orderService.createOrder(orderInfo);
      }
      res.json({
        data: order,
        message: msg,
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getCartList(req, res, next) {
    try {
      let filter = {
        status: "cart",
        buyer: req.loggedInUser._id,
      };

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit,
      };
      const { data, pagination } = await orderService.getAllRowsByFilter(
        filter,
        config,
      );
      res.json({
        data: data,
        message: "Your cart List",
        status: "OK",
        meta: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async updateOrRemovefromCart(req, res, next) {
    try {
      const cartId = req.params.cartId;
      const loggedInUser = req.loggedInUser;
      const { product, quantity } = req.body;

      let cart = await orderService.getSingleRowByFilter({
        orderId: cartId,
        buyer: loggedInUser._id,
        status: "cart",
      });
      if (!cart) {
        throw {
          code: 404,
          message: "Cart Not found",
          status: "CART_NOT_FOUND_ERR",
        };
      }

      const productDetail = await productService.getSingleRowByFilter({
        _id: product,
      });
      if (!productDetail) {
        throw {
          code: 404,
          message: "Product does not exits",
          status: "PRODUCT_NOT_FOUND_ERR",
        };
      }

      let index = null;
      cart.detail.map((item, ind) => {
        if (item.product._id.equals(product)) {
          index = ind;
        }
      });

      if (index === null) {
        throw {
          code: 404,
          message: "Product does not exists in cart anymore",
          status: "ITEM_NOT_FOUND_IN_CART_ERR",
        };
      }

      let cartItems = cart.detail;
      let orderDetail = cartItems[index];

      if (orderDetail.quantity < quantity) {
        throw {
          code: 422,
          message: "Quantity is less in your cart",
          status: "LESS_QUANTITY_IN_CART",
        };
      } else if (+quantity === 0 || +quantity === +orderDetail.quantity) {
        // remove from cart
        cartItems.splice(index, 1);
      } else {
        // update
        cartItems[index].quantity -= +quantity;
        cartItems[index].price = productDetail.afterDiscount;
        cartItems[index].subTotal =
          cartItems[index].quantity * cartItems[index].price;
      }

      let msg = "";

      if (cartItems.length > 0) {
        const updateBody = {
          detail: cartItems,
          ...orderService.createOrderCalculation(cartItems),
        };
        cart = await orderService.updatedSingleRowByFilter(
          { _id: cart._id },
          updateBody,
        );
        msg = "Your cart updated successfully";
      } else {
        cart = await orderService.deleteSingleRowByFilter({ _id: cart._id });
        msg = "Cart removed successfully.";
      }

      res.json({
        data: cart,
        message: msg,
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async checkoutOrder(req, res, next) {
    try {
      const { cartId, discount } = req.body;
      const loggedInUser = req.loggedInUser;

      let cart = await orderService.getSingleRowByFilter({
        status: "cart",
        orderId: cartId,
        buyer: loggedInUser._id,
      });
      if (!cart) {
        throw {
          code: 404,
          message: "Cart does not exists",
          status: "CART_NOT_FOUND_ERR",
        };
      }

      cart = await orderService.updatedSingleRowByFilter(
        { _id: cart._id },
        {
          status: "new",
        },
      );
      //
      res.json({
        data: cart,
        message: "Checkout initialized",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getOrderLists(req, res, next) {
    try {
      let filter = {
        status: { $ne: "cart" },
      };
      const loggedInUser = req.loggedInUser;

      if (loggedInUser.role === UserRoles.CUSTOMER) {
        filter = {
          ...filter,
          buyer: loggedInUser._id,
        };
      } else if (loggedInUser.role === UserRoles.SELLER) {
        filter = {
          ...filter,
          "detail.seller": loggedInUser._id,
        };
      }

      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      };
      const { data, pagination } = await orderService.getAllRowsByFilter(
        filter,
        config,
      );
      res.json({
        data: data,
        message: "Your Order List",
        status: "OK",
        meta: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const loggedInUser = req.loggedInUser;

      let filter = {
        $or: [{ orderId }, { _id: orderId }],
      };

      if (loggedInUser.role === UserRoles.SELLER) {
        filter["detail.seller"] = loggedInUser._id;
      }

      const updated = await orderService.updatedSingleRowByFilter(filter, {
        status: status,
        updatedBy: loggedInUser._id,
      });

      if (!updated) {
        throw {
          code: 404,
          message: "Order not found or unauthorized to update",
          status: "ORDER_NOT_FOUND",
        };
      }

      res.json({
        data: updated,
        message: `Order status updated to ${status}`,
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async initiatePayment(req, res, next) {
    try {
      const { orderId, method } = req.body;
      const loggedInUser = req.loggedInUser;
      let filter = {
        orderId: orderId,
        status: "new",
        transaction: null,
      };

      if (loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          buyer: loggedInUser._id,
        };
      }
      const orderDetail = await orderService.getSingleRowByFilter(filter);
      if (!orderDetail) {
        return res.json({
          code: 402,
          message: "Order already Paid",
          status: "ORDER_ALREADY_PAID_ERR",
        });
      }

      let response;

      if (method === "khalti") {
        await orderService.updatedSingleRowByFilter(
          { orderId: orderDetail.orderId },
          { paymentMethod: "khalti" }
        );

        // Khalti amount must be in paisa (minimum 1000 paisa / Rs 10, positive integer)
        const amountInPaisa = Math.max(1000, Math.round(orderDetail.total));

        // Khalti v2 ePayment payload
        const body = {
          return_url: `${AppConfig.beUrl}/api/v1/order/payment-success`,
          website_url: AppConfig.feUrl,
          amount: amountInPaisa,
          purchase_order_id: orderDetail.orderId,
          purchase_order_name: `Order #${orderDetail.orderId}`,
          customer_info: {
            name: loggedInUser.name || "Customer",
            email: loggedInUser.email || "customer@example.com",
            phone: loggedInUser.phone || "9800000000",
          },
        };

        const baseUrl = KhaltiConfig.url.trim().replace(/\/+$/, "");
        const khaltiUrl = `${baseUrl}/epayment/initiate/`;
        const khaltiKey = KhaltiConfig.key.trim().replace(/^Key\s+/i, "");

        console.log("Calling Khalti API:", khaltiUrl);
        console.log("Khalti Payload:", body);

        const khaltiResponse = await fetch(khaltiUrl, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Authorization: `Key ${khaltiKey}`,
            "Content-Type": "application/json",
          },
        });

        response = await khaltiResponse.json();
        console.log("Khalti API Response Status:", khaltiResponse.status, "Body:", response);

        if (!khaltiResponse.ok || !response.payment_url) {
          const errMsg =
            response.detail ||
            response.message ||
            (typeof response === "object" ? JSON.stringify(response) : "Khalti gateway initialization failed");
          throw {
            code: 400,
            message: errMsg,
            status: "KHALTI_INIT_FAILED",
            data: response,
          };
        }
      } else {
        response = await orderService.updatedSingleRowByFilter(
          {
            orderId: orderDetail.orderId,
          },
          {
            paymentMethod: "cod",
            status: "processing",
          },
        );
      }
      res.json({
        data: response,
        message: "Payment initiated",
        status: "OK",
      });
    } catch (exception) {
      console.error("Initiate Payment Error:", exception);
      next(exception);
    }
  }

  async paymentSuccess(req, res, next) {
    try {
      const data = req.query;
      console.log("Khalti payment callback:", data);

      const orderDetail = await orderService.getSingleRowByFilter({
        orderId: data.purchase_order_id,
      });

      if (!orderDetail) {
        return res.redirect(`${AppConfig.feUrl}/orders?error=Order not found`);
      }

      // Check if status is actually completed from Khalti
      const isCompleted =
        (data.status && data.status.toLowerCase() === "completed") ||
        (data.transaction_id && data.status !== "User canceled");

      if (isCompleted && data.transaction_id) {
        await orderService.updatedSingleRowByFilter(
          {
            orderId: orderDetail.orderId,
          },
          {
            paymentMethod: "khalti",
            transaction: [
              {
                transactionCode: data.transaction_id || data.pidx,
                amount: data.amount ? Number(data.amount) : orderDetail.total,
                data: JSON.stringify(data),
              },
            ],
            status: "processing",
          },
        );

        return res.redirect(
          `${AppConfig.feUrl}/checkout/success?orderId=${orderDetail.orderId}&payment=khalti`
        );
      } else {
        // Payment was NOT completed (user canceled, failed, or pending)
        // Keep order in its current status ('new') and do NOT record any transaction
        return res.redirect(
          `${AppConfig.feUrl}/orders?warning=Khalti payment was not completed. You can retry payment anytime from your orders dashboard.&orderId=${orderDetail.orderId}`
        );
      }
    } catch (exception) {
      console.log("Payment callback error:", exception);
      res.redirect(`${AppConfig.feUrl}/orders?error=Payment verification error`);
    }
  }
}

module.exports = new orderController();
