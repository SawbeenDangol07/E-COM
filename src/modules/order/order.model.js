const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    buyer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    detail: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        seller: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
        subTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    serviceCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    transaction: [
      {
        transactionCode: {
          type: String,
          default: null,
        },
        amount: { type: Number, default: null },
        data: { type: String },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["khalti", "cod"],
      default: "cod",
    },
    status: {
      type: String,
      enum: ["cart", "new", "processing", "cancelled", "delivered"],
      default: "cart",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
