"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.resetPasswordAfterOTP = exports.forgetPassword = exports.uploadImageUser = exports.getUserData = exports.deleteUser = exports.updateUser = exports.signIn = exports.signUp = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _userModel = _interopRequireDefault(require("../../../DB/models/user.model.js"));

var _generateUniqueString = _interopRequireDefault(require("../../utils/generate-Unique-String.js"));

var _cloudinary = _interopRequireDefault(require("../../utils/cloudinary.js"));

var _generateOTP = _interopRequireDefault(require("../../utils/generateOTP.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//===================================== Sign Up =====================================//

/**
 * * destructure the required data from the request body
 * * check if the user already exists in the database using the email
 * * hash password and check password is hashed
 * * create new document in the database
 * * response success
 */
var signUp = function signUp(req, res, next) {
  var _req$body, name, email, password, phoneNumber, Birthday, isEmailDuplicated, hashedPassword, objectUser, newUser;

  return regeneratorRuntime.async(function signUp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // * destructure the required data from the request body
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phoneNumber = _req$body.phoneNumber, Birthday = _req$body.Birthday; // * check if the user already exists in the database using the email

          _context.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 3:
          isEmailDuplicated = _context.sent;

          if (!isEmailDuplicated) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", next(new Error("Email already exists, Please try another email", {
            cause: 409
          })));

        case 6:
          // * hash password and check password is hashed
          hashedPassword = _bcryptjs["default"].hashSync(password, +process.env.SALT_ROUNDS);

          if (hashedPassword) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", next(new Error("password not hashed", {
            cause: 404
          })));

        case 9:
          // * create new document in the database
          objectUser = {
            name: name,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            Birthday: Birthday
          };
          _context.next = 12;
          return regeneratorRuntime.awrap(_userModel["default"].create(objectUser));

        case 12:
          newUser = _context.sent;
          req.savedDocuments = {
            model: _userModel["default"],
            _id: newUser._id
          };

          if (newUser) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", next(new Error("user not created", {
            cause: 404
          })));

        case 16:
          // * response success
          res.status(200).json({
            success: true,
            message: "User created successfully",
            data: newUser
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}; //============================= Sign In =============================//

/**
 * * destructure data from body
 * * check if email already exists
 * * check if password matched
 * * generate token for user
 * * response successfully
 */


exports.signUp = signUp;

var signIn = function signIn(req, res, next) {
  var _req$body2, email, password, user, passwordMatched, token;

  return regeneratorRuntime.async(function signIn$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // * destructure data from body
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // * check if email already exists

          _context2.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", next(new Error("Invalid login credentials", {
            cause: 404
          })));

        case 6:
          // * check if password matched
          passwordMatched = _bcryptjs["default"].compareSync(password, user.password);

          if (passwordMatched) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", next(new Error("Password mismatch, Please try again", {
            cause: 404
          })));

        case 9:
          // * generate token for user
          token = _jsonwebtoken["default"].sign({
            email: email,
            id: user._id
          }, process.env.JWT_SECRET_LOGIN, {
            expiresIn: "1d"
          }); // * response successfully

          res.status(200).json({
            success: true,
            message: "logged in successfully",
            data: {
              token: token
            }
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //============================= update user =============================//

/**
 * * destructure the required data from the request body and request authUser
 * * check is user already exists
 * * if user wonts to update email
 * * update image
 * * update image and use same public id  and folder id
 * * update name phone number Birthday
 * * save chenges
 * * response successfully
 */


exports.signIn = signIn;

var updateUser = function updateUser(req, res, next) {
  var _req$body3, name, email, phoneNumber, Birthday, oldPublicId, _id, user, checkEmail, newPublicId, _ref, secure_url, public_id;

  return regeneratorRuntime.async(function updateUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // * destructure the required data from the request body and request authUser
          _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, phoneNumber = _req$body3.phoneNumber, Birthday = _req$body3.Birthday, oldPublicId = _req$body3.oldPublicId;
          _id = req.authUser._id; // * check is user already exists

          _context3.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(_id));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", next("User not found", {
            cause: 404
          }));

        case 7:
          if (!email) {
            _context3.next = 16;
            break;
          }

          if (!(user.email === email)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", next(new Error("this email is the same old email", {
            cause: 400
          })));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 12:
          checkEmail = _context3.sent;

          if (!checkEmail) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", next(new Error("Email already exists,please enter another one.", {
            cause: 400
          })));

        case 15:
          user.email = email;

        case 16:
          console.log(user); // * update image

          if (!oldPublicId) {
            _context3.next = 28;
            break;
          }

          if (req.file) {
            _context3.next = 20;
            break;
          }

          return _context3.abrupt("return", next(new Error("please enter new image", {
            cause: 400
          })));

        case 20:
          newPublicId = oldPublicId.split("".concat(user.folderId, "/"))[1];
          console.log(newPublicId); // * update image and use same public id  and folder id

          _context3.next = 24;
          return regeneratorRuntime.awrap((0, _cloudinary["default"])().uploader.upload(req.file.path, {
            folder: "".concat(process.env.MAIN_FOLDER, "/Users/").concat(user.folderId),
            public_id: newPublicId
          }));

        case 24:
          _ref = _context3.sent;
          secure_url = _ref.secure_url;
          public_id = _ref.public_id;
          user.Image.secure_url = secure_url;

        case 28:
          // * update name phone number Birthday
          if (name) user.name = name;
          if (phoneNumber) user.phoneNumber = phoneNumber;
          if (Birthday) user.Birthday = Birthday; // * save chenges

          _context3.next = 33;
          return regeneratorRuntime.awrap(user.save());

        case 33:
          // * response successfully
          res.status(200).json({
            success: true,
            message: "updated successfully",
            data: user
          });

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //============================= delete user =============================//

