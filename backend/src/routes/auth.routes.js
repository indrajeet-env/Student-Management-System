const express = require("express");
const router = express.Router();

const {userRegisterController, userLoginController,} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", userRegisterController);
router.post("/login", userLoginController);

router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;