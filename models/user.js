const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  // Hash key generated internally, primarily for passport
  username: { type: String, required: true, unique: true },
  avartar: String,
  nickname: { type: String, trim: true },
  enabled: {
    type: Boolean,
    default: true,
  },
  company: [Schema.Types.Mixed], // joinedAt: Date, name: String
  tier: [Schema.Types.Mixed],
  wechat: String,
  email: {
    type: String, required: true, unique: true, trim: true,
  },
  mobile: {
    type: String, required: true, unique: true, trim: true,
  },
  offers: [{ type: Schema.Types.ObjectId, ref: 'OfferXX' }],
  bids: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
  passwordReset: { type: String, select: false },
  passwordResetExpiredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
