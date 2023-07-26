var express = require("express");
const order = require("../controllers/orderController");
const { checkToken } = require("../utilities/tokenAuth");

var router = express.Router();
router.post("/create", checkToken, order.createOrder);
// router.get("/getCampaignOrders", order.getCampaignOrders);
router.get("/all", order.getAllOrders);
router.get("/userOrders", checkToken, order.getUserOrders);
// router.post("/addToCart", checkToken, order.addToCart);
router.get("/getOne/:orderId", order.getOrderById);
router.delete("/deleteOrder/:id", order.DeleteOrder);
router.post("/update/:orderId", order.UpdateOrder)
router.post("/acceptOrder/:orderId", checkToken, order.AcceptOrder)
// router.post("/removeFromCart", checkToken, order.removeFromCart);
// router.post("/addCartNumber", checkToken, order.addQtyInCart);
module.exports = router;
