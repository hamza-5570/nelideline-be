const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders',
    },

    receiver_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
