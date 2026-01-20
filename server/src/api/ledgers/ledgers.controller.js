const model = require('./ledgers.model');

const getAll = (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);

  if (isNaN(limit)) {
    return res.status(400).end();
  }

  res.status(200).json(model.findAll(limit));
};

const getById = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const ledger = model.findById(id);

  if (!ledger) {
    return res.status(404).end();
  }

  res.status(200).json(ledger);
};

const create = (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).end();
  }

  const newLedger = model.create({ name, description });

  res.status(201).json(newLedger);
};

const update = (req, res) => {
  const { name, description } = req.body;
  const id = parseInt(req.params.id, 10);

  if (!name && !description) {
    return res.status(400).end();
  }

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const updatedLedger = model.update(id, { name, description });

  if (!updatedLedger) {
    return res.status(404).end();
  }

  res.status(200).json(updatedLedger);
};

const remove = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).end();
  }

  const deleted = model.remove(id);

  if (!deleted) {
    return res.status(404).end();
  }

  res.status(204).end();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
