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
