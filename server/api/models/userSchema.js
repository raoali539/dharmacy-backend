// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['user', 'vendor'],
//     default: 'user'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
  
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    // trim: true,
    // validate: {
    //   validator: async function (v) {
    //     const user = await this.constructor.findOne({ userName: v });
    //     return !user;
    //   },
    //   message: (props) =>
    //     `${props.value} already exists try with different User Name!`,
    // },
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // validate: {
    //   validator: function (v) {
    //     return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid email address!`,
    // },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  sub: {
    type: String,
    required: false,
    trim: true,
  },
  otp : {
    type : Number ,
    required: false,
    trim :true,
  },
  profilePicture: {
    url: { type: String, required: false, default: "" },
    // key: { type: String, required: false, default: "" },
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  totalSales: {
    type: Number,
    default: 0,
    required: false,
  },
  totalRating: {
    type: Number,
    default: 5,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    required: true,
    default: true,
  },
  createdBy: {
    type: String,
    required: true,
    default: true,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
  },
  isActive: {
    type: Boolean,
  },
  accountStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
