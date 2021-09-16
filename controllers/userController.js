const User = require("../models/user");

exports.customers_get = function (req, res) {
  const users = User.find().sort(["name", "ascending"]);

  res.render("customers", { title: "Customers", users });
};

exports.profile_get = function (req, res) {};
