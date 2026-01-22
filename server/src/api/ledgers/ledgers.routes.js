const router = require('express').Router();
const controller = require('./ledgers.controller');
const transactions = require('../transactions');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.use('/:ledgerId/transactions', transactions);

module.exports = router;
