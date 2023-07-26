const AdminJS = require("adminjs");
const AdminJSMongoose = require("@adminjs/mongoose");

AdminJS.registerAdapter(AdminJSMongoose);

const Users = require("../models/user");
const Orders = require("../models/order");
const Products = require("../models/product");
const locale = {
  translations: {
    labels: {
      // change Heading for Login
      loginWelcome: "eCommerce",
    },
    messages: {
      loginWelcome: "Welcome to eCommerce Admin panel",
    },
  },
};

const options = {
  locale,
  resources: [Users, Products, Orders],
  branding: {
    companyName: "eCommerce",
    softwareBrothers: false,
    logo: "",
  },
};

module.exports = options;
