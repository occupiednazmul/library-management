// MODULE IMPORTS
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'
import { connect } from 'mongoose'
import { ZodError } from 'zod/v4'

// ROUTER IMPORTS
import { bookRouter, booksRouter } from './routes/books.routes.js'
import { borrowRouter, userRouter } from './routes/borrow.routes.js'

// VARIABLES
const port = process.env.PORT || 3000
const dbURI = process.env.MONGODB_URI || ''
const app = express()
export const responseCodes = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

// LOGGER
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log(`Request made to: ${req.url}`)
  next()
})

// STATIC ROUTE
const thisDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicFolder = path.resolve(thisDirectory, '..', 'public')

app.use(express.static(publicFolder))

// ROUTES
app.use(express.json()) // accepts all body as JSON
app.use('/api/book', bookRouter)
app.use('/api/books', booksRouter)
app.use('/api/borrow', borrowRouter)
app.use('/api/user', userRouter)

// GLOBAL ERROR HANDLER
app.use(function (
  err: Error,
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
        message: `Duplicate data found.`,
        error: err.message
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

  res.status(responseCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `Some error happened.`,
    error: err.message
  })
})

// NOT FOUND ROUTE
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(responseCodes.NOT_FOUND).json({
    success: false,
    message: `Content not found for: ${req.originalUrl}.`,
    error: {
      message: `Content not found for: ${req.originalUrl}.`
    }
  })
})

// CONNECT TO DATABASE
await (async function () {
  try {
    await connect(dbURI /*, { autoIndex: false }*/)

    console.log(`Connected to MongoDB...`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()

// RUN SERVER
app.listen(port, function () {
  console.log(`Server is running on PORT: ${port}`)
})

// EXPORT FOR VERCEL
export default app
