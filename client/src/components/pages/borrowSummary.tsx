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
    <main className='w-full max-w-7xl mx-auto'>
      <div>
        <h1 className='mb-6 text-2xl sm:text-4xl font-semibold'>
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
      <div
        className={
          isSuccess
            ? `grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
            : ''
        }
      >
        {isLoading ? (
          <p className='text-4xl font-semibold mb-8'>Data is loading...</p>
        ) : isSuccess ? (
          (data.data as Array<TBorrowedBook>).length > 0 ? (
            <>
              {data.data?.map(function (borrowedBook) {
                return (
                  <div
                    className='relative -z-50'
                    key={borrowedBook.book.isbn}
                  >
                    <div className='border-2 rounded-sm absolute top-0 left-[50%] translate-x-[-50%] sm:left-4 sm:translate-x-0'>
                      <img
                        width={120}
                        height={180}
                        src={borrowedBook.book.imageURI}
                        alt={borrowedBook.book.title}
                        className='m-1 border-1 z-0'
                      />
                    </div>
                    <div className='border-1 rounded-md px-2 pt-12 pb-4 mt-40'>
                      <p className='mb-4'>
                        <span>Book:</span>
                        <br />
                        <span className='font-bold text-2xl sm:text-4xl'>
                          {borrowedBook.book.title}
                        </span>
                      </p>
                      <p className='mb-2'>
                        <span className='font-bold'>ISBN:</span>
                        <br />
                        {borrowedBook.book.isbn.split(',').join(', ')}
                      </p>
                      <p>
                        <span className='font-bold'>Quantity:</span>{' '}
                        {borrowedBook.totalQuantity}
                      </p>
                    </div>
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
