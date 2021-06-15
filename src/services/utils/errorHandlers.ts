import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors"

type ErrorHandlerFunction = (err: HttpError, req: Request, res: Response, next: NextFunction) => void

export const notFoundErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err.message || "Not found!")
  }
  next(err)
}

export const unauthorizedHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send(err.message || "Not found!")
  }
  next(err)
}

export const badRequestHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err.message || "Not found!")
  }
  next(err)
}
export const forbiddenHandler: ErrorHandlerFunction = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send(err.message || "Not found!")
  }
  next(err)
}

export const catchAllErrorHandler: ErrorHandlerFunction = (err, req, res, next) => {
  res.status(500).send("Generic Server Error")
}