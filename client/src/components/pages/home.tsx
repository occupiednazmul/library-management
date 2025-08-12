// MODULE IMPORTS
import { Link } from 'react-router'

// LOCAL IMPORTS
import { useGetLatestBooksQuery } from '../../features/booksQuery'
import { useGetPopularBooksQuery } from '../../features/borrowQuery'

// BOOK CARD
function BookCard({
  _id,
  title,
  imageURI
}: {
  _id: string
  title: string
  imageURI?: string
}) {
  return (
    <div className='border-2 rounded-xl flex gap-2 p-2'>
      <img
        width={120}
        height={180}
        src={imageURI}
        alt={title}
        className='m-1 border-1 z-0 object-cover'
      />
      <div className='flex flex-col justify-between'>
        <p className='font-bold text-2xl sm:text-4xl'>{title}</p>
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-4'>
          <Link
            to={`/borrow/${_id}`}
            className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
          >
            Borrow book
          </Link>
          <p className='hidden sm:block'>|</p>
          <Link
            to={`/books/${_id}`}
            className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
          >
            See details
          </Link>
        </div>
      </div>
    </div>
  )
}

// HOME
export default function Home() {
  // Top 5 popular (server already limits or expose ?limit=5 if you added it)
  const {
    data: popularRes,
    isLoading: loadingPopular,
    isError: errorPopular
  } = useGetPopularBooksQuery()

  // Latest 5 books
  const {
    data: latestRes,
    isLoading: loadingLatest,
    isError: errorLatest
  } = useGetLatestBooksQuery()

  const popular = popularRes?.data ?? []
  const latest = latestRes?.data ?? []

  return (
    <main className='w-full max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-4'>
      {/* Popular */}
      <section className='mb-10'>
        <div className='flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-6'>
          <h2 className='text-xl sm:text-3xl font-bold'>🔥 Most Borrowed</h2>
          <Link
            to='/books'
            className='text-base sm:text-xl underline underline-offset-4 lg:me-4'
          >
            Browse all books
          </Link>
        </div>

        {loadingPopular && <p className='text-lg sm:text-xl'>Loading…</p>}
        {errorPopular && (
          <p className='text-lg sm:text-xl text-red-600'>
            Couldn’t load popular books.
          </p>
        )}
        {!loadingPopular && !errorPopular && popular.length === 0 && (
          <p className='text-lg sm:text-xl'>No popular books found.</p>
        )}

        {popular.length > 0 && (
          <div className='grid gap-4'>
            {popular.slice(0, 5).map(function (book) {
              console.log(book)

              return (
                <BookCard
                  key={book.book._id}
                  _id={book.book._id}
                  title={book.book.title}
                  imageURI={book.book.imageURI}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* Latest */}
      <section>
        <div className='flex flex-col sm:flex-row gap-2 sm:items-center justify-between mb-6'>
          <h2 className='text-xl sm:text-3xl font-bold'>🆕 Latest Arrivals</h2>
          <Link
            to='/books?sortBy=desc'
            className='text-base sm:text-xl underline underline-offset-4 lg:me-4'
          >
            See all latest
          </Link>
        </div>

        {loadingLatest && <p className='text-lg sm:text-xl'>Loading…</p>}
        {errorLatest && (
          <p className='text-lg sm:text-xl text-red-600'>
            Couldn’t load latest books.
          </p>
        )}
        {!loadingLatest && !errorLatest && latest.length === 0 && (
          <p className='text-lg sm:text-xl'>No latest books found.</p>
        )}

        {latest.length > 0 && (
          <div className='grid gap-4'>
            {latest.slice(0, 5).map(book => (
              <BookCard
                key={book._id}
                _id={book._id}
                title={book.title}
                imageURI={book.imageURI}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
