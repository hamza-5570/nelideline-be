const OrderServices = require("../services/orderServices");
const UserServices = require("../services/userServices");
const NotificationServices = require("../services/notificationServices");
const { customAlphabet } = require("nanoid");
const mailer = require("../utilities/emailSender");
const BuyerHtmlGenerator = require("../utilities/buyerEmail");
const messageUtil = require("../utilities/message");
const {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  existAlreadyResponse,
} = require("../utilities/response");

class Orders {
  createOrder = async (req, res) => {
    try {
      // find driver
      let drivers = await UserServices.getAllUser({
        role: "driver",
      });

      console.log("all driver data", drivers);
      if (drivers.length === 0) {
        return notFoundResponse(res, messageUtil.DriverNotFound);
      }

      let driver = [];
      drivers.map((element) => {
        driver.push(element._id);
      });

      console.log("driver ids", driver);
      // clear cart
      let buyer = await UserServices.updateUserById(
        { _id: req.userId },
        { user_cart: [] }
      );

      console.log("buyer", buyer);
      // create order
      let order = await OrderServices.createOrder({
        ...req.body,
        buyer_id: req.userId,
        user_cart: req.body.user_cart,
      });

      console.log("order", order);
      // send notification
      let notification = await NotificationServices.createNotification({
        message: "One order is created",
        order_id: order._id,
        receiver_id: driver,
      });

      console.log("notification", notification);
      /*****send Email***/
      var to = buyer.email;
      var from = process.env.EMAIL_ADDRESS;
      let sellerEmail = BuyerHtmlGenerator.buyerOrderPlacedEmailGenerator({
        message: "Your order is confirmed",
        address: order.deliveryAddress,
        amount: order.amount,
      });
      //   let msg = `Your verification code is: ${user.resetToken}`;
      await mailer.emailSender(to, from, sellerEmail.subject, sellerEmail.html);

      /********/

      let data = {
        buyer,
        order,
        notification,
      };
      return successResponse(res, messageUtil.orderCreated, data);
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  getAllOrders = async (req, res) => {
    let order;
    try {
      order = await OrderServices.getAllOrders({ ...req.body });
      if (order.length === 0) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, order);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  getOrderById = async (req, res) => {
    const { orderId } = req.params;
    let order;
    try {
      order = await OrderServices.getOrderById({ _id: orderId });
      if (!order) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, order);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  getUserOrders = async (req, res) => {
    let order;
    try {
      order = await OrderServices.getAllOrders({ buyer_id: req.userId });
      if (order.length === 0) {
        successResponse(res, messageUtil.NotFound, []);
      } else {
        successResponse(res, messageUtil.ok, order);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  DeleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
      let order = await OrderServices.DeleteById({ _id: id });
      if (!order) {
        return notFoundResponse(res, messageUtil.NotFound);
      }

      // send notification
      let notification = await NotificationServices.createNotification({
        message: "One order is canceled",
        order_id: order._id,
        receiver_id: order.driverId,
      });

      /**send Email**/
      if (order.driverId != null) {
        var to = order.driverId.email;
        let sellerEmail = BuyerHtmlGenerator.buyerOrderPlacedEmailGenerator({
          message: "One order is canceled",
          address: order.deliveryAddress,
          amount: order.amount,
        });
        //   let msg = `Your verification code is: ${user.resetToken}`;
        await mailer.emailSender(to, sellerEmail.subject, sellerEmail.html);
      }
      /****/

      let data = {
        order,
        notification,
      };

      return successResponse(res, messageUtil.ok, data);
    } catch (error) {
      return serverErrorResponse(res, error);
    }
  };

  UpdateOrder = async (req, res) => {
    const { orderId } = req.params;
    console.log(orderId);
    let order;
    try {
      order = await OrderServices.updateOrder(
        { _id: orderId },
        { ...req.body }
      );
      if (!order) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: order._id });
        return successResponse(res, messageUtil.ok, order);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  AcceptOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
      let order = await OrderServices.updateOrder(
        { _id: orderId },
        {
          driverId: req.userId,
          deliveryStatus: "assigned",
        }
      );

      if (!order) {
        return notFoundResponse(res, messageUtil.OrderNotFound);
      }
      console.log(order);

      /*****send Email***/
      var to = order.driverId.email;
      var from = process.env.EMAIL_ADDRESS;
      let sellerEmail = BuyerHtmlGenerator.buyerOrderPlacedEmailGenerator({
        message: "Your have assigned a order",
        address: order.deliveryAddress,
        amount: order.amount,
      });
      //   let msg = `Your verification code is: ${user.resetToken}`;
      await mailer.emailSender(to, from, sellerEmail.subject, sellerEmail.html);

      /********/

      return successResponse(res, messageUtil.ok, order);
    } catch (error) {
      return serverErrorResponse(res, error);
    }
  };
}
module.exports = new Orders();
