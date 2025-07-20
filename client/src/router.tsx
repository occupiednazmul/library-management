// MODULE IMPORTS
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'

// LOCAL IMPORTS
import App from './App'
import Home from './components/pages/home'
import Loader from './components/elements/loader'

// LAZY IMPORTS
const BorrowABook = lazy(function () {
  return import('./components/pages/borrowABook')
})
const BorrowSummary = lazy(function () {
  return import('./components/pages/borrowSummary')
})
const CreateABook = lazy(function () {
  return import('./components/pages/createBook')
})
const EditABook = lazy(function () {
  return import('./components/pages/editBook')
})
const GetBooks = lazy(function () {
  return import('./components/pages/getBooks')
})
const GetABook = lazy(function () {
  return import('./components/pages/getABook')
})

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
        element: (
          <Suspense fallback={<Loader />}>
            <GetBooks />
          </Suspense>
        ),
        children: [
          {
            path: ':id',
            element: (
              <Suspense fallback={<Loader />}>
                <GetABook />
              </Suspense>
            )
          }
        ]
      },
      {
        path: 'create-book',
        element: (
          <Suspense fallback={<Loader />}>
            <CreateABook />
          </Suspense>
        )
      },
      {
        path: 'edit-book/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <EditABook />
          </Suspense>
        )
      },
      {
        path: 'borrow/:bookId',
        element: (
          <Suspense fallback={<Loader />}>
            <BorrowABook />
          </Suspense>
        )
      },
      {
        path: 'borrow-summary',
        element: (
          <Suspense fallback={<Loader />}>
            <BorrowSummary />
          </Suspense>
        )
      }
    ]
  }
])

export default router
