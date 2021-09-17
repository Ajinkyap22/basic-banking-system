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

// GET for profile
module.exports = router.get("/profile/:id", userController.profile_get);

// GET for transactions

// GET for transfer money

// POST for transfer money