const model = require('./ledgers.model');

const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);

    if (isNaN(limit)) {
      return res.status(400).end();
    }

    const ledgers = await model.findAll(limit);

    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;

    const ledger = await model.findById(id);

    if (!ledger) {
      return res.status(404).end();
    }

    res.status(200).json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).end();
    }

    const newLedger = await model.create({ name, description });

    res.status(201).json(newLedger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    if (!name && !description) {
      return res.status(400).end();
    }

    const updatedLedger = await model.update(id, { name, description });

    if (!updatedLedger) {
      return res.status(404).end();
    }

    res.status(200).json(updatedLedger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await model.remove(id);

    if (!deleted) {
      return res.status(404).end();
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
