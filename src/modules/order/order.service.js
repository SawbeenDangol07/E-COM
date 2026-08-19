const OrderModel = require("./order.model");

class OrderService {
  async getSingleRowByFilter(filter) {
    try {
      const order = await OrderModel.findOne(filter)
        .populate("detail.product", [
          "_id",
          "name",
          "slug",
          "price",
          "discount",
          "afterDiscount",
          "images",
        ])
        .populate("buyer", [
          "_id",
          "name",
          "email",
          "role",
          "status",
          "address",
          "phone",
          "image",
        ]);

      return order;
    } catch (exception) {
      throw exception;
    }
  }

  createOrderDetailObject(productInfo, quantity) {
    return {
      product: productInfo._id,
      price: productInfo.afterDiscount,
      name: productInfo.name,
      seller: productInfo.seller,
      quantity: +quantity,
      subTotal: quantity * productInfo.afterDiscount,
    };
  }

  createOrderCalculation(orderDetail) {
    let orderCostCalculation = {
      subTotal: 0,
      serviceCharge: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };
    orderDetail.map((item) => {
      orderCostCalculation.subTotal += item.subTotal;
    });

    orderCostCalculation.serviceCharge = orderCostCalculation.subTotal * 0.1;
    orderCostCalculation.discount = 0;

    const netSubTotal =
      orderCostCalculation.subTotal -
      orderCostCalculation.discount +
      orderCostCalculation.serviceCharge;

    orderCostCalculation.tax = netSubTotal * 0.13;
    orderCostCalculation.total = netSubTotal + orderCostCalculation.tax;
    return orderCostCalculation;
  }

  async updatedSingleRowByFilter(filter, data) {
    try {
      const order = await OrderModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true }
      );

      return order;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, config = { page: 1, limit: 20 }) {
    try {
      const skip = (config.page - 1) * config.page;
      const order = await OrderModel.find(filter)
        .populate("detail.product", [
          "_id",
          "name",
          "slug",
          "price",
          "discount",
          "afterDiscount",
          "images",
        ])
        .populate("buyer", [
          "_id",
          "name",
          "email",
          "role",
          "status",
          "address",
          "phone",
          "image",
        ])
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(config.limit);
      const total = await OrderModel.countDocuments(filter);

      return {
        data: order,
        pagination: {
          page: +config.page,
          limit: +config.limit,
          total: total,
          noOfPages: Math.ceil(total / config.limit),
        },
      };
    } catch (exception) {
      throw exception;
    }
  }

  async createOrder(data) {
    try {
      const order = new OrderModel(data);
      return await order.save();
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSingleRowByFilter(filter) {
    try {
      const order = await OrderModel.findOneAndDelete(filter);
      return order;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new OrderService();
