const router = require('express').Router({ mergeParams: true });
const controller = require('./transactions.controller');

router.get('/', controller.getFilteredTransaction);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
