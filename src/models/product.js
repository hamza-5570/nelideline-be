const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "$",
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },

    color: {
      type: String,
    },

    quantity: {
      type: Number,
    },

    favourite_by: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    product_image_url: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
