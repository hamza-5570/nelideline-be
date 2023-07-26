const OrdersSchema = require("../models/order");

exports.createOrder = async (query) => {
  return await OrdersSchema.create(query);
};

exports.getOrderById = async (query) => {
  return await OrdersSchema.findOne(query).select("-__v").populate("buyer_id");
};

exports.getAllOrders = async (query) => {
  return await OrdersSchema.find(query)
    .sort({ _id: -1 })
    .select("-__v")
    .populate("buyer_id");
};

exports.DeleteById = async (query) => {
  return await OrdersSchema.findOneAndDelete(query)
    .populate("driverId")
    .select("-__v -password");
};

exports.updateOrder = async (query, data) => {
  return await OrdersSchema.findOneAndUpdate(query, data, {
    new: true,
  }).populate("driverId");
};
