var express = require("express");
const uploader = require("../utilities/uploader");
const user = require("../controllers/userController");
const { checkToken } = require("../utilities/tokenAuth");

var router = express.Router();

router.post("/login", user.UserLogin);
router.post("/AdminLogin", user.AdminLogin);
router.post("/signup", user.UserSignUp);
router.post("/addToCart/:productId", checkToken, user.addToCart);
router.post("/removeToCart/:productId", checkToken, user.removeToCart);
// router.post("/forgetPassword", user.GetResetPasswordToken);
router.get("/allUsers", user.GetAllUsers);
router.post("/authToken", user.AuthenticateToken);
router.get("/auth", checkToken, user.UserAuth);
router.get("/getOne/:customerId", user.GetUserById);
router.put("/updateUser/:customerId", user.UpdateUser);
// router.put("/changePassword", user.ResetPassword);
router.put("/updatePassword", checkToken, user.UpdateUserPassword);
router.put(
  "/updateImage",
  checkToken,
  uploader.singleFileUpload.any({ name: "userImage" }),
  user.UpdateUserImage
);
router.delete("/deleteUser/:id", user.DeleteUser);
module.exports = router;
