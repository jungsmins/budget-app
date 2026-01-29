const Transactions = require('./transactions.schema');
const mongoose = require('mongoose');

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const transaction = await Transactions.findById(id).lean();

  return transaction;
};

const findByLedgerId = async (ledgerId) => {
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    return null;
  }

  const transactions = await Transactions.find({ ledgerId })
    .sort({ date: -1 })
    .lean();

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
    return null;
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
  ).lean();

  return updateTransaction;
};

const remove = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
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
