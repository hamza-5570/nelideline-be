const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema(
  {
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    purchased_at: {
      type: Date,
      default: Date.now(),
    },

    billing_address: {
      type: String,
      required: true,
    },

    user_cart: [
      {
        product_id: {
          type: Object,
        },
        qty: { type: Number, default: 1 },
      },
    ],

    deliveryStatus: {
      type: String,
      enum: ["created", "assigned", "deliverd"],
      default: "created"
    },

    deliveryAddress: {
      type: String,
      default: null,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Orders', ordersSchema);
