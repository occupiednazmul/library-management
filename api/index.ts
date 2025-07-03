// MODULE IMPORTS
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'
import { connect } from 'mongoose'
import { ZodError } from 'zod/v4'

// LOCAL IMPORTS
import rootRouter from './src/root.route.js'

// VARIABLES
const port = process.env.PORT || 3000
const dbURI = process.env.MONGODB_URI || ''
const app = express()

// LOGGER
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log(`Request made to: ${req.url}`)
  next()
})

// STATIC ROUTE
const thisDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicFolder = path.resolve(thisDirectory, '..', 'public')

app.use(express.static(publicFolder))

// API ROUTE
app.use(express.json()) // accepts all body as JSON
app.use('/api', rootRouter) // all API routes are handled through this

// GLOBAL ERROR HANDLER
app.use(function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err)

  if (err.name === 'MongoServerError') {
    if ((err as any).code === 11000) {
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
})

// NOT FOUND ROUTE
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    success: false,
    message: `Content not found for: ${req.originalUrl}`,
    error: {
      message: `Content not found for: ${req.originalUrl}`
    }
  })
})

// CONNECT TO DATABASE
await (async function (uri: string) {
  try {
    await connect(uri /*, { autoIndex: false }*/)

    console.log(`Connected to MongoDB...`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})(dbURI)

// RUN SERVER
app.listen(port, function () {
  console.log(`Server is running on PORT: ${port}`)
})

// EXPORT FOR VERCEL
export default app
