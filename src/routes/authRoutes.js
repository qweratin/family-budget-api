import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validationMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  registerUser,
);

router.post("/login", validateLogin, handleValidationErrors, loginUser);

export default router;
