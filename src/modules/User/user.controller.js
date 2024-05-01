import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../../DB/models/user.model.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateOTP from "../../utils/generateOTP.js";
import { APIFeature } from "../../utils/api-features.js";
import sendEmailService from "../../services/send-email.service.js";

//===================================== Sign Up =====================================//
/**
 * * destructure the required data from the request body
 * * check if the user already exists in the database using the email
 * * hash password and check password is hashed
 * * create new document in the database
 * * response success
 */
export const signUp = async (req, res, next) => {
  // * destructure the required data from the request body
  const { name, email, password, phoneNumber, Birthday } = req.body;

  // * check if the user already exists in the database using the email
  const isEmailDuplicated = await User.findOne({ email });
  if (isEmailDuplicated) {
    return next(
      new Error(`Email already exists, Please try another email`, {
        cause: 409,
      })
    );
  }

  // * hash password and check password is hashed
  const hashedPassword = bcryptjs.hashSync(password, +process.env.SALT_ROUNDS);
  if (!hashedPassword) {
    return next(new Error(`password not hashed`, { cause: 404 }));
  }

  // * create new document in the database
  const objectUser = {
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    Birthday,
  };
  const newUser = await User.create(objectUser);
  req.savedDocuments = { model: User, _id: newUser._id };
  if (!newUser) return next(new Error(`user not created`, { cause: 404 }));

  // * response success
  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
};

//============================= Sign In =============================//
/**
 * * destructure data from body
 * * check if email already exists
 * * check if password matched
 * * generate token for user
 * * response successfully
 */
export const signIn = async (req, res, next) => {
  // * destructure data from body
  const { email, password } = req.body;

  // * check if email already exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error(`Invalid login credentials`, { cause: 404 }));
  }

  // * check if password matched
  const passwordMatched = bcryptjs.compareSync(password, user.password);
  if (!passwordMatched) {
    return next(
      new Error(`Password mismatch, Please try again`, { cause: 404 })
    );
  }

  // * generate token for user
  const token = jwt.sign(
    { email, id: user._id },
    process.env.JWT_SECRET_LOGIN,
    { expiresIn: "1d" }
  );

  // * response successfully
  res.status(200).json({
    success: true,
    message: "logged in successfully",
    data: { token },
  });
};

//============================= update user =============================//
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
export const updateUser = async (req, res, next) => {
  // * destructure the required data from the request body and request authUser
  const { name, email, phoneNumber, Birthday, oldPublicId } = req.body;
  const { _id } = req.authUser;

  // * check is user already exists
  const user = await User.findById(_id);
  if (!user) {
    return next(`User not found`, { cause: 404 });
  }

  // * if user wonts to update email
  if (email) {
    if (user.email === email) {
      return next(
        new Error("this email is the same old email", { cause: 400 })
      );
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return next(
        new Error("Email already exists,please enter another one.", {
          cause: 400,
        })
      );
    }
    user.email = email;
  }
  console.log(user);
  // * update image
  if (oldPublicId) {
    if (!req.file) {
      return next(new Error(`please enter new image`, { cause: 400 }));
    }
    const newPublicId = oldPublicId.split(`${user.folderId}/`)[1];

    console.log(newPublicId);
    // * update image and use same public id  and folder id
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Users/${user.folderId}`,
        public_id: newPublicId,
      });
    user.Image.secure_url = secure_url;
  }

  // * update name phone number Birthday
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (Birthday) user.Birthday = Birthday;

  // * save chenges
  await user.save();

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "updated successfully", data: user });
};

//============================= delete user =============================//
/**
 * * destructure the user data from request headers
 * * find the user and delete them from the database
 * * delete image user
 * * response successfully
 */
export const deleteUser = async (req, res, next) => {
  // * destructure the user data from request headers
  const { _id } = req.authUser;

  // * find the user and delete them from the database
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // * delete image user
  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${process.env.MAIN_FOLDER}/Users/${user.folderId}`
  );
  await cloudinaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/Users/${user.folderId}`
  );

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "Successfully deleted", data: user });
};

//============================= get data user =============================//
/**
 * * destructure _id from authUser
 * * get user data
 * * response successfully
 */
export const getUserData = async (req, res, next) => {
  // * destructure _id from authUser
  const { _id } = req.authUser;

  // * get user data
  const user = await User.findById(_id).select("-password -_id");
  if (!user) return next(new Error("user not found", { cause: 404 }));

  // * response successfully
  res.status(200).json({ message: "user data", data: user });
};

//============================= upload image user =============================//
/**
 * * destructure data from authUser
 * * check if user already exists
 * * upload image
 * * save changes
 * * response successfully
 */
export const uploadImageUser = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  // * check if user already exists
  const user = await User.findById(_id);

  // * upload image
  if (!req.file) {
    return next(`upload one image please.`, { cause: 400 });
  }

  const folderId = generateUniqueString(4);
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Users/${folderId}`,
    });

  user.folderId = folderId;
  user.Image = { secure_url, public_id };

  // * save changes
  await user.save();

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "Successfully uploaded", data: user });
};

