const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    image: {
      publicId: String,
      secure_url: String,
      thumbUrl: String,
    },
    brands: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default: null,
      },
    ],
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
  }
);

module.exports = mongoose.model("Category", CategorySchema);
