const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'ledgers',
  },
);

ledgerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ledgerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    return ret;
  },
});

ledgerSchema.pre('findOneAndDelete', async function (next) {
  const ledgerId = this.getQuery()._id;
  const Transaction = mongoose.model('Transaction');

  await Transaction.deleteMany({ ledgerId });

  next();
});

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;
