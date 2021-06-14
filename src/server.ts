import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import listEndpoints from "express-list-endpoints"
import cookieParser from "cookie-parser"

import usersRoutes from "../src/services/users"

import { badRequestHandler } from "./errorHandlers"

dotenv.config()

const server = express()

const port = process.env.PORT || 3001

// ********************* MIDDLEWARES ****************************

server.use(cors())
server.use(express.json())
server.use(cookieParser())

// ********************* ROUTES  **********************************

server.use("/users", usersRoutes)

// ********************* ERROR HANDLERS ***************************

mongoose.connect(process.env.MONGO_CONNECTION!, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on("connected", () => {
  console.log("Mongo connection done")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server up and running on port: ", port)
  })
})