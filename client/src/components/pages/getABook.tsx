// MODULE IMPORTS
import { useParams } from 'react-router'

// LOCAL IMPORTS
import { useGetBookQuery, type TBookDb } from '../../features/booksQuery'

// GET A BOOK
export default function GetABook() {
  const { id } = useParams() as { id: string }

  const { data, isError, isLoading } = useGetBookQuery(id)

  if (isLoading) {
    return <p className='text-xl sm:text-2xl'>Loading book data.</p>
  }

  if (isError || !data) {
    return (
      <p className='text-xl sm:text-2xl'>
        There was an error fetching book with ID: {id}.
      </p>
    )
  }

  const book = data.data as Omit<TBookDb, 'copies' | 'available'> & {
    copies: number
    available: boolean
  }

  return (
    <div className='border-2 rounded-lg p-4'>
      <h2 className='text-lg sm:text-3xl font-bold sm:mb-1'>
        {data.data?.title}
      </h2>
      <p className='text-sm sm:text-lg mb-3'>by {data.data?.author}</p>
      <img
        width={120}
        height={180}
        src={book.imageURI}
        alt={book.title}
      />
      <p className='text-base sm:text-xl mt-6 sm:mt-8'>
        <span className='font-semibold'>Copies available:</span>{' '}
        <span>{book.copies}</span>
      </p>
      <p className='text-base sm:text-xl'>
        <span className='font-semibold'>ISBN:</span> {book.isbn}
      </p>
      <p className='text-base sm:text-xl my-6 sm:my-8'>
        <span className='font-semibold'>Genre:</span> {book.genre}
      </p>
      <h3 className='text-base sm:text-xl font-bold'>Description</h3>
      <p className='text-base sm:text-xl'>{book.description}</p>
    </div>
  )
}
