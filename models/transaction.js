const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const TransactionSchema = new Schema({
  user: {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, default: "" },
});

TransactionSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Transaction", TransactionSchema);
