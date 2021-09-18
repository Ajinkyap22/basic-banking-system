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
});

TransactionSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// TransactionSchema.virtual("sender", {
//   ref: "User",
//   localField: "user",
//   foreignField: "_id",
// });
// TransactionSchema.virtual("receiver", {
//   ref: "User",
//   localField: "user",
//   foreignField: "_id",
// });

module.exports = mongoose.model("Transaction", TransactionSchema);
