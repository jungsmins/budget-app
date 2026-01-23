const router = require('express').Router({ mergeParams: true });
const mockData = require('../../data/mockData');
const ledgers = require('../ledgers/ledgers.model');

let transactions = mockData.transactions;

router.get('/', (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (!ledgers.findById(ledgerId)) {
    return res.status(404).end();
  }

  const ledgerTransactions = transactions.filter(
    (transaction) => transaction.ledgerId === ledgerId
  );

  res.status(200).json(ledgerTransactions);
});

router.post('/', (req, res) => {
  const ledgerId = parseInt(req.params.ledgerId, 10);
  const { type, amount, category, description, date } = req.body;

  if (isNaN(ledgerId)) {
    return res.status(400).end();
  }

  if (!ledgers.findById(ledgerId)) {
    return res.status(404).end();
  }

  if (!type || !amount || !category || !description || !date) {
    return res.status(400).end();
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

  transactions.push(newTransaction);

  res.status(201).json(newTransaction);
});

router.put('/:id', (req, res) => {
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

  if (!ledgers.findById(ledgerId)) {
    return res.status(404).end();
  }

  const selectedTransaction = transactions.find(
    (transaction) => transaction.id === id
  );

  if (!selectedTransaction) {
    return res.status(404).end();
  }

  if (selectedTransaction.ledgerId !== ledgerId) {
    return res.status(404).end();
  }

  const updateTransaction = {
    ...selectedTransaction,
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

  res.status(200).json(updateTransaction);
});

module.exports = router;
