import mongoose, { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

import { User, UserModel } from "../routes/users/types";

const { Schema, model } = mongoose;

const UserSchema = new Schema<User, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    firstName: String,
    backgroundImgRoom: String,
    socketId: String,
    lastName: String,
    profilePic: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const newUser = this;

  const plainPW = newUser.password;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isOk = await bcrypt.compare(password, user.password);
    if (isOk) return user;
    else return null;
  } else return null;
};

export default model<User, UserModel>("User", UserSchema);
