const categorySchema = require("../models/category");

exports.createCategorry = async (query) => {
  return await categorySchema.create(query);
};

exports.getCategory = async (query) => {
  return await categorySchema.findOne(query).select("-__v");
};

exports.getAllCategory = async () => {
  return await categorySchema.find().sort({ _id: -1 }).select("-__v");
};
exports.updateCategory = async (query, data) => {
  return await categorySchema.findOneAndUpdate(query, data, {
    new: true,
  });
};

exports.getCategoryDetails = async (query) => {
  return await categorySchema.findOne(query).select(
    "-__v -createdAt -updatedAt"
  );
};

exports.DeleteById = async(query) =>{
  return await categorySchema.findOneAndDelete(query)
  .select("-__v -password");
}