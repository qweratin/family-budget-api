**server.js**

```javascript
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**utils/validationSchemas.js**

```javascript
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
```

**controllers/authController.js**

```javascript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
```

**controllers/budgetController.js**

```javascript
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createBudget = asyncHandler(async (req, res) => {
  const { name, totalAmount, startDate, endDate } = req.body;
  const { userId } = req.user;

  const budget = await prisma.budget.create({
    data: {
      name,
      totalAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId,
    },
  });

  res.status(201).json(budget);
});

export const getBudgets = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const budgets = await prisma.budget.findMany({
    where: { userId },
  });

  res.json(budgets);
});

export const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, totalAmount, startDate, endDate } = req.body;
  const { userId } = req.user;

  const budget = await prisma.budget.update({
    where: { id: Number(id) },
    data: {
      name,
      totalAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId,
    },
  });

  res.json(budget);
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.budget.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
});
```

**expenseController.js**

```javascript
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, date, budgetId, description } = req.body;
  const { userId } = req.user;

  const expense = await prisma.expense.create({
    data: {
      amount,
      category,
      date: new Date(date),
      userId,
      budgetId,
      description,
    },
  });

  res.status(201).json(expense);
});

export const getExpenses = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const expenses = await prisma.expense.findMany({
    where: { userId },
  });

  res.json(expenses);
});

export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, budgetId, description } = req.body;

  const expense = await prisma.expense.update({
    where: { id: Number(id) },
    data: {
      amount,
      category,
      date: new Date(date),
      budgetId,
      description,
    },
  });

  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.expense.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
});
```

**incomeController.js**

```javascript
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createIncome = asyncHandler(async (req, res) => {
  const { amount, source, date, budgetId, description } = req.body;
  const { userId } = req.user;

  const income = await prisma.income.create({
    data: {
      amount,
      source,
      date: new Date(date),
      userId,
      budgetId,
      description,
    },
  });

  res.status(201).json(income);
});

export const getIncomes = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const incomes = await prisma.income.findMany({
    where: { userId },
  });

  res.json(incomes);
});

export const updateIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, source, date, budgetId, description } = req.body;

  const income = await prisma.income.update({
    where: { id: Number(id) },
    data: {
      amount,
      source,
      date: new Date(date),
      budgetId,
      description,
    },
  });

  res.json(income);
});

export const deleteIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.income.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
});
```

**reportController.js**

```javascript
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const generateMonthlyReport = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { month, year } = req.query;

  // Monthly Income Report
  const monthlyIncomes = await prisma.income.findMany({
    where: {
      userId,
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  });

  // Monthly Expense Report
  const monthlyExpenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
  });

  // Calculate totals
  const totalIncome = monthlyIncomes.reduce(
    (sum, income) => sum + income.amount,
    0,
  );

  const totalExpenses = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const netBalance = totalIncome - totalExpenses;

  res.json({
    month,
    year,
    totalIncome,
    totalExpenses,
    netBalance,
    incomes: monthlyIncomes,
    expenses: monthlyExpenses,
  });
});

export const generateCategoryExpenseReport = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { year } = req.query;

  const categoryExpenses = await prisma.$queryRaw`
    SELECT category, 
           SUM(amount) as total_amount, 
           COUNT(*) as transaction_count
    FROM "Expense"
    WHERE "userId" = ${userId} 
    AND EXTRACT(YEAR FROM date) = ${year}
    GROUP BY category
    ORDER BY total_amount DESC
  `;

  res.json(categoryExpenses);
});

