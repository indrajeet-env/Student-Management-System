const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const {markAttendance, getMyAttendance, getMonthlyAttendance} = require("../controllers/attendance.controller");


// Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), markAttendance);


// Logged-in users
router.get("/me", authMiddleware, getMyAttendance);
router.get("/monthly", authMiddleware, getMonthlyAttendance
);

module.exports = router;