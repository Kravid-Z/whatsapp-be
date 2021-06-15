import { Document, Model } from "mongoose"

export interface User {
  email: string
  password: string
  firstName?: string
  lastName?: string
  profilePic?: string
  githubURL?: string
  portfolioURL?: string
  capstoneURL?: string
  linkedinURL?: string
  youtubeURL?: string
  availableToRelocation?: boolean
  located?: string
  desiredPosition?: string
  approved?: boolean
  hired?: boolean
  track: string
  oneLiner?: string
}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}
