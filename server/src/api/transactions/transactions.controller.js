const model = require('./transactions.model');

const getFilteredTransaction = (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const { category, month } = req.query;
  const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  let ledgerTransactions = model.findByLedgerId(ledgerId);

  if (!ledgerTransactions) {
    return res.status(404).end();
  }

  if (month && !monthRegex.test(month)) {
    return res.status(400).end();
  }

  if (category) {
    ledgerTransactions = model.findOfCategory(ledgerId, category);
  }

  if (month) {
    ledgerTransactions = model.findOfMonth(ledgerId, month);
  }

  return res.status(200).json(ledgerTransactions);
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

  const ledgerTransactions = model.findByLedgerId(ledgerId);
  const newTransaction = model.create(
    ledgerId,
    type,
    amount,
    category,
    description,
    date,
  );

  if (!ledgerTransactions) {
    return res.status(404).end();
  }

  if (!newTransaction) {
    return res.status(400).end();
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

  const ledgerTransactions = model.findByLedgerId(ledgerId);
  const transaction = model.findById(id);

  if (!ledgerTransactions) {
    return res.status(404).end();
  }

  if (!transaction) {
    return res.status(404).end();
  }

  if (transaction.ledgerId !== ledgerId) {
    return res.status(404).end();
  }

  const updateTransaction = model.update(
    id,
    type,
    amount,
    category,
    description,
    date,
  );

  res.status(200).json(updateTransaction);
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

  const ledgerTransctions = model.findByLedgerId(ledgerId);
  const transaction = model.findById(id);

  if (!ledgerTransctions) {
    return res.status(404).end();
  }

  if (!transaction) {
    return res.status(404).end();
  }

  if (transaction.ledgerId !== ledgerId) {
    return res.status(404).end();
  }

  model.remove(id);

  res.status(204).end();
};

module.exports = {
  getFilteredTransaction,
  create,
  update,
  remove,
};
