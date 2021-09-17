const Transaction = require("../models/transaction");

exports.transactions_get = function (req, res, next) {
  try {
    const transactions = Transaction.find()
      .sort([["date", "descending"]])
      .populate("user");

    res.render("transactions", { title: "Transaction History", transactions });
  } catch (err) {
    return next(err);
  }
};
