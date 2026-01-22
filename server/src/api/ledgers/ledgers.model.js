const mockData = require('../../data/mockData');
let ledgers = mockData.ledgers;

const findAll = (limit) => {
  return ledgers.slice(0, limit);
};

const findById = (id) => {
  return ledgers.find((ledger) => ledger.id === id);
};

const create = ({ name, description }) => {
  const newLedger = {
    id: ledgers.length + 1,
    name,
    description,
  };

  ledgers = [newLedger, ...ledgers];

  return newLedger;
};

const update = (id, { name, description }) => {
  const selectedLedger = findById(id);

  if (!selectedLedger) {
    return null;
  }

  const updatedLedger = {
    id: selectedLedger.id,
    name: name || selectedLedger.name,
    description: description || selectedLedger.description,
  };

  ledgers = ledgers.map((ledger) => {
    if (ledger.id === id) {
      return updatedLedger;
    }

    return ledger;
  });

  return updatedLedger;
};

const remove = (id) => {
  const ledger = findById(id);

  if (!ledger) {
    return false;
  }

  ledgers = ledgers.filter((ledger) => ledger.id !== id);

  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
