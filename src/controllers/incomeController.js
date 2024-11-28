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
