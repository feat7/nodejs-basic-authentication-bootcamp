const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;
const saltRounds = 10;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    select: true
  },
  password: String
});

// Pre save hook
// eslint-disable-next-line func-names
UserSchema.pre("save", function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

// Unique Validator Plugin for mongoose
UserSchema.plugin(uniqueValidator);

// eslint-disable-next-line func-names
UserSchema.methods.validatePassword = function(password) {
  if (!password) return false;
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
