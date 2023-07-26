const notificationSchema = require("../models/notification");

exports.createNotification = async (query) => {
  return await notificationSchema.create(query);
};

exports.getnotification = async (query) => {
  return await notificationSchema.findOne(query).select("-__v");
};

exports.getAllnotification = async (query) => {
  return await notificationSchema
    .find(query)
    .populate("order_id")
    .sort({ _id: -1 })
    .select("-__v");
};
exports.updateNotification = async (query, data) => {
  return await notificationSchema.findOneAndUpdate(query, data, {
    new: true,
  });
};

exports.getNotificationDetails = async (query) => {
  return await notificationSchema
    .findOne(query)
    .populate("order_id")
    .populate("receiver_id");
};

exports.DeleteById = async (query) => {
  return await notificationSchema
    .findOneAndDelete(query)
    .select("-__v -password");
};
