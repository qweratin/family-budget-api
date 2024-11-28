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
