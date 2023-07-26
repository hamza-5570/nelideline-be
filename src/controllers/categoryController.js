const CategoryServices = require("../services/categoryServices");
const messageUtil = require("../utilities/message");


const {
  successResponse,
  existAlreadyResponse,
  notFoundResponse,
  authorizationErrorResponse,
  serverErrorResponse,
  badRequestErrorResponse
} = require("../utilities/response");

class Products {
  addCategory = async (req, res) => {

    let error = [];
    const { name, description } = req.body;
      if(!name){
        error.push("Category Name")
      }

     if(error > 0) {
      error.join(",")
      return badRequestErrorResponse(res, messageUtil.emptyField + error)
     }
    
    try {
      let category = await CategoryServices.createCategorry({
        ...req.body,
      });

      return successResponse(res, messageUtil.category, category);
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  getAllCategory = async (req, res) => {
    let category;

    try {
      category = await CategoryServices.getAllCategory();

      if (!category) {
       return notFoundResponse(res, messageUtil.NotFound);
      } else {
       return successResponse(res, messageUtil.ok, category);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
   
    console.log(categoryId)
    try {
      let category = await CategoryServices.getCategoryDetails({ _id: categoryId });
      if (!category) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        successResponse(res, messageUtil.ok, category);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    let category;
    try {
      category = await CategoryServices.updateCategory(
        { _id: categoryId },
        { ...req.body }
      );
      if (!category) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, category);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  DeleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        let product = await CategoryServices.DeleteById( 
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
