const router = require('express').Router({ mergeParams: true });
const transactionsRoutes = require('./transactions.routes');

router.use('/', transactionsRoutes);

module.exports = router;
