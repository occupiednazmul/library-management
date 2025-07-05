// MODULE IMPORTS
import { createBrowserRouter } from 'react-router'

// COMPONENTS
import App from '@/app/App'
import CreateBook from '@/app/components/CreateBook'
import BookList from '@/app/components/BookList'
import BookDetails from '@/app/components/BookDetails'
import EditBook from '@/app/components/EditBook'
import BorrowBook from '@/app/components/BorrowBook'
import BorrowSummary from '@/app/components/BorrowSummary'

// COMPONENT ROUTER
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'books',
        element: <BookList />,
        children: [
          {
            path: ':id',
            element: <BookDetails />
          }
        ]
      },
      {
        path: 'create-book',
        element: <CreateBook />
      },
      {
        path: 'edit-book/:id',
        element: <EditBook />
      },
      {
        path: 'borrow/:bookId',
        element: <BorrowBook />
      },
      {
        path: 'borrow-summary',
        element: <BorrowSummary />
      }
    ]
  }
])

export default router
