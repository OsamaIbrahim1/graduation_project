import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as favoriteController from "./favorites.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-role.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./favorites.validation-Schema.js";

const router = Router();

router.post(
  "/addToFavorites",
  auth(systemRoles.USER),
  validationMiddleware(validators.addToFavoritesSchema),
  expressAsyncHandler(favoriteController.addToFavorites)
);

router.get(
  "/getAllFavorites",
  auth(systemRoles.USER),
  validationMiddleware(validators.getAllFavoritesSchema),
  expressAsyncHandler(favoriteController.getAllFavorites)
);

export default router;
