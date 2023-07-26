var express = require("express");

const userRouter = require("./user.routes");
const orderRouter = require("./order.routes");
const productRouter = require("./product.routes");
// const giftRouter = require("./gift.routes");
// const bannerRouter = require("./banner.routes");
const categoryRouter = require("./category.routes");
const driverRouter = require("./notification.routes")
var router = express.Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/notification", driverRouter);
module.exports = router;
