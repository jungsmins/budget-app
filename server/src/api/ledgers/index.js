const router = require('express').Router();

let ledgers = [
  { id: 1, name: '첫번째 가계부', description: '나의 첫번째 가계부' },
  { id: 2, name: '두번째 가계부', description: '나의 두번째 가계부' },
  { id: 3, name: '세번째 가계부', description: '나의 세번째 가계부' },
];

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);

  if (isNaN(limit)) {
    return res.status(400).end();
  }

  res.status(200).json(ledgers.slice(0, limit));
});

module.exports = router;
