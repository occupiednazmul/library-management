// MODULE IMPORTS
import { Request, Response, Router } from 'express'

// CREATE ROUTER
const bookRouter = Router()

bookRouter.get('/', function (req: Request, res: Response) {
  res.json({
    success: true,
    message: `Fulfilling ${req.url}`,
    data: {},
    error: {}
  })
})

// DEFAULT EXPORT
export default bookRouter
