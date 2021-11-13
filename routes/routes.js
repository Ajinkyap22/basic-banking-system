var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");

/* GET home page. */
router.get("/", function (req, res) {
  console.log(res.locals.currentUser);
  res.render("index", { title: "Home", user: res.locals.currentUser });
});

// GET for customers
module.exports = router.get("/customers", userController.customers_get);

// GET signup
module.exports = router.get("/signup", userController.signup_get);

// POST signup
module.exports = router.post("/signup", userController.signup_post);

// GET login
module.exports = router.get("/login", userController.login_get);

// POST login
module.exports = router.post("/login", userController.login_post);

// POST logout
module.exports = router.get("logout", userController.logout);

// GET for transactions
module.exports = router.get(
  "/transactions",
  transactionController.transactions_get
);

// GET for transfer money
module.exports = router.get("/transfer", transactionController.transfer_get);

// POST for transfer money
module.exports = router.post("/transfer", transactionController.transfer_post);
