import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as userController from "./user.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-role.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtentions.js";

const router = Router();

router.post(
  "/signUp",
  validationMiddleware(userValidation.signUpSchema),
  expressAsyncHandler(userController.signUp)
);

router.post(
  "/signIn",
  validationMiddleware(userValidation.signInSchema),
  expressAsyncHandler(userController.signIn)
);

router.put(
  "/updateUser",
  auth(systemRoles.USER),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  validationMiddleware(userValidation.updateUserSchema),
  expressAsyncHandler(userController.updateUser)
);

router.delete(
  "/deleteUser",
  auth(systemRoles.USER),
  validationMiddleware(userValidation.deleteUserSchema),
  expressAsyncHandler(userController.deleteUser)
);

router.get(
  "/getUserData",
  auth(systemRoles.USER),
  validationMiddleware(userValidation.getUserDataSchema),
  expressAsyncHandler(userController.getUserData)
);

router.post(
  "/uploadImageUser",
  auth(systemRoles.USER),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  validationMiddleware(userValidation.getUserDataSchema),
  expressAsyncHandler(userController.uploadImageUser)
);

router.get(
  "/forgetPassword",
  validationMiddleware(userValidation.forgetPasswordSchema),
  expressAsyncHandler(userController.forgetPassword)
);

router.patch(
  "/resetPasswordAfterOTP",
  validationMiddleware(userValidation.resetPasswordAfterOTPSchema),
  expressAsyncHandler(userController.resetPasswordAfterOTP)
);

router.patch(
  "/updatePassword",
  auth(systemRoles.USER),
  validationMiddleware(userValidation.updatePasswordSchema),
  expressAsyncHandler(userController.updatePassword)
);

router.get(
  "/getAllUsers",
  auth(systemRoles.ADMIN),
  expressAsyncHandler(userController.getAllUsers)
);

export default router;
