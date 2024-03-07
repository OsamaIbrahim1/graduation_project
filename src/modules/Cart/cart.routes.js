import { Router } from "express";
import * as cartController from "./cart.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-role.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./cart.validation-Schema.js";

const router = Router();

router.post(
  "/addProductToCart",
  auth(systemRoles.USER),
  validationMiddleware(validators.addProductToCartSchema),
  expressAsyncHandler(cartController.addProductToCart)
);

router.put(
  "/removeFromCart/:productId",
  auth(systemRoles.USER),
  validationMiddleware(validators.removeFromCartSchema),
  expressAsyncHandler(cartController.removeProductFromCart)
);

export default router;
