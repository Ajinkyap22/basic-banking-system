var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

// GET for customers
module.exports = router.get("/customers", userController.customers_get);

// GET for transactions
module.exports = router.get(
  "/transactions",
  transactionController.transactions_get
);

// GET for transfer money
module.exports = router.get("/transfer", transactionController.transfer_get);

// POST for transfer money
module.exports = router.post("/transfer", transactionController.transfer_post);
