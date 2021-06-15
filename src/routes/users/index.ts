import express, { Request } from "express"
import q2m from "query-to-mongo"
import createError from "http-errors"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

import UserModel from "./schema"
import { User } from "./types"
import { authenticate } from "../../auth/tools"
import { JWTAuthMiddleware } from "../../auth/"

const usersRouter = express.Router()

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const cloudinaryStorage = new CloudinaryStorage({ cloudinary })

const upload = multer({ storage: cloudinaryStorage }).single("profilePic")

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await UserModel.countDocuments(query.criteria)

    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
    res.send({ links: query.links("/users", total), total, users })
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req: Request<{}, {}, Pick<User, "email" | "password">>, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})
usersRouter.put("/me", JWTAuthMiddleware, upload, async (req: Request<{}, {}, User>, res, next) => {
  try {
    const updates = Object.keys(req.body) as (keyof User)[]

    updates.forEach(update => ((req.user as any)![update] = req.body[update]))

    req.user!.profilePic = req.file.path
    await req.user!.save()
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})
usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user!.deleteOne()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req: Request<{}, {}, Pick<User, "email" | "password">>, res, next) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await authenticate(user)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      res.send()
    } else {
      next(createError(400, "Wrong credentials"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter