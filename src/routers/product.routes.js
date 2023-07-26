var express = require("express");
const product = require("../controllers/productController");
const { checkToken } = require("../utilities/tokenAuth");
const uploader = require("../utilities/uploader");
var router = express.Router();
router.post(
  "/add",
  uploader.singleFileUpload.any({ name: "productImages" }),
  product.addProduct
);
router.get("/getAll", product.getAllProduct);
router.get("/getOne/:productId", product.getProductById);
router.put("/updateProduct/:productId", product.updateProduct);
router.delete("/deleteProduct/:id", product.Deleteproduct);
module.exports = router;
