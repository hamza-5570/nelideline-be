const ProductServices = require("../services/productServices");
const messageUtil = require("../utilities/message");
let slugify = require("slugify");
let nanoid = require("nanoid");

const {
  successResponse,
  existAlreadyResponse,
  notFoundResponse,
  authorizationErrorResponse,
  serverErrorResponse,
} = require("../utilities/response");

class Products {
  addProduct = async (req, res) => {
    // let { product_name, price, description } = req.body;
    //   if()
    console.log("enter hua")
    try {
      let product = await ProductServices.createProduct({
        ...req.body,
        product_image_url: req.files? req.files[0].location: "",
      });

      successResponse(res, messageUtil.productAdded, product);
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  getAllProduct = async (req, res) => {
    let product;

    try {
      product = await ProductServices.getAllProducts();

      if (!product) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, product);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  getProductById = async (req, res) => {
    const { productId } = req.params;
    console.log("productId", productId);
    let product;
    let gift;
    try {
      product = await ProductServices.getProductDetails({ _id: productId });
      if (!product) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // gift = await GiftServices.getGift({ _id: product.gift });
        successResponse(res, messageUtil.ok, product);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  updateProduct = async (req, res) => {
    const { productId } = req.params;
    console.log("productId", productId);
    let user;
    try {
      user = await ProductServices.updateProduct(
        { _id: productId },
        { ...req.body }
      );
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.ok, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  Deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        let product = await ProductServices.DeleteById( 
            {_id: id} );
        if(!product){
            notFoundResponse(res, messageUtil.NotFound);
        }else{
            successResponse(res, messageUtil.ok, product);
        }
        
    } catch (error) {
        serverErrorResponse(res, error);
    }
};
}
module.exports = new Products();
