// ROUTES for ROOMS AUthMiddeware

// get whatsapp/me/rooms

// get whatsapp/me/rooms/:roomId

// post whatsapp/me/rooms

// delete whatsapp/me/rooms/:roomId

// MESSAGES

// get whatsapp/me/rooms/:roomId/message ????

// post whatsapp/me/rooms/:roomId/message

import express, { Request, Response, NextFunction } from "express";
import q2m from "query-to-mongo";
import createError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import UserModel from "../../models/userModel";
import RoomModel from "../../models/roomModel";
import { Room } from "../users/types";
import { authenticate } from "../../services/Auth/tools";
import { JWTAuthMiddleware } from "../../services/Auth/";
import userModel from "../../models/userModel";
dotenv.config();

const roomsRouter = express.Router();

roomsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    //create a new room
    try {
      //check if the room is already created
      const checkIfTheRoomExists = await RoomModel.find({
        users: { $all: [req.body.users[0], req.body.users[1]] },
      });

      if (checkIfTheRoomExists.length > 0) {
        res.send({
          message: "room already exists",
          roomId: checkIfTheRoomExists[0]._id,
        });
      } else {
        const newRoom = new RoomModel(req.body);
        const { _id } = await newRoom.save();

        req.body.users.map(async (user: string) => {
          console.log(user);

          const updatedUser = await UserModel.findByIdAndUpdate(
            user,
            {
              $addToSet: { userRooms: _id },
            },
            { new: true, runValidators: true }
          );
          console.log(updatedUser);
        });

        res.send({ message: "new room created", roomId: _id });
      }
      //if there is no existing room
    } catch (error) {
      console.log(error);

      next(error);
    }
  }
);

roomsRouter.get(
  "/me/:userID",
  async (req: Request, res: Response, next: NextFunction) => {
    //getting all the rooms of the current user
    console.log("user ids");
    try {
      const userRooms = await UserModel.findById(req.params.userID, {
        userRooms: 1,
        _id: 1,
      }).populate("userRooms");
      res.send(userRooms);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

roomsRouter.post(
  "/:roomID",
  async (req: Request, res: Response, next: NextFunction) => {
    //post a new message to the room
    try {
      const updated = await RoomModel.findByIdAndUpdate(
        req.params.roomID,
        {
          $push: {
            messages: req.body,
          },
        },
        { runValidators: true, new: true }
      );
      res.send(updated);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default roomsRouter;
