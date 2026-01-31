const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    ledgerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ledger',
      required: [true, 'LedgerId is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['income', 'expense'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'transactions',
  },
);

transactionSchema.index({ ledgerId: 1, date: -1 });

transactionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

transactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    ret.ledgerId = ret.ledgerId.toHexString();
    delete ret._id;
    return ret;
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
