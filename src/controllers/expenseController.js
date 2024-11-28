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
