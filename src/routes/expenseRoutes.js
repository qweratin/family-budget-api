import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateExpense } from "../utils/validationSchemas";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateExpense, createExpense);
router.get("/", getExpenses);
router.put("/:id", validateExpense, updateExpense);
router.delete("/:id", deleteExpense);

export default router;
