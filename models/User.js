const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;
const saltRounds = 10;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String
});

// Pre save hook
UserSchema.pre("save", next => {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

// Unique Validator Plugin for mongoose
UserSchema.plugin(uniqueValidator);

UserSchema.methods.validatePassword = password => {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
