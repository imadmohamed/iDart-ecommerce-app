// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const userSchema = new mongoose.Schema({
//           name:{
//                     type: String,
//                     required: [true, "Please enter your name"]
//           },
//           email:{
//                     type: String,
//                     required: [true, "Please enter your email"],
//                     unique: true,
//                     validate: [validator.isEmail, "Please enter a valid email address"]
//           },
//           password:{
//                     type: String,
//                     required: [true, "Please enter your password"],
//                     maxlength: [6, "Password can not exceed 6 characters"],
//                     select: false

//           },
//           avatar:{
//                     type: String,
//                     required:true
//           },
//           role:{
//                     type: String,
//                     default: "user"
//           },
//           resetPasswordToken: String,

//           resetPasswordTokenExpairy: Date,

//           createdAt:{
//                     type: Date,
//                     default: Date.now
//           }


// })

//  userSchema.pre("save", async function(next){
//     this.password = await bcrypt.hash(this.password, 10)
// })

// userSchema.methods.getJWTToken = function(){
//    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_TIME
//     })
// }

// userSchema.methods.isValidPassword = async function(enteredPassword){
//     await bcrypt.compare(enteredPassword, this.password)
    
// }

// let model = mongoose.model('User', userSchema)
// module.exports= model;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
  },
  avatar: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordTokenExpairy: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});


// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


// 🔑 Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};


// 🔁 Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
