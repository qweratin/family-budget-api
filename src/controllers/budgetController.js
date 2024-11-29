import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const createBudget = asyncHandler(async (req, res) => {
  const { name, totalAmount, startDate, endDate } = req.body;
  const { id: userId } = req.user;

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
  const { id: userId } = req.user;

  const budgets = await prisma.budget.findMany({
    where: { userId },
  });

  res.json(budgets);
});

export const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, totalAmount, startDate, endDate } = req.body;
  const { id: userId } = req.user;

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
