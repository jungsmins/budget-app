const model = require('./transactions.model');
const ledgersModel = require('../ledgers/ledgers.model');

const getAll = (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const { category, month } = req.query;
  const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (month && !monthRegex.test(month)) {
    return res.status(400).end();
  }

  let ledgerTransactions = model.findByLedgerId(ledgerId);

  if (!ledgerTransactions) {
    return res.status(404).end();
  }

  if (category) {
    ledgerTransactions = ledgerTransactions.filter(
      (transaction) => transaction.category === category,
    );
  }

  if (month) {
    ledgerTransactions = ledgerTransactions.filter((transaction) =>
      transaction.date.startsWith(month),
    );
  }

  res.status(200).json(ledgerTransactions);
};

const create = (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const { type, amount, category, description, date } = req.body;

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (!type || !amount || !category || !description || !date) {
    return res.status(400).end();
  }

  const newTransaction = model.create(ledgerId, {
    type,
    amount,
    category,
    description,
    date,
  });

  if (!newTransaction) {
    return res.status(404).end();
  }

  res.status(201).json(newTransaction);
};

const update = (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const id = parseInt(req.params.id, 10);
  const { type, amount, category, description, date } = req.body;

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (isNaN(id)) {
    return res.status(400).end();
  }

  if (!type || !amount || !category || !description || !date) {
    return res.status(400).end();
  }

  const ledger = ledgersModel.findById(ledgerId);

  if (!ledger) {
    return res.status(404).end();
  }

  const transaction = model.findById(id);

  if (!transaction) {
    return res.status(404).end();
  }

  if (transaction.ledgerId !== ledgerId) {
    return res.status(404).end();
  }

  const updatedTransaction = model.update(id, {
    type,
    amount,
    category,
    description,
    date,
  });

  res.status(200).json(updatedTransaction);
};

const remove = (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const id = parseInt(req.params.id, 10);

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const ledger = ledgersModel.findById(ledgerId);

  if (!ledger) {
    return res.status(404).end();
  }

  const transaction = model.findById(id);

  if (!transaction) {
    return res.status(404).end();
  }

  if (transaction.ledgerId !== ledgerId) {
    return res.status(404).end();
  }

  const deleted = model.remove(id);

  if (!deleted) {
    return res.status(404).end();
  }

  res.status(204).end();
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
