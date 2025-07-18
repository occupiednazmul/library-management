// MODULE IMPORTS
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

// LOCAL IMPORTS
import {
  borrowDataValidation,
  type TBorrow
} from '../../validations/borrow.validation'
import {
  useBorrowBookMutation,
  useBorrowSummaryQuery,
  type TBorrowResponse,
  type TBorrowSummary
} from '../../features/borrowQuery'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '../../lib/utils'

// BORROW A BOOK
export function BorrowABook() {
  const { bookId } = useParams()

  const borrowForm = useForm<Omit<TBorrow, 'book'>>({
    resolver: zodResolver(borrowDataValidation.omit({ book: true }))
  })

  const [borrowBook, { isLoading, isSuccess, isError, error }] =
    useBorrowBookMutation()

  const navigate = useNavigate()

  async function sendBorrowData(borrowData: Omit<TBorrow, 'book'>) {
    try {
      const { success } = await borrowBook({
        ...borrowData,
        book: bookId as string
      }).unwrap()

      if (success) {
        return navigate(`/books/${bookId}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(
    function () {
      if (isSuccess) {
        borrowForm.reset()
      }
    },
    [borrowForm, isSuccess]
  )

  return (
    <main className='w-full max-w-xl mx-auto font-semibold'>
      <div>
        <h1 className='mb-6 text-2xl sm:text-4xl'>
          <span className='px-6 py-2 bg-indigo-200 rounded-md'>
            Borrow a Book
          </span>
        </h1>
        <h2
          className={`mb-6 font-medium text-sm${
            isError || ' text-destructive'
          }`}
        >
          {isError ? (
            (error as { status: number; data: TBorrowResponse<TBorrow> }).data
              .message
          ) : (
            <>
              Borrowing book with id:{' '}
              <span className='font-medium text-indigo-500'>{bookId}</span>
            </>
          )}
        </h2>
      </div>
      <Form {...borrowForm}>
        <form
          onSubmit={borrowForm.handleSubmit(sendBorrowData)}
          className='flex flex-col gap-4 text-2xl'
        >
          {/* copies to borrow */}
          <FormField
            control={borrowForm.control}
            name='quantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Copies to borrow
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    value={field.value as number | undefined}
                    onChange={function (e) {
                      if (Number(e.target.value) < 1) {
                        return 1
                      }

                      return field.onChange(Number(e.target.value))
                    }}
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Copies to borrow
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* due date */}
          <FormField
            control={borrowForm.control}
            name='dueDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Due date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-4 py-[22px] text-base sm:text-xl text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date < new Date()}
                      captionLayout='dropdown'
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className='hidden'>
                  Date within the book should be returned.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit */}
          <Button
            type='submit'
            className='mt-4 font-bold text-base sm:text-xl'
            disabled={isLoading}
          >
            Submit
          </Button>
        </form>
      </Form>
    </main>
  )
}

export function BorrowSummary() {
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
          <p>Data is loading...</p>
        ) : isSuccess ? (
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
          <p>No data to show</p>
        )}
      </div>
    </main>
  )
}
