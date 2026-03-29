const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    branch: String,
    year: Number,
    rollNumber: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function(){
  if(!this.isModified('password')){
    return; // this means that if password is not modified, then we will not hash the password, and we will just move to the next middleware, because if password is not modified, then it means that user is updating some other field like name or email, toh us case me hume password ko hash karne ki jarurat nahi hai, because password is not modified
  }
  const hash = await bcrypt.hash(this.password, 10); // this means that when password is changed by the user we are hashing the password with a salt of 10 rounds, and then we are storing the hashed password in the password field of the user document
  this.password = hash; // this means that we are replacing the plain text password with the hashed password
  return;
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password); // this means that when user is trying to login, we will compare the plain text password with the hashed password stored in the database, and if they match, then we will return true, otherwise we will return false
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;