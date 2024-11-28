import express from "express";
import {
  generateMonthlyReport,
  generateCategoryExpenseReport,
  generateAnnualFinancialOverview,
  generateBudgetComparisonReport,
} from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateReportParams } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Middleware to ensure user authentication for all routes
router.use(authMiddleware);

// Monthly Financial Report
router.get(
  "/monthly",
  validateReportParams(["month", "year"]),
  generateMonthlyReport,
);

// Category Expense Report
router.get(
  "/category-expenses",
  validateReportParams(["year"]),
  generateCategoryExpenseReport,
);

// Annual Financial Overview
router.get(
  "/annual-overview",
  validateReportParams(["year"]),
  generateAnnualFinancialOverview,
);

// Budget Comparison Report
router.get(
  "/budget-comparison",
  validateReportParams(["year"]),
  generateBudgetComparisonReport,
);

export default router;