/**
 * * destructure the user data from request headers
 * * find the user and delete them from the database
 * * delete image user
 * * response successfully
 */


exports.updateUser = updateUser;

var deleteUser = function deleteUser(req, res, next) {
  var _id, user;

  return regeneratorRuntime.async(function deleteUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // * destructure the user data from request headers
          _id = req.authUser._id; // * find the user and delete them from the database

          _context4.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findByIdAndDelete(_id));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", next(new Error("User not found", {
            cause: 404
          })));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap((0, _cloudinary["default"])().api.delete_resources_by_prefix("".concat(process.env.MAIN_FOLDER, "/Users/").concat(user.folderId)));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap((0, _cloudinary["default"])().api.delete_folder("".concat(process.env.MAIN_FOLDER, "/Users/").concat(user.folderId)));

        case 10:
          // * response successfully
          res.status(200).json({
            success: true,
            message: "Successfully deleted",
            data: user
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}; //============================= get data user =============================//

/**
 * * destructure _id from authUser
 * * get user data
 * * response successfully
 */


exports.deleteUser = deleteUser;

var getUserData = function getUserData(req, res, next) {
  var _id, user;

  return regeneratorRuntime.async(function getUserData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // * destructure _id from authUser
          _id = req.authUser._id; // * get user data

          _context5.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findById(_id).select("-password -_id"));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new Error("user not found", {
            cause: 404
          })));

        case 6:
          // * response successfully
          res.status(200).json({
            message: "user data",
            data: user
          });

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //============================= upload image user =============================//

/**
 * * destructure data from authUser
 * * check if user already exists
 * * upload image
 * * save changes
 * * response successfully
 */


exports.getUserData = getUserData;

var uploadImageUser = function uploadImageUser(req, res, next) {
  var _id, user, folderId, _ref2, secure_url, public_id;

  return regeneratorRuntime.async(function uploadImageUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // * destructure data from authUser
          _id = req.authUser._id; // * check if user already exists

          _context6.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findById(_id));

        case 3:
          user = _context6.sent;

          if (req.file) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", next("upload one image please.", {
            cause: 400
          }));

        case 6:
          folderId = (0, _generateUniqueString["default"])(4);
          _context6.next = 9;
          return regeneratorRuntime.awrap((0, _cloudinary["default"])().uploader.upload(req.file.path, {
            folder: "".concat(process.env.MAIN_FOLDER, "/Users/").concat(folderId)
          }));

        case 9:
          _ref2 = _context6.sent;
          secure_url = _ref2.secure_url;
          public_id = _ref2.public_id;
          user.folderId = folderId;
          user.Image = {
            secure_url: secure_url,
            public_id: public_id
          }; // * save changes

          _context6.next = 16;
          return regeneratorRuntime.awrap(user.save());

        case 16:
          // * response successfully
          res.status(200).json({
            success: true,
            message: "Successfully uploaded",
            data: user
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  });
}; //============================= forget password user =============================//

/**
 * * destructuring data from req.body
 * * check user is already exists
 * * generate OTP and time to Expire OTP
 * * update OTP in User model
 * * response successfully
 */


exports.uploadImageUser = uploadImageUser;

