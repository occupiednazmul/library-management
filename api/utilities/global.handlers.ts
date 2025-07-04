import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod/v4'

export const responseCodes = {
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} // http response codes

export type ControllerError = Error & {
  name?: string
  code?: number
  message?: string
}

export function globalErrorHandler(
  err: ControllerError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error({
    route: req.originalUrl,
    method: req.method,
    body: req.body || null,
    error: err
  })

  if (err.name === 'MongoServerError') {
    if ((err as any).code === 11000) {
      res.status(responseCodes.CONFLICT).json({
        success: false,
        message: `Duplicate data found!`,
        error: err.message || `Data already exists!`
      })

      return
    }

    res.status(responseCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Internal Server Error`,
      error: {
        message: `Server couldn't connect database!`
      }
    })

    return
  }

  if (err.name === 'ValidationError') {
    res.status(responseCodes.BAD_REQUEST).json({
      success: false,
      message: `Data validation failed.`,
      error: err.message
    })

    return
  }

  if (err.name === 'ZodError') {
    res.status(responseCodes.BAD_REQUEST).json({
      success: false,
      message: `Data validation failed.`,
      error: (err as ZodError).issues
    })

    return
  }

  if (err.message === responseCodes.METHOD_NOT_ALLOWED.toString()) {
    res.status(responseCodes.METHOD_NOT_ALLOWED).json({
      success: false,
      message: `Method not allowed.`,
      error: {
        code: err.message,
        message: `Method not allowed.`
      }
    })

    return
  }

  if (err.code === responseCodes.NOT_FOUND) {
    res.status(responseCodes.NOT_FOUND).json({
      success: false,
      message: err.message || `Content not found!`,
      error: {
        message: err.message || `Content not found!`
      }
    })

    return
  }

  if (err.code === responseCodes.BAD_REQUEST) {
    res.status(responseCodes.BAD_REQUEST).json({
      success: false,
      message: err.message || `BAD REQUEST`,
      error: {
        message: err.message || `BAD REQUEST`
      }
    })

    return
  }

  res.status(responseCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `Some error happened.`,
    error: err.message
  })
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(responseCodes.NOT_FOUND).json({
    success: false,
    message: `Content not found for: ${req.originalUrl}.`,
    error: {
      message: `Content not found for: ${req.originalUrl}.`
    }
  })
}
