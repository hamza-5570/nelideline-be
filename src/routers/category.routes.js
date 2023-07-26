var express = require("express");
const category = require("../controllers/categoryController");
const { checkToken } = require("../utilities/tokenAuth");
var router = express.Router();

router.post("/add", category.addCategory);
router.get("/getAll", category.getAllCategory);
router.get("/getOne/:categoryId", category.getCategoryById);
router.put("/updateProduct/:categoryId", category.updateCategory);
router.delete("/deleteCategory/:id", category.DeleteCategory);
module.exports = router;
