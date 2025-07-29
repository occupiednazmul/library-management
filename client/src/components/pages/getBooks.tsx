// MODULE IMPORTS
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Link, Outlet, useParams, useSearchParams } from 'react-router'
import { Divide, ListFilter } from 'lucide-react'

// LOCAL IMPORTS
import { useGetBooksQuery, type TBookDb } from '../../features/booksQuery'
import { Button } from '../ui/button'

// BOOK IN A BOOK LIST
function BookInABookList({ book }: { book: TBookDb }) {
  return (
    <div className='border-2 rounded-xl flex gap-2 p-2'>
      <img
        width={120}
        height={180}
        src={book.imageURI}
        alt={book.title}
        className='m-1 border-1 z-0'
      />

      <div className='flex flex-col justify-between'>
        <p className='font-bold text-2xl sm:text-4xl'>{book.title}</p>
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-4'>
          <Link
            to={`/borrow/${book._id}`}
            className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
          >
            Borrow book
          </Link>
          <Link
            to={book._id}
            className='text-indigo-500 hover:text-indigo-200 active:text-indigo-200'
          >
            See details
          </Link>
        </div>
      </div>
    </div>
  )
}

// GET A LIST OF BOOKS
function BookList({
  bookId,
  show
}: {
  bookId: string | undefined
  show: Dispatch<SetStateAction<boolean>>
}) {
  // const [searchParams, setSearchParams] = useSearchParams()

  const { data, isError, isLoading, isSuccess } = useGetBooksQuery(undefined, {
    skip: Boolean(bookId)
  })

  useEffect(
    function () {
      show(Boolean(bookId && data))
    },
    [show, bookId, data]
  )

  if (bookId && !data) {
    return null
  }

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
            <BookInABookList
              book={bookInfo}
              key={bookInfo._id}
            />
          )
        })}
      </div>
    )
  }
}

// BOOKS PAGE
export default function GetBooks() {
  const [showList, setShowList] = useState(true)
  const [showFilter, setShowFilter] = useState(true)

  const { id } = useParams()

  return (
    <main className='w-full max-w-7xl mx-auto'>
      <div className='w-full flex justify-between items-baseline'>
        <h1 className='mb-6 text-2xl font-semibold sm:text-4xl'>
          <span className='px-6 py-2 bg-indigo-200 rounded-md'>Book List</span>
        </h1>
        <Button
          size='lg'
          variant='outline'
          className='text-base sm:text-xl'
        >
          Filter <ListFilter />
        </Button>
      </div>
      {showFilter ? (
        <div className='border-2 rounded-xl mt-4 mb-8 p-4'>
          <p className='text-md sm:text-2xl font-semibold mb-4'>Filter</p>
          <p>Some filter</p>
        </div>
      ) : (
        <></>
      )}
      <div
        className={
          id ? `lg:grid${showList ? ` lg:grid-cols-2` : ''} lg:gap-4` : ''
        }
      >
        <BookList
          bookId={id}
          show={setShowList}
        />
        <Outlet />
      </div>
    </main>
  )
}
