const mockData = require('../../data/mockData');
const ledgers = require('../ledgers/ledgers.model');

let transactions = mockData.transactions;

const findById = (id) => {
  return transactions.find((transaction) => transaction.id === id);
};

const findByLedgerId = (ledgerId) => {
  const ledger = ledgers.findById(ledgerId);

  if (!ledger) {
    return null;
  }

  return transactions.filter((transaction) => transaction.ledgerId === ledgerId);
};

const create = (ledgerId, { type, amount, category, description, date }) => {
  const ledger = ledgers.findById(ledgerId);

  if (!ledger) {
    return null;
  }

  const newTransaction = {
    id: transactions.length + 1,
    ledgerId,
    type,
    amount,
    category,
    description,
    date,
  };

  transactions = [newTransaction, ...transactions];

  return newTransaction;
};

const update = (id, { type, amount, category, description, date }) => {
  const selectedTransaction = findById(id);

  if (!selectedTransaction) {
    return null;
  }

  const updatedTransaction = {
    ...selectedTransaction,
    type,
    amount,
    category,
    description,
    date,
  };

  transactions = transactions.map((transaction) => {
    if (transaction.id === id) {
      return updatedTransaction;
    }

    return transaction;
  });

  return updatedTransaction;
};

const remove = (id) => {
  const transaction = findById(id);

  if (!transaction) {
    return false;
  }

  transactions = transactions.filter((transaction) => transaction.id !== id);

  return true;
};

module.exports = {
  findById,
  findByLedgerId,
  create,
  update,
  remove,
};
