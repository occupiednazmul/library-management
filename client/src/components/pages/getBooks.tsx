// MODULE IMPORTS
import { Link, Outlet, useParams } from 'react-router'

// LOCAL IMPORTS
import { useGetBooksQuery, type TBookDb } from '../../features/booksQuery'

// BOOK IN A BOOK LIST
function BookInABookList() {
  return <h1 className='font-bold'>Get Books</h1>
}

// GET A LIST OF BOOKS
function BookList({ bookId }: { bookId: string | undefined }) {
  const { data, isError, isLoading, isSuccess } = useGetBooksQuery(undefined, {
    skip: Boolean(bookId)
  })

  if (isLoading) {
    return <p className='text-xl sm:text-2xl'>Loading book data.</p>
  }

  if (isError) {
    return (
      <p className='text-xl sm:text-2xl'>There was an error fetching data.</p>
    )
  }

  if (isSuccess && (data?.data as Array<TBookDb>).length > 0) {
    return (
      <div
        className={
          bookId ? 'hidden lg:grid gap-4' : 'grid lg:grid-cols-2 gap-4'
        }
      >
        {data?.data?.map(function (bookInfo) {
          return (
            <div className='border-2 rounded-xl flex gap-2 p-2'>
              <img
                width={120}
                height={180}
                src={bookInfo.imageURI}
                alt={bookInfo.title}
                className='m-1 border-1 z-0'
              />

              <div className='flex flex-col justify-between'>
                <p className='font-bold text-2xl sm:text-4xl'>
                  {bookInfo.title}
                </p>
                <div className='flex flex-col sm:flex-row gap-1 sm:gap-4'>
                  <Link
                    to={`/borrow/${bookInfo._id}`}
                    className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
                  >
                    Borrow book
                  </Link>
                  <Link
                    to={bookInfo._id}
                    className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
                  >
                    See details
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

// BOOKS PAGE
export default function GetBooks() {
  const { id } = useParams()

  return (
    <main className='w-full max-w-7xl mx-auto'>
      <h1 className='mb-6 text-2xl font-semibold sm:text-4xl'>
        <span className='px-6 py-2 bg-indigo-200 rounded-md'>Book List</span>
      </h1>
      <div className={id ? `lg:grid lg:grid-cols-2 lg:gap-4` : ''}>
        <BookList bookId={id} />
        <Outlet />
      </div>
    </main>
  )
}
