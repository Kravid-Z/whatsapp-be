import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import listEndpoints from "express-list-endpoints"
import cookieParser from "cookie-parser"
import { createServer } from "http"
import { Server } from "socket.io"
import { Message, OpenChatRequest, User } from "../typings/app";
dotenv.config()


const PORT = process.env.PORT || 5000

// ********************* MIDDLEWARES ****************************


const app = express();
const server = createServer(app);
const io = new Server(server, { allowEIO3: true });


app.use(cors())
app.use(express.json())
app.use(cookieParser())

let onlineUsers: User[] = []

io.on("connection", socket => {
    console.log(socket.id)

    socket.join("main-room")
    console.log(socket.rooms)

    socket.on("setUsername", ({ username }: User) => {
        console.log("here")
        onlineUsers =
            onlineUsers
                .filter(user => user.username !== username)
                .concat({
                    username,
                    id: socket.id
                })
        console.log(onlineUsers)

        socket.emit("loggedin")

        socket.broadcast.emit("newConnection")

    })

    socket.on("sendmessage", (message: Message) => {
        // io.sockets.in("main-room").emit("message", message)
        socket.to("main-room").emit("message", message)

        // saveMessageToDb(message)
    })

    socket.on("openChatWith", ({ recipientId, sender }: OpenChatRequest) => {
        console.log("here")
        socket.join(recipientId)
        socket.to(recipientId).emit("message", { sender, text: "Hello, I'd like to chat with you" })
    })

    socket.on("disconnect", () => {
        console.log("Disconnected socket with id " + socket.id)

        onlineUsers = onlineUsers.filter(user => user.id !== socket.id)

        socket.broadcast.emit("newConnection")

    })

});

// ********************* ROUTES  **********************************

//server.use("/users", usersRoutes)

// ********************* ERROR HANDLERS ***************************

mongoose.connect(process.env.MONGO_CONNECTION!, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on("connected", () => {
  console.log("Mongo connection done")

  server.listen(PORT, () => {
    console.table(listEndpoints(app));
    console.log(
      "\u001b[" +
        35 +
        "m" +
        "Server is running on port: " +
        PORT +
        "\u001b[0m"
    );
  })
})