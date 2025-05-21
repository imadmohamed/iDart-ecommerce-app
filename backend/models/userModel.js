const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
          name:{
                    type: String,
                    required: [true, "Please enter your name"]
          },
          email:{
                    type: String,
                    required: [true, "Please enter your email"],
                    unique: true,
                    validate: [validator.isEmail, "Please enter a valid email address"]
          },
          password:{
                    type: String,
                    required: [true, "Please enter your password"],
                    maxlenght: [6, "Password can not exceed 6 characters"],

          },
          avatar:{
                    type: String,
                    required:true
          },
          role:{
                    type: String,
                    default: "user"
          },
          resetPasswordToken: String,

          resetPasswordTokenExpairy: Date,
          
          createdAt:{
                    type: Date,
                    default: Date.now
          }


})