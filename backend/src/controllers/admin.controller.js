const userModel = require("../models/user.model");
const Attendance = require("../models/attendance.model");

// 1. Get all students
async function getAllStudents(req, res) {
  try {
    const students = await userModel.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 2. Get attendance of a student
async function getStudentAttendance(req, res) {
  const { studentId } = req.params;

  try {
    const records = await Attendance.find({ student: studentId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 3. Monthly stats of student
async function getStudentMonthly(req, res) {
  const { studentId } = req.params;
  const { month, year } = req.query;

  try {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const records = await Attendance.find({
      student: studentId,
      date: { $gte: start, $lte: end }
    });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === "present").length;

    res.json({
      totalDays,
      presentDays,
      percentage:
        totalDays === 0
          ? "0.00"
          : ((presentDays / totalDays) * 100).toFixed(2)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllStudents,
  getStudentAttendance,
  getStudentMonthly
};