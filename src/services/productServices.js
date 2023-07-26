const ProductSchema = require("../models/product");

exports.createProduct = async (query) => {
  return await ProductSchema.create(query);
};

exports.getProduct = async (query) => {
  return await ProductSchema.findOne(query).select("-__v");
};

exports.getAllProducts = async () => {
  return await ProductSchema.find().populate("category").sort({ _id: -1 }).select("-__v");
};
exports.updateProduct = async (query, data) => {
  return await ProductSchema.findOneAndUpdate(query, data, {
    new: true,
  });
};

exports.getProductDetails = async (query) => {
  return await ProductSchema.findOne(query).populate("category").select(
    "-__v -createdAt -updatedAt"
  );
};

exports.DeleteById = async(query) =>{
  return await ProductSchema.findOneAndDelete(query)
  .select("-__v -password");
}