export const generateAnnualFinancialOverview = asyncHandler(
  async (req, res) => {
    const { userId } = req.user;
    const { year } = req.query;

    // Monthly Income Breakdown
    const monthlyIncomes = await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM date) as month,
      SUM(amount) as total_income
    FROM "Income"
    WHERE "userId" = ${userId} 
    AND EXTRACT(YEAR FROM date) = ${year}
    GROUP BY EXTRACT(MONTH FROM date)
    ORDER BY month
  `;

    // Monthly Expense Breakdown
    const monthlyExpenses = await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM date) as month,
      SUM(amount) as total_expense
    FROM "Expense"
    WHERE "userId" = ${userId} 
    AND EXTRACT(YEAR FROM date) = ${year}
    GROUP BY EXTRACT(MONTH FROM date)
    ORDER BY month
  `;

    // Annual Totals
    const annualIncome = await prisma.income.aggregate({
      where: {
        userId,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      _sum: { amount: true },
    });

    const annualExpenses = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      _sum: { amount: true },
    });

    res.json({
      year,
      monthlyIncomes,
      monthlyExpenses,
      annualIncome: annualIncome._sum.amount || 0,
      annualExpenses: annualExpenses._sum.amount || 0,
      netAnnualBalance:
        (annualIncome._sum.amount || 0) - (annualExpenses._sum.amount || 0),
    });
  },
);

export const generateBudgetComparisonReport = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { year } = req.query;

  // Budgets for the year
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      startDate: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    include: {
      _sum: {
        select: {
          expenses: { select: { amount: true } },
          incomes: { select: { amount: true } },
        },
      },
    },
  });

  // Transform budget data
  const budgetComparison = budgets.map((budget) => ({
    name: budget.name,
    totalBudgetAmount: budget.totalAmount,
    totalExpenses: budget._sum.expenses?.[0]?.amount || 0,
    totalIncomes: budget._sum.incomes?.[0]?.amount || 0,
    budgetUtilization:
      ((budget._sum.expenses?.[0]?.amount || 0) / budget.totalAmount) * 100,
  }));

  res.json({
    year,
    budgetComparison,
  });
});
```

**middleware/authMiddleware.js**

```javascript
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  }
});
```

**middleware/errorMiddleware.js**

```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
```

**middleware/validationMiddleware.js**

```javascript
import { body, validationResult, query } from "express-validator";

export const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate report parameters
export const validateReportParams = (requiredParams) => {
  return requiredParams.map((param) =>
    query(param)
      .notEmpty()
      .withMessage(`${param} is required`)
      .isInt({ min: 1 })
      .withMessage(`${param} must be a positive integer`),
  );
};

// Extended validation for report generation
export const validateReportGeneration = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

**routes/authRoutes.js**

```javascript
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
```

**routes/budgetRoutes.js**

```javascript
import express from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBudget } from "../utils/validationSchemas.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateBudget, createBudget);
router.get("/", getBudgets);
router.put("/:id", validateBudget, updateBudget);
router.delete("/:id", deleteBudget);

export default router;
```

**routes/expenseRoutes.js**

```javascript
import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateExpense } from "../utils/validationSchemas.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateExpense, createExpense);
router.get("/", getExpenses);
router.put("/:id", validateExpense, updateExpense);
router.delete("/:id", deleteExpense);

export default router;
```

**routes/incomeRoutes.js**

```javascript
import express from "express";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateIncome } from "../utils/validationSchemas.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateIncome, createIncome);
router.get("/", getIncomes);
router.put("/:id", validateIncome, updateIncome);
router.delete("/:id", deleteIncome);

export default router;
```

**routes/reportRoutes.js**

```javascript
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
```

**prisma/schema.prisma**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String
  budgets   Budget[]
  incomes   Income[]
  expenses  Expense[]
  createdAt DateTime @default(now())
}

model Budget {
  id          Int       @id @default(autoincrement())
  name        String
  totalAmount Float
  startDate   DateTime
  endDate     DateTime
  user        User      @relation(fields: [userId], references: [id])
  userId      Int
  expenses    Expense[]
  incomes     Income[]
  createdAt   DateTime @default(now())
}

model Income {
  id          Int      @id @default(autoincrement())
  amount      Float
  source      String
  date        DateTime
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
  budget      Budget   @relation(fields: [budgetId], references: [id])
  budgetId    Int
  description String?
  createdAt   DateTime @default(now())
}

model Expense {
  id          Int      @id @default(autoincrement())
  amount      Float
  category    String
  date        DateTime
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
  budget      Budget   @relation(fields: [budgetId], references: [id])
  budgetId    Int
  description String?
  createdAt   DateTime @default(now())
}
```
