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

  const ledgerTransactions = transactions.filter((transaction) => {
    if (transaction.ledgerId === ledgerId) {
      return transaction;
    }
  });

  res.status(200).json(ledgerTransactions);
});

module.exports = router;
