// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require("async");
const User = require("./models/user");
const Transaction = require("./models/transaction");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const users = [];
const transactions = [];

function userCreate(name, email, balance, cb) {
  const userDetail = { name, email, balance };

  const user = new User(userDetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New User: " + user);
    users.push(user);
    cb(null, user);
  });
}

function transactionCreate(user, amount, date, cb) {
  const transactionDetail = { user, amount, date };

  const transaction = new Transaction(transactionDetail);

  transaction.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Transaction: " + transaction);
    transactions.push(transaction);
    cb(null, transaction);
  });
}

function createUsers(cb) {
  async.series(
    [
      (callback) => userCreate("John", "john@gmail.com", 8000, callback),
      (callback) => userCreate("Jane", "jane@yahoo.com", 3000, callback),
      (callback) => userCreate("Kevin", "kevin@gmail.com", 1500, callback),
      (callback) => userCreate("Michael", "michael22@gmai.com", 750, callback),
      (callback) => userCreate("Emma", "Emma19@gmail.com", 4000, callback),
    ],
    cb
  );
}

function createTransactions(cb) {
  async.series(
    [
      (callback) =>
        transactionCreate(
          { sender: users[0], receiver: users[1] },
          1000,
          Date.now(),
          callback
        ),
      (callback) =>
        transactionCreate(
          { sender: users[2], receiver: users[3] },
          500,
          Date.now(),
          callback
        ),
      (callback) =>
        transactionCreate(
          { sender: users[4], receiver: users[0] },
          2500,
          Date.now(),
          callback
        ),
      (callback) =>
        transactionCreate(
          { sender: users[1], receiver: users[3] },
          200,
          Date.now(),
          callback
        ),
      (callback) =>
        transactionCreate(
          { sender: users[2], receiver: users[4] },
          1250,
          Date.now(),
          callback
        ),
    ],
    cb
  );
}

async.series([createUsers, createTransactions], (err, results) => {
  if (err) {
    console.log("FINAL ERR: " + err);
  } else {
    console.log("All done");
  }
  // All done, disconnect from database
  mongoose.connection.close();
});
