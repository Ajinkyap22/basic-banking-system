const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.transactions_get = function (req, res, next) {
  try {
    Transaction.find()
      .sort([["date", "descending"]])
      .populate({
        path: "user",
        model: "User",
        populate: [
          { path: "sender", model: "User" },
          { path: "receiver", model: "User" },
        ],
      })
      .exec((err, transactions) => {
        if (err) return next(err);

        res.render("transactions", {
          title: "Transaction History",
          transactions,
        });
      });
  } catch (err) {
    return next(err);
  }
};

exports.transfer_get = async function (req, res, next) {
  try {
    const users = await User.find().sort([["name", "ascending"]]);

    res.render("transfer", { title: "Transfer Money", users });
  } catch (err) {
    return next(err);
  }
};

exports.transfer_post = async function (req, res, next) {
  try {
    const users = await User.find().sort([["name", "ascending"]]);
    const sender = User.findById(req.body.sender._id);
    const receiver = User.findById(req.body.receiver._id);

    // check if sender === receiver
    if (sender._id === receiver._id) {
      const error = new Error("Sender cannot be the same as receiver");
      res.render("transfer", { title: "Transfer Money", error, users });
    }

    //  check if balance is enough
    if (sender.balance < req.body.amount) {
      const error = new Error("Insufficient Balance");
      res.render("transfer", { title: "Transfer Money", error, users });
    }

    // update balance of both
    User.findByIdAndUpdate(
      sender._id,
      {
        $set: { balance: sender.balance - req.body.amount },
      },
      {},
      function (err) {
        if (err) return next(err);
      }
    );

    User.findByIdAndUpdate(
      receiver._id,
      {
        $set: { balance: receiver.balance + req.body.amount },
      },
      {},
      function (err) {
        if (err) return next(err);

        res.redirect("/transactions");
      }
    );
  } catch (err) {
    return next(err);
  }
};
