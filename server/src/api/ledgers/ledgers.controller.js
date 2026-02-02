const model = require('./ledgers.model');

const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);

    if (isNaN(limit)) {
      return res.status(400).end();
    }

    const ledgers = await model.findAll(limit);

    res.status(200).json(ledgers);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const ledger = await model.findById(id);

    if (!ledger) {
      return res.status(404).end();
    }

    res.status(200).json(ledger);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).end();
    }

    const newLedger = await model.create({ name, description });

    res.status(201).json(newLedger);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
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
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await model.remove(id);

    if (!deleted) {
      return res.status(404).end();
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
