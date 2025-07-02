// MODULE IMPORTS
import { Request, Response, Router } from 'express'

// CREATE ROUTER
const borrowRouter = Router()

borrowRouter.get('/', function (req: Request, res: Response) {
  res.json({
    success: true,
    message: `Fulfilling ${req.originalUrl}`,
    data: {},
    error: {}
  })
})

// DEFAULT EXPORT
export default borrowRouter
