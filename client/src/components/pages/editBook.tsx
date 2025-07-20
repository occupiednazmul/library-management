// MODULE IMPORTS
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// LOCAL IMPORTS
import {
  bookDataValidation,
  type TBookUpdate
} from '../../validations/books.validations'
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
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import {
  useUpdateBookMutation,
  type TBookDb,
  type TBookResponse
} from '../../features/booksQuery'

// EDIT A BOOK
export default function EditABook() {
  const { id } = useParams()

  const updatedBook = useForm<TBookUpdate>({
    resolver: zodResolver(bookDataValidation.partial())
  })

  const [updateBook, { isLoading, isSuccess, isError, error }] =
    useUpdateBookMutation()

  const navigate = useNavigate()

  async function sendUpdatedBook(updatedBook: TBookUpdate) {
    try {
      const { success, data } = await updateBook({
        id: id || '',
        updatedBook
      }).unwrap()

      if (success) {
        return navigate(`/books/${data?._id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(
    function () {
      if (isSuccess) {
        updatedBook.reset()
      }
    },
    [updatedBook, isSuccess]
  )

  return (
    <main className='w-full max-w-xl mx-auto font-semibold'>
      <div>
        <h1 className='mb-6 text-2xl sm:text-4xl'>
          <span className='px-6 py-2 bg-indigo-200 rounded-md'>
            Update a Book
          </span>
        </h1>
        <h2
          className={`mb-6 font-medium text-sm${
            isError || ' text-destructive'
          }`}
        >
          {isError ? (
            (error as { status: number; data: TBookResponse<TBookDb> }).data
              .message
          ) : (
            <>
              Updating book with id:{' '}
              <span className='font-medium text-indigo-500'>{id}</span>
            </>
          )}
        </h2>
      </div>
      <Form {...updatedBook}>
        <form
          onSubmit={updatedBook.handleSubmit(sendUpdatedBook)}
          className='flex flex-col gap-4 text-2xl'
        >
          {/* book description */}
          <FormField
            control={updatedBook.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Book Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Book description'
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Description of the book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book copies */}
          <FormField
            control={updatedBook.control}
            name='copies'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Copies
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    value={field.value as number | undefined}
                    onChange={function (e) {
                      if (Number(e.target.value) < 0) {
                        return 0
                      }

                      return field.onChange(Number(e.target.value))
                    }}
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Number of copies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book image url */}
          <FormField
            control={updatedBook.control}
            name='imageURI'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Book Cover Image URL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='URL'
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Book cover image URI.
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
