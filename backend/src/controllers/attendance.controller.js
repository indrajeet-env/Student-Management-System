const Attendance = require("../models/attendance.model");
const userModel = require("../models/user.model");

// Admin marks attendance
async function markAttendance(req, res) {
  const { studentId, status } = req.body;

  try {
    if (!studentId || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const studentExists = await userModel.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const alreadyMarked = await Attendance.findOne({
      student: studentId,
      date: { $gte: start, $lte: end }
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked for today"
      });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: new Date(), // keep real timestamp
      status,
      markedBy: req.user._id,
    });

    res.status(201).json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Student views own attendance
async function getMyAttendance(req, res) {
  try {
    const records = await Attendance.find({
      student: req.user._id,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMonthlyAttendance(req, res){
  const userId = req.user._id;

  const { month, year } = req.query;

  try{
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const records = await Attendance.find({
      student: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === "present").length;

    res.json({
      totalDays,
      presentDays,
      percentage: ((presentDays / totalDays) * 100).toFixed(2)
    });

  } catch(error){
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  markAttendance,
  getMyAttendance,
  getMonthlyAttendance
};