const express = require("express");
const router = express.Router();

const {getAllStudents,  getStudentAttendance, getStudentMonthly} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Routes
router.get("/students", authMiddleware, roleMiddleware("admin"), getAllStudents);

router.get("/attendance/:studentId", authMiddleware, roleMiddleware("admin"), getStudentAttendance);

router.get("/attendance/:studentId/monthly", authMiddleware, roleMiddleware("admin"), getStudentMonthly);

module.exports = router;