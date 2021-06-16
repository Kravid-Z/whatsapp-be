import mongoose from "mongoose";

import { Room, RoomModel } from "../routes/users/types";

const { Schema, model } = mongoose;

const RoomSchema = new Schema<Room, RoomModel>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        type: new mongoose.Schema(
          {
            senderId: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            message: { type: String, required: true },
          },
          { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

export default model<Room, RoomModel>("Room", RoomSchema);
