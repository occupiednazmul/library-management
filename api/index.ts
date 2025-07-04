// MODULE IMPORTS
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'
import { connect } from 'mongoose'

// ROUTER IMPORTS
import booksRouter from './controllers/books.controller.js'
import borrowRouter from './controllers/borrow.controller.js'
import {
  globalErrorHandler,
  notFoundHandler
} from './utilities/global.handlers.js'

// VARIABLES
const port = process.env.PORT || 3000 // server port
const dbURI = process.env.MONGODB_URI || '' // database uri

const app = express() // initialize app

// LOGGER
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log(`Request made to: ${req.url}`)
  next()
})

// STATIC ROUTE
const thisDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicFolder = path.resolve(thisDirectory, '..', 'public')

app.use(express.static(publicFolder)) // serve static files

// ROUTES
app.use(express.json()) // accepts all body as JSON

app.use('/api/books', booksRouter)
app.use('/api/borrow', borrowRouter)

// POST ROUTING MIDDLEWARES
app.use(globalErrorHandler)
app.use(notFoundHandler)

// CONNECT TO DATABASE
await (async function () {
  try {
    await connect(dbURI, {
      autoIndex:
        process.env.ENV === 'production' ||
        process.env.VERCEL_ENV === 'production'
    })

    console.log(`Connected to MongoDB...`)

    console.log(
      process.env.ENV === 'production' ||
        process.env.VERCEL_ENV === 'production'
        ? 'Database is inside PRODUCTION deployment, AUTO INDEXING TURNED OFF.\n'
        : 'Database is NOT inside PRODUCTION deployment, AUTO INDEXING TURNED ON.\n'
    )
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
