import express from "express";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateIncome } from "../utils/validationSchemas";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateIncome, createIncome);
router.get("/", getIncomes);
router.put("/:id", validateIncome, updateIncome);
router.delete("/:id", deleteIncome);

export default router;
