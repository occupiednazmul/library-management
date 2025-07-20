// LOCAL IMPORTS
import {
  useBorrowSummaryQuery,
  type TBorrowedBook,
  type TBorrowSummary
} from '../../features/borrowQuery'

// BORROW SUMMARY
export default function BorrowSummary() {
  const { data, isSuccess, isLoading, isError, error } = useBorrowSummaryQuery()

  return (
    <main className='w-full max-w-xl mx-auto font-semibold'>
      <div>
        <h1 className='mb-6 text-2xl sm:text-4xl'>
          <span className='px-6 py-2 bg-indigo-200 rounded-md'>
            Borrow Summary
          </span>
        </h1>
        <h2
          className={`mb-6 font-medium text-sm${
            isLoading ? ' text-accent' : isError ? ' text-destructive' : ''
          }`}
        >
          {isLoading
            ? 'Data Loading...'
            : isError
            ? (error as { status: number; data: TBorrowSummary }).data.message
            : (data as TBorrowSummary).message}
        </h2>
      </div>
      <div className='grid gap-4'>
        {isLoading ? (
          <p className='text-4xl font-semibold mb-8'>Data is loading...</p>
        ) : isSuccess ? (
          (data.data as Array<TBorrowedBook>).length > 0 ? (
            <>
              {data.data?.map(function (borrowedBook) {
                return (
                  <div
                    className='border-1 p-2'
                    key={borrowedBook.book.isbn}
                  >
                    <p>
                      <span className='font-bold'>Book:</span>{' '}
                      {borrowedBook.book.title}
                    </p>
                    <p>
                      <span className='font-bold'>ISBN:</span>{' '}
                      {borrowedBook.book.isbn}
                    </p>
                    <p>
                      <span className='font-bold'>Quantity:</span>{' '}
                      {borrowedBook.totalQuantity}
                    </p>
                    <p>
                      <span className='font-bold'>Image:</span>{' '}
                      {borrowedBook.book.imageURI}
                    </p>
                  </div>
                )
              })}
            </>
          ) : (
            <p className='text-4xl font-semibold mb-8'>No data to show</p>
          )
        ) : (
          <p className='text-4xl font-semibold mb-8'>Some error happened</p>
        )}
      </div>
    </main>
  )
}
