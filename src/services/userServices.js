const UserSchema = require("../models/user");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");

exports.createUser = async (query) => {
  return await UserSchema.create(query);
};

exports.getUser = async (query) => {
  console.log("queryquery", query);
  return await UserSchema.findOne(query)
    .populate({
      path: "user_cart",
      populate: [
        {
          path: "product_id",
          model: "Products",
          select: {
            _id: 1,
            product_name: 1,
            price: 1,
            description: 1,
            product_image_url: 1,
          },
        },
      ],

    });
};

exports.getUserDetails = async (query) => {
  return await UserSchema.findOne(query).select(
    "-__v -createdAt -updatedAt -password"
  );
};

exports.updateUserById = async (query, data) => {
  return await UserSchema.findOneAndUpdate(query, data, {
    new: true,
  }) .populate({
    path: "user_cart",
    populate: [
      {
        path: "product_id",
        model: "Products",
        select: {
          _id: 1,
          product_name: 1,
          price: 1,
          description: 1,
          product_image_url: 1,
        },
      },
    ],

  });
};

exports.getAllUser = async (query) => {
  return await UserSchema.find(query).sort({ _id: -1 }).select("-__v -password");
};

exports.generateResetToken = async function (query) {
  const nanoid = customAlphabet("1234567890", 5);
  const seller = await UserSchema.findOne(query);
  if (!seller) {
    return;
  }
  const token = nanoid();
  seller.resetToken = token;
  seller.expireToken = Date.now() + 3600000;
  let updateuser = await seller.save();

  return updateuser;
};

exports.createNewPassword = async function (query) {
  const seller = await UserSchema.findOne({
    resetToken: query.token,
    expireToken: { $gt: Date.now() },
  });
  if (!seller) {
    return;
  }
  let salt = await bcrypt.genSalt(10);

  seller.password = await bcrypt.hash(query.newPassword, salt);
  seller.resetToken = undefined;
  seller.expireToken = undefined;
  return await seller.save();
};

exports.DeleteById = async(query) =>{
  return await UserSchema.findOneAndDelete(query)
  .select("-__v -password");
}