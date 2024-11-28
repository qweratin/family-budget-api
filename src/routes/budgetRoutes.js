import express from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBudget } from "../utils/validationSchemas";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateBudget, createBudget);
router.get("/", getBudgets);
router.put("/:id", validateBudget, updateBudget);
router.delete("/:id", deleteBudget);

export default router;
