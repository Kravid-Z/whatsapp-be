import { Document, Model, ObjectId } from "mongoose"

export interface User {
  email: string
  password: string
  firstName?: string
  lastName?: string
  socketId: string
  profilePic?: string
  userRooms: string[]

}
export interface Room {
 users: string[]
}

export interface messages{
  senderId: string 
  recieverId: string
  message: string
}
export interface messagesDocument extends messages, Document {}

export interface messagesModel extends Model<messagesDocument> {}

export interface RoomDocument extends Room, Document {}

export interface RoomModel extends Model<RoomDocument> {}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}
