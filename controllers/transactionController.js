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

    // check if sender === receiver
    if (req.body.sender === req.body.receiver) {
      const error = new Error("Sender cannot be the same as receiver");
      return res.render("transfer", { title: "Transfer Money", error, users });
    }

    function getUser(id) {
      let promise = User.findById(id).exec();
      return promise;
    }

    const sender = await getUser(req.body.sender).then((res) => {
      return res;
    });

    const receiver = await getUser(req.body.receiver).then((res) => {
      return res;
    });

    //  check if balance is enough
    if (sender.balance < req.body.amount) {
      const error = new Error("Insufficient Balance");
      return res.render("transfer", { title: "Transfer Money", error, users });
    }

    let amount = +req.body.amount;

    // update balance of both
    User.findByIdAndUpdate(
      sender._id,
      {
        $set: { balance: sender.balance - amount },
      },
      {},
      function (err) {
        if (err) return next(err);
      }
    );

    User.findByIdAndUpdate(
      receiver._id,
      {
        $set: { balance: receiver.balance + amount },
      },
      {},
      function (err) {
        if (err) return next(err);
      }
    );

    // create new transaction
    const transaction = new Transaction({
      user: {
        sender: req.body.sender,
        receiver: req.body.receiver,
      },
      amount: amount,
      date: Date.now(),
    });

    await transaction.save((err) => {
      if (err) return next(err);

      res.redirect("/transactions");
    });
  } catch (err) {
    return next(err);
  }
};
