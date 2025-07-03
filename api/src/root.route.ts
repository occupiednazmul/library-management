// MODULE IMPORTS
import { Router } from 'express'

// LOCAL IMPORTS
import { bookRouter, booksRouter } from './routes/books.route.js'
import { userRouter } from './routes/user.routes.js'

// ROOT ROUTER
const rootRouter = Router()

// ROUTES
rootRouter.use('/book', bookRouter)
rootRouter.use('/books', booksRouter)
rootRouter.use('/user', userRouter)

// DEFAULT EXPORT
export default rootRouter
