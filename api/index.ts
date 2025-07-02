// MODULE IMPORTS
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'

// LOCAL IMPORTS
import rootRouter from './routes/root.route.js'

// VARIABLES
const port = process.env.PORT || 3000
const app = express()

// LOGGER
app.use(function (req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} Request made to: ${req.url}`)
  next()
})

// STATIC ROUTE
const thisDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicFolder = path.resolve(thisDirectory, '..', 'public')

app.use(express.static(publicFolder))

// API ROUTE
app.use(express.json()) // accepts all body as JSON
app.use('/api', rootRouter) // all API routes are handled through this

// NOT FOUND
app.all('*', function (req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Nothing found for: ${req.url}`,
    error: {
      name: 'NOT_FOUND',
      message: `Nothing found for: ${req.url}`
    }
  })
})

// RUN SERVER
app.listen(port, function () {
  console.log(`Server is running on PORT: ${port}`)
})

// EXPORT FOR VERCEL
export default app
