import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as productController from "./product.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtentions.js";
import * as validators from "./product.validation-Schema.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-role.js";

const router = Router();

router.post(
  "/addProduct",
  auth(systemRoles.ADMIN),
  multerMiddleHost({ extensions: allowedExtensions.images }).array("image", 3),
  validationMiddleware(validators.addProductSchema),
  expressAsyncHandler(productController.addProduct)
);

router.put(
  "/updateProduct",
  auth(systemRoles.ADMIN),
  validationMiddleware(validators.updateProductSchema),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(productController.updateProduct)
);

router.delete(
  "/deleteProduct",
  auth(systemRoles.ADMIN),
  validationMiddleware(validators.deleteProductSchema),
  expressAsyncHandler(productController.deleteProduct)
);

router.get(
  "/getProductById",
  validationMiddleware(validators.getProductByIdSchema),
  expressAsyncHandler(productController.getProductById)
);

router.get(
  "/searchWithAnyField",
  validationMiddleware(validators.searchWithAnyFieldSchema),
  expressAsyncHandler(productController.searchWithAnyField)
);

export default router;
