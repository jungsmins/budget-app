const model = require('./transactions.model');
const ledgersModel = require('../ledgers/ledgers.model');

const getAll = async (req, res, next) => {
  try {
    const ledgerId = req.params.ledgerId;
    const { category, month } = req.query;
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (month && !monthRegex.test(month)) {
      return res.status(400).end();
    }

    let ledgerTransactions = await model.findByLedgerId(ledgerId, {
      category,
      month,
    });

    if (!ledgerTransactions) {
      return res.status(404).end();
    }

    res.status(200).json(ledgerTransactions);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const ledgerId = req.params.ledgerId;
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !description || !date) {
      return res.status(400).end();
    }

    const newTransaction = await model.create(ledgerId, {
      type,
      amount,
      category,
      description,
      date,
    });

    if (!newTransaction) {
      return res.status(404).end();
    }

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const ledgerId = req.params.ledgerId;
    const id = req.params.id;
    const { type, amount, category, description, date } = req.body;

    if (!type && !amount && !category && !description && !date) {
      return res.status(400).end();
    }

    const transaction = await model.findById(id);

    if (!transaction) {
      return res.status(404).end();
    }

    if (transaction.ledgerId.toString() !== ledgerId) {
      return res.status(404).end();
    }

    const updatedTransaction = await model.update(id, {
      type,
      amount,
      category,
      description,
      date,
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const ledgerId = req.params.ledgerId;
    const id = req.params.id;

    const transaction = await model.findById(id);

    if (!transaction) {
      return res.status(404).end();
    }

    if (transaction.ledgerId.toString() !== ledgerId) {
      return res.status(404).end();
    }

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
  create,
  update,
  remove,
};
