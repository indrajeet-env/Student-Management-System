const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/** Student/admin i.e (User) register Controller */
console.log("REGISTER HIT");
async function userRegisterController(req, res){
  const { name, email, password, branch, year, rollNumber } = req.body;

  try{
    // Validate required fields
    if(!name || !email || !password){
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = await userModel.create({
      name,
      email,
      password,
      branch,
      year,
      rollNumber
    });
  
    const token = jwt.sign({ 
      userId: user._id, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    

    res.status(201).json({
      user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        rollNumber: user.rollNumber
      },
      token 
      });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error while registering user" });
  }
}


async function userLoginController(req, res){
  const{ email, password } = req.body;

  try{
    // Validate required fields
    if(!email || !password){
      return res.status(400).json({ message: "Email and password are required" });
    }
    // Check if user exists
    const user = await userModel.findOne({ email }).select("+password");
    if(!user){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ 
      userId: user._id, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      user:{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, token 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error while logging in user" });
  }
}


module.exports = {
  userRegisterController,
  userLoginController
};