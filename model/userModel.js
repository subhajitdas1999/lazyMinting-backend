import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Provide a correct email"],
  },
  role: {
    type: String,
    enum: ["user", "minter"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password should be same",
    },
    select: false,
  },
  userCreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

//pre middleware runs between getting the and saving the data to the database
//for some reason if we use arrow func then the this keyword will be undefined
userSchema.pre("save", async function (next) {
  //for new document created
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 5); //5 is the CPU cost
    this.passwordConfirm = undefined;
  }
});

//instance method on user collection

userSchema.methods.checkPassword = async function (
  candidateInputPassword,
  userSavedPassword
) {
  return await bcrypt.compare(candidateInputPassword, userSavedPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
