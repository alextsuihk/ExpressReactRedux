const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const inventoryMemorySchema = new Schema({
  id: Number,
  parent: Schema.Types.ObjectId, // in case it is split from previous offer
  seller: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['open', 'cancelled', 'bidding', 'expired', 'dealed'],
    default: 'open',
  },
  vendor: String,
  part: String,
  qty: Number, // -1 for continous supply
  curr: String, // currency
  ask: Number, // ask price
  askHistory: {
    date: { type: Date, default: Date.now },
    price: Number,
  },
  loc: {
    type: String,
    enum: ['hk', 'cn', 'tw', 'other'],
    default: 'hk',
  },
  bids: [Schema.Types.Mixed], // { buyerId, { s/b, msg, price, qty, CreatedAt } }
  final: {
    type: Schema.Types.Mixed, // { buyerId, qty, price, CreatedAt}
    default: null,
  },
  child: Schema.Types.ObjectId, // for partial qty bid, spawn a new child with reminaing qty
  createdAt: { type: Date, default: Date.now },
}, { collection: 'inventoryMemory' });

module.exports = mongoose.model('Inventory', inventoryMemorySchema);
