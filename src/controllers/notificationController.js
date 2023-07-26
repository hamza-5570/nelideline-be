const NotificationServices = require('../services/notificationServices');
const messageUtil = require('../utilities/message');

const {
  successResponse,
  existAlreadyResponse,
  notFoundResponse,
  authorizationErrorResponse,
  serverErrorResponse,
  badRequestErrorResponse,
} = require('../utilities/response');

class Driver {
  CreateNotification = async (req, res) => {
    let error = [];
    const { receiver_id, order_id } = req.body;
    if (!receiver_id) {
      error.push('Receiver ID');
    }
    if (!order_id) {
      error.push('Order ID');
    }

    if (error > 0) {
      error.join(',');
      return badRequestErrorResponse(res, messageUtil.emptyField + error);
    }

    try {
      let notification = await NotificationServices.createNotification({
        ...req.body,
      });

      return successResponse(res, messageUtil.notification, notification);
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  GetAllNotification = async (req, res) => {
    let notification;

    try {
      notification = await NotificationServices.getAllnotification({
        ...req.body,
      });

      if (!notification) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, notification);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  GetNotificationById = async (req, res) => {
    const { notificationId } = req.params;

    try {
      let notification = await NotificationServices.getNotificationDetails({
        _id: notificationId,
      });
      if (!notification) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, notification);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  updateNotification = async (req, res) => {
    const { notificationId } = req.params;
    let notification;
    try {
      notification = await NotificationServices.updateNotification(
        { _id: notificationId },
        { ...req.body }
      );
      if (!notification) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, notification);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  DeleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
      let user = await NotificationServices.DeleteById({ _id: id });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, user);
      }
    } catch (error) {
      serverErrorResponse(res, error);
    }
  };
}
module.exports = new Driver();
