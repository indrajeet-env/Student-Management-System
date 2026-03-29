const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require("./routes/auth.routes");
const attendanceRoutes = require("./routes/attendance.routes");


app.use("/api/auth", authRoutes);

app.use("/api/attendance", attendanceRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;