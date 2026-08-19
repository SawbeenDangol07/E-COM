const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },
    afterDiscount: {
      type: Number,
      required: true,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    brand: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default: null,
      },
    ],

    description: {
      type: String,
      min: 10,
      default: null,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: String,
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    attributes: [
      {
        key: String,
        value: [String],
      },
    ],

    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
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
    autoIndex: true,
    autoCreate: true,
    timestamps: true,
  },
);

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
