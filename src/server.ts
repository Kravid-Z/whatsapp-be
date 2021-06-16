import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import cookieParser from "cookie-parser";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
  forbiddenErrorHandler,
  unauthorizedErrorHandler,
} from "./services/utils/errorHandlers";
import mainRouter from "./routes";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

// ********************* MIDDLEWARES ****************************
server.use(cors());
server.use(express.json());
server.use(cookieParser());

// ********************* ROUTES  **********************************

server.use("/whatsapp", mainRouter);

// ********************* ERROR HANDLERS ***************************

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);
mongoose.connect(process.env.MONGO_CONNECTION!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongo connection done");

  server.listen(PORT, () => {
    console.table(listEndpoints(server));
    console.log("\u001b[" + 35 + "m" + "Server is running on port: " + PORT + "\u001b[0m");
  });
});
