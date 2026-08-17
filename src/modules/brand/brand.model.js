const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 100,
      required: true,
      unique: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    logo: {
      public_id: String,
      url: String,
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
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  },
);

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
