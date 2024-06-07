const express = require("express");
const User = require("../models/user");
const router = express.Router();

// const authenicateService = require("../middleware/test");

// router.get("/meetfood", authenicateService, async (req, res) => {
//   res.send("<h2>Hello from Express.js server!</h2>");
// });

router.get("/meetfood", async (req, res) => {
  const user = new User({
    userName: "qmei",
    firstName: "Mei",
  });
  await user.save();
  res.send("<h2>Data Insert Succeed!</h2>");
});

module.exports = router;
