// MODULE IMPORTS
import { Router } from 'express'

// LOCAL IMPORTS
import bookRouter from './book.route.js'
import borrowRouter from './borrow.route.js'

// CREATE ROUTER
const rootRouter = Router()

// ALL ROUTES
rootRouter.use('/books', bookRouter)
rootRouter.use('/borrow', borrowRouter)

// DEFAULT EXPORT
export default rootRouter
