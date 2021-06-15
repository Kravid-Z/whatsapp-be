import mongoose from "mongoose"

import { messages, messagesModel } from "../routes/users/types"

const { Schema, model } = mongoose

const MessagesSchema = new Schema<messages, messagesModel>(
  {
    senderId: String,
    reciveId: String,
    message: String,
  },
  { timestamps: true }
)


export default model<messages, messagesModel>("Room", MessagesSchema)