const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.customers_get = async function (req, res, next) {
  try {
    if (!res.locals.currentUser) res.redirect("/login");

    const users = await User.find().sort([["name", "ascending"]]);

    res.render("customers", {
      title: "Our Customers",
      users,
      user: res.locals.currentUser,
    });
  } catch (err) {
    return next(err);
  }
};

exports.signup_get = function (req, res) {
  res.render("signup", { title: "Sign Up" });
};

exports.signup_post = [
  // sanitize and validate fields
  body("name", "Name cannot be empty.").trim().isLength({ min: 3 }),
  body("email", "Email must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 }),
  body("balance", "Starting balance cannot be more than 10000.")
    .trim()
    .isLength({ max: 10000 }),
  body("password", "Password must be at least 6 characters long.")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body("confirmPassword", "Password must be at least 6 characters long.")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Cnofirmed Password must be the same as password");
      return true;
    }),
  body("secretPassword", "This is not the secret password").trim().escape(),

  // process request
  async (req, res, next) => {
    // extract errors
    const errors = validationResult(req.body);

    // re-render form if errors
    if (!errors.isEmpty()) {
      return res.render("signup", {
        title: "Sign Up",
        errors: errors.array(),
      });
    }

    try {
      // check if user already exists
      const userExists = await User.find({ email: req.body.email });
      if (userExists.length > 0) {
        return res.render("signup", {
          title: "Sign Up",
          error: "E-mail already exists",
        });
      }

      if (req.body.password !== req.body.confirmPassword) {
        return res.render("signup", {
          title: "Sign Up",
          error: "Confirmed Password must be the same as password.",
        });
      }

      // create new user
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return next(err);

        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        }).save((err, user) => {
          if (err) return next(err);

          res.redirect("/");
        });
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_get = function (req, res) {
  res.render("login", { title: "Log In" });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.logout = function (req, res) {
  req.logout();
  res.redirect("/login");
};
