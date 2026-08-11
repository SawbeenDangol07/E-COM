const mongoose = require("mongoose");
const { UserRoles, Status } = require("../../config/constant");

const UserSchema = new mongoose.Schema(
  {
    //defination model
    name: {
      type: String,
      min: 2,
      max: 50,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER,
    },
    image: {
      public_id: String,
      url: String,
    },
    emailVerfiedAt: Date,
    PhoneNumber: String,
    Address: String,
    token: String,
    expiryTime: String,
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
  },
  {
    // optional/config
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
