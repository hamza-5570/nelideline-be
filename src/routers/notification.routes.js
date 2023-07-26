var express = require("express");
const notification = require("../controllers/notificationController");
const { checkToken } = require("../utilities/tokenAuth");
var router = express.Router();

router.post("/add", notification.CreateNotification);
router.get("/getAll", notification.GetAllNotification);
router.get("/getOne/:notificationId", notification.GetNotificationById);
router.put("/update/:notificationId", notification.updateNotification);
router.delete("/delete/:id", notification.DeleteNotification);
module.exports = router;
