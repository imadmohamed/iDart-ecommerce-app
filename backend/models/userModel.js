// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"]
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     unique: true,
//     validate: [validator.isEmail, "Please enter a valid email address"]
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter your password"],
//     minlength: [6, "Password must be at least 6 characters long"],
//     select: false
//   },
//   avatar: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     default: "user"
//   },
//   resetPasswordToken: String,
//   resetPasswordTokenExpairy: Date,

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });


// // 🔐 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });


// // 🔑 Generate JWT token
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_TIME
//   });
// };

// // 🔁 Compare entered password with hashed password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.getResetToken = function() {

//     // Generate a random token
//     const token = crypto.randomBytes(20).toString('hex')

//     // Genarate Hash and set resetPasswordToken
//     this.resetPasswordToken = create.createhash('sha256').update(token).digest('hex');

//     // Set the expiration time for the token
//     this.resetPasswordTokenExpairy = Date.now() + 30 * 60 * 1000;

//     return token;

// }

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
  resetPasswordExpire: Date,  // ✅ Corrected typo here

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

// 🔁 Generate password reset token
userSchema.methods.getResetToken = function () {
  // Generate raw token
  const token = crypto.randomBytes(20).toString('hex');

  // Hash and set resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')  // ✅ Fixed this line
    .update(token)
    .digest('hex');

  // Set expiration time (30 minutes from now)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

module.exports = mongoose.model('User', userSchema);
