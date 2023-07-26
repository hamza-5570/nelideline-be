const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    password: { type: String, required: true },

    email: { type: String, required: true },

    phonenumber: { type: Number },

    user_image_url: {
      type: String,
      default: "",
    },

    user_cart: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        qty: { type: Number, default: 1 },
      },
    ],

    role: {
      type: String,
      enum: ["buyer", "admin", "driver"],
      default: "buyer",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    address: {
      type: String,
      default: null,
    },

    resetToken: String,

    expireToken: Date,

  },

  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
