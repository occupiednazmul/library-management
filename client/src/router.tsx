// MODULE IMPORTS
import { createBrowserRouter } from 'react-router'

// LOCAL IMPORTS
import App from './App'
import { CreateABook, GetABook, GetBooks } from './components/pages/books'
import { BorrowABook, BorrowSummary } from './components/pages/borrow'

// ROUTER
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'books',
    element: <GetBooks />,
    children: [
      {
        path: ':id',
        element: <GetABook />
      }
    ]
  },
  {
    path: 'create-book',
    element: <CreateABook />
  },
  {
    path: 'borrow/:bookId',
    element: <BorrowABook />
  },
  {
    path: 'borrow-summary',
    element: <BorrowSummary />
  }
])

export default router
