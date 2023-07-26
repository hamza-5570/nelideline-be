const UserServices = require("../services/userServices");
const ProductServices = require("../services/productServices");
// const GiftServices = require("../services/giftServices");
const BuyerHtmlGenerator = require("../utilities/buyerEmail");
const { bcryptHash, comparePassword } = require("../utilities/passwordUtils");
const messageUtil = require("../utilities/message");
const mailer = require("../utilities/emailSender");
const jwtHelper = require("../utilities/jwt");
const {
  successResponse,
  existAlreadyResponse,
  notFoundResponse,
  authorizationErrorResponse,
  serverErrorResponse,
} = require("../utilities/response");

class Users {
  // custom singup function
  UserSignUp = async (req, res) => {
    let errors = [];

    const { email, password, first_name, last_name } = req.body;
    if (!email) {
      errors.push("Email");
    }

    if (!password) {
      errors.push("Password");
    }

    if (!first_name) {
      errors.push("First Name");
    }

    if (!last_name) {
      errors.push("Last Name");
    }

    if (errors.length > 0) {
      errors = errors.join(", ");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
        success: false,
        data: {},
      });
    }
    try {
      let user = await UserServices.getUser({ email });
      if (user) {
        existAlreadyResponse(res, messageUtil.emailAlreadyExist);
      } else {
        user = await UserServices.createUser({
          ...req.body,
        });
        user.password = await bcryptHash(password);
        await user.save();

        console.log(user)
        successResponse(res, messageUtil.userRegister, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UserLogin = async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email) {
      errors.push("Email");
    }

    if (!password) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      errors = errors.join(", ");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
        data: {},
      });
    }
    let user;
    try {
      user = await UserServices.getUser({ email });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          authorizationErrorResponse(res, messageUtil.incorrectPassword);
        }
        const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.userLogin, user, token);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email) {
      errors.push("Email");
    }

    if (!password) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      errors = errors.join(", ");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
        data: {},
      });
    }
    let user;
    try {
      user = await UserServices.getUser({ email });
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else if (user.role != "admin" && user.role != "driver") {
        authorizationErrorResponse(res, messageUtil.authorizationError);
      } else {
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          authorizationErrorResponse(res, messageUtil.incorrectPassword);
        }
        const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.userLogin, user, token);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UserAuth = async (req, res) => {
    const { email, password } = req.body;
    let user;
    try {
      user = await UserServices.getUser({ _id: req.userId });
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

  GetAllUsers = async (req, res) => {
    let users;
    try {
      users = await UserServices.getAllUser();
      if (!users) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.ok, users);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  GetUserById = async (req, res) => {
    const { customerId } = req.params;
    console.log("customerId", customerId);
    let user;
    try {
      user = await UserServices.getUserDetails({ _id: customerId });
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

  UpdateUser = async (req, res) => {
    const { customerId } = req.params;
    console.log("customerId", customerId);
    let user;
    try {
      user = await UserServices.updateUserById(
        { _id: customerId },
        { ...req.body }
      );
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.updateSuccess, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UpdateUserImage = async (req, res) => {
    let user;
    try {
      user = await UserServices.updateUserById(
        { _id: req.userId },
        { user_image_url: req.files[0].location }
      );
      if (!user) {
        notFoundResponse(res, messageUtil.NotFound);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.updateSuccess, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  UpdateUserPassword = async (req, res) => {
    const { newPassword, password } = req.body;
    let errors = [];

    if (!newPassword) {
      errors.push("New password");
    }

    if (!password) {
      errors.push("Password");
    }

    if (errors.length > 0) {
      // errors = errors.join(" ,");
      return res.send({
        message: `Please insert: ${errors}`,
        status: "400",
        success: false,
        data: {},
      });
    }

    try {
      let user = await UserServices.getUser({
        _id: req.userId,
      });

      if (user) {
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
          return authorizationErrorResponse(
            res,
            messageUtil.incorrectOldPassword
          );
        }

        user.password = await bcryptHash(newPassword);

        let updatedUser = await UserServices.updateUserById(
          { _id: req.userId },
          { ...user }
        );

        return successResponse(res, messageUtil.updateSuccess, updatedUser);
      } else {
        return notFoundResponse(res, messageUtil.NotFound);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  // GetResetPasswordToken = async (req, res) => {
  //   const { email } = req.body;
  //   try {
  //     /************find user**********/
  //     let user = await UserServices.generateResetToken({
  //       email,
  //     });
  //     if (!user) {
  //       return notFoundResponse(res, messageUtil.NotFound);
  //     }

  //     /************Email**********/
  //     var to = email;
  //     var from = process.env.EMAIL_ADDRESS;
  //     let sellerEmail = BuyerHtmlGenerator.forgetPasswordEmailGenerator({
  //       firstName: user.first_name,
  //       lastName: user.last_name,
  //       resetToken: user.resetToken,
  //     });
  //     mailer.emailSender(to, from, sellerEmail.subject, sellerEmail.html);

  //     /**********************/

  //     return res.status(200).send({
  //       status: "200",
  //       message: "Mail has been sent ",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).send({
  //       message: "Server Error",
  //       status: "500",
  //     });
  //   }
  // };

  AuthenticateToken = async (req, res) => {
    const { token } = req.body;
    let user;
    try {
      user = await UserServices.getUser({
        resetToken: token,
        expireToken: { $gt: Date.now() },
      });
      if (!user) {
        notFoundResponse(res, messageUtil.tokenInvalid);
      } else {
        // const token = jwtHelper.issue({ id: user._id });
        successResponse(res, messageUtil.ok, user);
      }
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  // ResetPassword = async (req, res) => {
  //   const { email, password } = req.body;
  //   let errors = [];

  //   if (!email) {
  //     errors.push("Email");
  //   }

  //   if (!password) {
  //     errors.push("Password");
  //   }

  //   if (errors.length > 0) {
  //     // errors = errors.join(" ,");
  //     return res.send({
  //       message: `Please insert: ${errors}`,
  //       status: "400",
  //       success: false,
  //       data: {},
  //     });
  //   }

  //   try {
  //     let user = await UserServices.getUser({
  //       email: email,
  //     });

  //     if (user) {
  //       user.password = await bcryptHash(password);

  //       let updatedUser = await UserServices.updateUserById(
  //         { email: email },
  //         { ...user }
  //       );

  //       return successResponse(res, messageUtil.updateSuccess, updatedUser);
  //     } else {
  //       return notFoundResponse(res, messageUtil.NotFound);
  //     }
  //   } catch (err) {
  //     return serverErrorResponse(res, err);
  //   }
  // };

  addToCart = async (req, res) => {
    let { productId } = req.params;

    try {
      let product = await ProductServices.getProduct({
        _id: productId,
      });

      if (!product) return notFoundResponse(res, messageUtil.NotFound);

      if (product.quantity < 1)
        return notFoundResponse(res, messageUtil.outOfStock);

      let user = await UserServices.updateUserById(
        { _id: req.userId },
        { $push: { user_cart: { product_id: productId, qty: req.body.qty } } }
      );

      return successResponse(res, messageUtil.addToCart, user);
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  removeToCart = async (req, res) => {
    let { productId } = req.params;

    try {
      let product = await ProductServices.getProduct({
        _id: productId,
      });

      if (!product) return notFoundResponse(res, messageUtil.NotFound);

      if (product.quantity < 1)
        return notFoundResponse(res, messageUtil.outOfStock);

      let user = await UserServices.updateUserById(
        { _id: req.userId },
        { $pull: { user_cart: { product_id: productId, qty: req.body.qty } } }
      );

      return successResponse(res, messageUtil.removeFromCart, user);
    } catch (err) {
      serverErrorResponse(res, err);
    }
  };

  DeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        let user = await UserServices.DeleteById( 
            {_id: id} );
        if(!user){
            notFoundResponse(res, messageUtil.NotFound);
        }else{
            successResponse(res, messageUtil.ok, user);
        }
        
    } catch (error) {
        serverErrorResponse(res, error);
    }
};

}

module.exports = new Users();
