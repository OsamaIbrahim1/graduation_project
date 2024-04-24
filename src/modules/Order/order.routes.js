import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-role.js";
import * as validators from "./order.validation.js";
import * as orderController from "./order.controller.js";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post(
  "/addOrder",
  auth([systemRoles.USER]),
  validationMiddleware(validators.addOrderSchema),
  expressAsyncHandler(orderController.addOrder)
);

router.post(
  "/convertCartToOrder",
  auth([systemRoles.USER]),
  validationMiddleware(validators.convertCartToOrderSchema),
  expressAsyncHandler(orderController.convertCartToOrder)
);

router.get("/getAllOrder", expressAsyncHandler(orderController.getAllOrder));

router.get(
  "/getOrderById",
  auth([systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN]),
  validationMiddleware(validators.getOrderByIdSchema),
  expressAsyncHandler(orderController.getOrderById)
);

export default router;