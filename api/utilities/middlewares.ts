import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod/v4'

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err)

  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      res.status(409).json({
        success: false,
        message: `Duplicate data found.`,
        error: err.message
      })

      return
    }

    res.status(500).json({
      success: false,
      message: `Internal Server Error`,
      error: {
        message: `Server couldn't connect database!`
      }
    })

    return
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: `Data validation failed.`,
      error: err.message
    })
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: `Data validation failed.`,
      error: (err as ZodError).issues
    })

    return
  }

  res.status(500).json({
    success: false,
    message: `Some error happened`,
    error: err.message
  })
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    success: false,
    message: `Content not found for: ${req.originalUrl}`,
    error: {
      message: `Content not found for: ${req.originalUrl}`
    }
  })
}
