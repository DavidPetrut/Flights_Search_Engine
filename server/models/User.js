const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  emailVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  bio: { type: String, default: "" },
  status: { type: String, default: "" },
  favorites: { type: String, default: "" },
  vision: { type: String, default: "" },
  contact: { type: String, default: "" },
  faq: [{
    question: { type: String },
    answer: { type: String }
  }],
  isStudent: { type: Boolean, default: false },
  studentOfferUsed: { type: Boolean, default: false },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);

