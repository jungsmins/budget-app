const AppError = require('../../errors/AppError');
const Ledger = require('./ledgers.schema');
const mongoose = require('mongoose');

const findAll = async (limit) => {
  const ledgers = await Ledger.find()
    .sort({ createdAt: -1 })
    .limit(limit);

  return ledgers;
};

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const ledger = await Ledger.findById(id);

  return ledger;
};

const create = async ({ name, description }) => {
  const newLedger = await Ledger.create({ name, description });
  return newLedger.toJSON();
};

const update = async (id, { name, description }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;

  const updateLedger = await Ledger.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updateLedger;
};

const remove = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID format', 400);
  }

  const result = await Ledger.findByIdAndDelete(id);

  return result !== null;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
