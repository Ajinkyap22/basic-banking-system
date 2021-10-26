const User = require("../models/user");

exports.customers_get = async function (req, res, next) {
  try {
    const users = await User.find().sort([["name", "ascending"]]);

    res.render("customers", { title: "Our Customers", users });
  } catch (err) {
    return next(err);
  }
};
