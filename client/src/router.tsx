// MODULE IMPORTS
import { createBrowserRouter } from 'react-router'

// LOCAL IMPORTS
import App from './App'
import {
  CreateABook,
  EditABook,
  GetABook,
  GetBooks
} from './components/pages/books'
import { BorrowABook, BorrowSummary } from './components/pages/borrow'
import Home from './components/pages/home'

// ROUTER
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
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
        path: 'edit-book/:id',
        element: <EditABook />
      },
      {
        path: 'borrow/:bookId',
        element: <BorrowABook />
      },
      {
        path: 'borrow-summary',
        element: <BorrowSummary />
      }
    ]
  }
])

export default router
