// LOCAL IMPORTS
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express, { NextFunction, Request, Response } from 'express'

// VARIABLES
const port = process.env.PORT || 3000
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

app.all('/api', function (req: Request, res: Response) {
  res.json({ message: `API route is working!!!` })
})

// RUN SERVER
app.listen(port, function () {
  console.log(`Server is running on PORT: ${port}`)
})

// EXPORT FOR VERCEL
export default app
