const AppError = require('../../errors/AppError');
const Transactions = require('./transactions.schema');
const mongoose = require('mongoose');

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const transaction = await Transactions.findById(id);

  return transaction;
};

const findByLedgerId = async (ledgerId, filters = {}) => {
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    throw new AppError('Invalid ID format', 400);
  }

  const query = { ledgerId };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.month) {
    query.date = { $regex: `^${filters.month}` };
  }

  const transactions = await Transactions.find(query).sort({ date: -1 });

  return transactions;
};

const create = async (
  ledgerId,
  { type, amount, category, description, date },
) => {
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    return null;
  }

  const newTransaction = await Transactions.create({
    ledgerId,
    type,
    amount,
    category,
    description,
    date,
  });

  return newTransaction.toJSON();
};

const update = async (id, { type, amount, category, description, date }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const updateData = {};
  if (type !== undefined) updateData.type = type;
  if (amount !== undefined) updateData.amount = amount;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (date !== undefined) updateData.date = date;

  const updateTransaction = await Transactions.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updateTransaction;
};

const remove = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const result = await Transactions.findByIdAndDelete(id);

  return result !== null;
};

module.exports = {
  findById,
  findByLedgerId,
  create,
  update,
  remove,
};