var forgetPassword = function forgetPassword(req, res, next) {
  var email, user, otp, otpExpiration;
  return regeneratorRuntime.async(function forgetPassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          // * destructuring data from req.body
          email = req.body.email; // * check user is already exists

          _context7.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 3:
          user = _context7.sent;

          if (user) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", next(new Error("User not found", {
            cause: 400
          })));

        case 6:
          // * generate OTP and time to Expire OTP
          otp = (0, _generateOTP["default"])();
          otpExpiration = new Date();
          otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // * update OTP in User model

          user.passwordResetOTP = {
            code: otp,
            expiresAt: otpExpiration
          };
          _context7.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          // * response successfully
          res.status(200).json({
            success: true,
            message: "User updated OTP",
            data: otp
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //=============================== Reset Password After OTP =================================//

/**
 * * destructuring data from req.body
 * * check user is already exists
 * * check OTP is match code OTP and expired OTP
 * * hash password by bcryptjs and check if not hashed
 * * update password by save method
 * * response successfully
 */


exports.forgetPassword = forgetPassword;

var resetPasswordAfterOTP = function resetPasswordAfterOTP(req, res, next) {
  var _req$body4, email, otp, newPassword, user, storedOTP, hashNewPassword;

  return regeneratorRuntime.async(function resetPasswordAfterOTP$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          // * destructuring data from req.body
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp, newPassword = _req$body4.newPassword; // * check user is already exists

          _context8.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 3:
          user = _context8.sent;

          if (user) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", next("User not found", {
            cause: 400
          }));

        case 6:
          // * check OTP is match code OTP and expired OTP
          storedOTP = user.passwordResetOTP;

          if (!(storedOTP.code !== otp || new Date() > storedOTP.expiresAt)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", next(new Error("Invalid or expired OTP", {
            cause: 401
          })));

        case 9:
          // * hash password by bcryptjs and check if not hashed
          hashNewPassword = _bcryptjs["default"].hashSync(newPassword, +process.env.SALT_ROUNDS);

          if (hashNewPassword) {
            _context8.next = 12;
            break;
          }

          return _context8.abrupt("return", next("hash password failed", {
            cause: 400
          }));

        case 12:
          // * update password by save method
          user.password = hashNewPassword;
          _context8.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          // * response successful
          res.status(200).json({
            success: true,
            message: "Password updated",
            data: user
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  });
}; //=============================== update password User =================================//

/**
 * * destructure date from body and authUser
 * * check user
 * * check if password matched
 * * check if new password is the same old password
 * * check if new password match with confirm password
 * * hash password and check password is hashed
 * * change password
 * * response successfully
 */


exports.resetPasswordAfterOTP = resetPasswordAfterOTP;

var updatePassword = function updatePassword(req, res, next) {
  var _id, _req$body5, oldPassword, newPassword, confirmPassword, user, passwordMatched, hashedPassword;

  return regeneratorRuntime.async(function updatePassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          // * destructure date from body and authUser
          _id = req.authUser._id;
          _req$body5 = req.body, oldPassword = _req$body5.oldPassword, newPassword = _req$body5.newPassword, confirmPassword = _req$body5.confirmPassword; // * check user

          _context9.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(_id));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", next("User not found", {
            cause: 404
          }));

        case 7:
          // * check if password matched
          passwordMatched = _bcryptjs["default"].compareSync(oldPassword, user.password);

          if (passwordMatched) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", next(new Error("Password mismatch, Please try again", {
            cause: 404
          })));

        case 10:
          if (!(oldPassword === newPassword)) {
            _context9.next = 12;
            break;
          }

          return _context9.abrupt("return", next("new Password the same old password", {
            cause: 400
          }));

        case 12:
          if (!(newPassword !== confirmPassword)) {
            _context9.next = 14;
            break;
          }

          return _context9.abrupt("return", next("Confirm password mismatch, Please try again", {
            cause: 400
          }));

        case 14:
          // * hash password and check password is hashed
          hashedPassword = _bcryptjs["default"].hashSync(newPassword, +process.env.SALT_ROUNDS);

          if (hashedPassword) {
            _context9.next = 17;
            break;
          }

          return _context9.abrupt("return", next(new Error("password not hashed", {
            cause: 404
          })));

        case 17:
          // * change password
          user.password = hashedPassword;
          _context9.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          // * response successfully
          res.status(200).json({
            success: true,
            message: "Password was successfully changed",
            data: user
          });

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.updatePassword = updatePassword;