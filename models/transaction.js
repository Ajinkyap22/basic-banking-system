const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

TransactionSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Transaction", TransactionSchema);