//==================================  Forget password =========================//
/**
 * * destructure data from body
 * * get user by email
 * * generate reset password code
 * * hash code
 * * generate token to reset password
 * * send reset password email to the user and check if sent
 * * saved changes
 * * response successfully
 */
export const forgetPassword = async (req, res, next) => {
  // * destructure data from body
  const { email } = req.body;

  // * get user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next("user not found", { cause: 404 });
  }

  // * generate reset password code
  const code = generateUniqueString(6);

  // * hash code
  const hashCode = bcryptjs.hashSync(code, +process.env.SALT_ROUNDS);

  // * generate token to reset password
  const token = jwt.sign(
    {
      email,
      forgetCode: hashCode,
    },
    process.env.RESET_Token,
    { expiresIn: "1h" }
  );

  const resetPasswordLink = `${req.protocol}://${req.headers.host}/user/resetPassword/${token}`;

  // * send reset password email to the user and check if sent
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Reset Password",
    message: `
    <h2>Please click on this link to reset password</h2>
    <a href="${resetPasswordLink}">Verify Email</a>`,
  });
  if (!isEmailSent) {
    return next(`Email is not sent,please try again later`, { cause: 409 });
  }

  // * saved changes
  user.forgetCode = hashCode;
  await user.save();

  // * response successfully
  res.status(200).json({ message: `code sent successfully`, user });
};

//==================================  reset password =========================//
/**
 * * destructure data from params
 * * decoded token
 * * get user by email and code
 * * destructure data from body
 * * hash new password
 * * saved changes
 * * response successfully
 */
export const resetPassword = async (req, res, next) => {
  // * destructure data from params
  const { token } = req.params;

  // * decoded token
  const decoded = jwt.verify(token, process.env.RESET_TOKEN);

  // * get user by email and code
  const user = await User.findOne({
    email: decoded?.email,
    forgetCode: decoded?.forgetCode,
  });
  if (!user) {
    return next("you already reset your password", { cause: 404 });
  }

  // * destructure data from body
  const { newPassword } = req.body;

  // * hash new password
  const newPasswordHash = bcryptjs.hashSync(
    newPassword,
    +process.env.SALT_ROUNDS
  );

  // * saved changes
  user.password = newPasswordHash;
  user.forgetCode = null;
  await user.save();

  // * response successfully
  res
    .status(200)
    .json({ message: `password changed successfully`, data: user });
};

//=============================== update password User =================================//
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
export const updatePassword = async (req, res, next) => {
  // * destructure date from body and authUser
  const { _id } = req.authUser;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // * check user
  const user = await User.findById(_id);
  if (!user) return next(`User not found`, { cause: 404 });

  // * check if password matched
  const passwordMatched = bcryptjs.compareSync(oldPassword, user.password);
  if (!passwordMatched) {
    return next(
      new Error(`Password mismatch, Please try again`, { cause: 404 })
    );
  }

  // * check if new password is the same old password
  if (oldPassword === newPassword) {
    return next(`new Password the same old password`, { cause: 400 });
  }

  // * check if new password match with confirm password
  if (newPassword !== confirmPassword) {
    return next(`Confirm password mismatch, Please try again`, { cause: 400 });
  }

  // * hash password and check password is hashed
  const hashedPassword = bcryptjs.hashSync(
    newPassword,
    +process.env.SALT_ROUNDS
  );
  if (!hashedPassword) {
    return next(new Error(`password not hashed`, { cause: 404 }));
  }

  // * change password
  user.password = hashedPassword;
  await user.save();

  // * response successfully
  res.status(200).json({
    success: true,
    message: "Password was successfully changed",
    data: user,
  });
};

//=============================== get All Users =================================//
/**
 * * destructure data from query
 * * get all users
 * * response successfully
 */
export const getAllUsers = async (req, res, next) => {
  // * destructure data from query
  const { page, size, sort, ...search } = req.query;

  // * get all users
  const features = new APIFeature(req.query, User.find()).pagination({
    page,
    size,
  });
  // .sort();

  const users = await features.mongooseQuery;

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "get all users", data: users });
};
