import { body } from "express-validator";

export const validateBudget = [
  body("name").notEmpty().withMessage("Budget name is required"),
  body("totalAmount")
    .isFloat({ gt: 0 })
    .withMessage("Total amount must be greater than 0"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  body("endDate").isISO8601().withMessage("End date must be a valid ISO date"),
];

export const validateExpense = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),
  body("budgetId").isInt().withMessage("Budget ID must be an integer"),
];

export const validateIncome = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  body("source").notEmpty().withMessage("Source is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),
  body("budgetId").isInt().withMessage("Budget ID must be an integer"),
];
