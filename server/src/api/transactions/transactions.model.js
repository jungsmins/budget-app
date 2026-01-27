const mockData = require('../../data/mockData');
const ledgers = require('../ledgers/ledgers.model');

let transactions = mockData.transactions;

const findById = (id) => {
  const transaction = transactions.find((transaction) => {
    return transaction.id === id;
  });

  if (!transaction) {
    return false;
  }

  return transaction;
};

const findByLedgerId = (ledgerId) => {
  const ledger = ledgers.findById(ledgerId);

  if (!ledger) {
    return false;
  }

  return transactions.filter((transaction) => {
    return transaction.ledgerId === ledgerId;
  });
};

const findOfCategory = (ledgerId, category) => {
  const ledgerTransactions = findByLedgerId(ledgerId);
  const selectedTransactions = ledgerTransactions.filter((transaction) => {
    return transaction.category === category;
  });

  return selectedTransactions;
};

const findOfMonth = (ledgerId, month) => {
  const ledgerTransactions = findByLedgerId(ledgerId);
  const selectedTransactions = ledgerTransactions.filter((transactions) => {
    return transactions.date.startsWith(month);
  });

  return selectedTransactions;
};

const create = (ledgerId, type, amount, category, description, date) => {
  const ledger = ledgers.findById(ledgerId);

  if (!ledger) {
    return false;
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

const update = (id, type, amount, category, description, date) => {
  const transaction = findById(id);

  const updateTransaction = {
    ...transaction,
    type,
    amount,
    category,
    description,
    date,
  };

  transactions = transactions.map((transaction) => {
    if (transaction.id === id) {
      return updateTransaction;
    }

    return transaction;
  });

  return updateTransaction;
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
  findOfCategory,
  findOfMonth,
  create,
  update,
  remove,
};
