const router = require('express').Router();
const ledgersRoutes = require('./ledgers.routes');
const transactionsRouter = require('../transactions');

router.use('/', ledgersRoutes);

router.use('/:ledgerId/transactions', transactionsRouter);

module.exports = router;
