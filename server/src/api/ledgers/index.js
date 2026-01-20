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

router.post('/', (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).end();
  }

  const newLedger = {
    id: ledgers.length + 1,
    name,
    description,
  };

  ledgers = [newLedger, ...ledgers];
  res.status(201).json(newLedger);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const ledger = ledgers.find((ledger) => ledger.id === id);

  if (!ledger) {
    return res.status(404).end();
  }

  res.status(200).json(ledger);
});

router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  const id = parseInt(req.params.id, 10);

  if (!name && !description) {
    return res.status(400).end();
  }

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const selectedLedger = ledgers.find((ledger) => ledger.id === id);

  if (!selectedLedger) {
    return res.status(404).end();
  }

  const updateLedger = {
    id: selectedLedger.id,
    name: name || selectedLedger.name,
    description: description || selectedLedger.description,
  };

  ledgers = ledgers.map((ledger) => {
    if (ledger.id === id) {
      return updateLedger;
    }
    return ledger;
  });

  res.status(200).json(updateLedger);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const ledger = ledgers.find((ledger) => ledger.id === id);

  if (!ledger) {
    return res.status(404).end();
  }

  ledgers = ledgers.filter((ledger) => ledger.id !== id);

  res.status(204).end();
});

module.exports = router;
