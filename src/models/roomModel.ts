import mongoose from "mongoose"

import { Room, RoomModel } from "../routes/users/types"

const { Schema, model } = mongoose

const ModelSchema = new Schema<Room, RoomModel>(
  {
    users:  [{ type: Schema.Types.ObjectId, ref: "rooms" }] 
  },
  { timestamps: true }
)


export default model<Room, RoomModel>("Room", ModelSchema)