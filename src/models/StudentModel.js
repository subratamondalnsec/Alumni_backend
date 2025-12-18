// Import the Mongoose library
const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    firstName: {
      minLength: 2,
      maxLength: 20,
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      minLength: 2,
      maxLength: 20,
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      default: "Student",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
}, { timestamps: true }
)

module.exports = mongoose.model("Student", studentSchema)