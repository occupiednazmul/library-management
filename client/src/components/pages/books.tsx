// MODULE IMPORTS
import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// LOCAL IMPORTS
import {
  bookDataValidation,
  genres,
  type TBookNew,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import {
  useCreateBookMutation,
  useUpdateBookMutation,
  type TBookDb,
  type TBookResponse
} from '../../features/booksQuery'

// GET A LIST OF BOOKS
function BookList() {
  return <h1 className='font-bold'>Get Books</h1>
}

// GET A BOOK
export function GetABook() {
  return <h1 className='font-bold'>Get a Book</h1>
}

// BOOKS PAGE
export function GetBooks() {
  return (
    <div className='w-full p-16 flex justify-center-safe items-center-safe gap-2'>
      <BookList />
      <Outlet />
    </div>
  )
}

// CREATE A BOOK
export function CreateABook() {
  const newBook = useForm({
    resolver: zodResolver(bookDataValidation),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      isbn: '',
      description: '',
      copies: 0,
      available: null,
      imageURI: ''
    }
  })

  const [createBook, { isLoading, isSuccess }] = useCreateBookMutation()

  const navigate = useNavigate()

  async function sendBookData(bookData: TBookNew) {
    try {
      const { success, data } = await createBook(bookData).unwrap()

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
        newBook.reset()
      }
    },
    [newBook, isSuccess]
  )

  return (
    <main className='w-full max-w-xl mx-auto font-semibold text-2xl sm:text-4xl'>
      <h1 className='mb-6'>
        <span className='px-6 py-2 bg-indigo-200 rounded-md'>
          Add a new Book
        </span>
      </h1>
      <Form {...newBook}>
        <form
          onSubmit={newBook.handleSubmit(sendBookData)}
          className='flex flex-col gap-4 text-2xl'
        >
          {/* book name */}
          <FormField
            control={newBook.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Book Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Book title'
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Title of the book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* author name */}
          <FormField
            control={newBook.control}
            name='author'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Author name'
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  Author of the book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book genre */}
          <FormField
            control={newBook.control}
            name='genre'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Genre
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className='w-full text-base sm:text-xl'
                      disabled={isLoading}
                    >
                      <SelectValue placeholder='Book genre' />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(function (genre) {
                        return (
                          <SelectItem
                            key={genre}
                            value={genre}
                            className='text-base sm:text-xl'
                          >
                            {genre}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className='hidden'>
                  Genre of the book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book isbn */}
          <FormField
            control={newBook.control}
            name='isbn'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  ISBN
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='ISBN'
                    className='text-base sm:text-xl'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className='hidden'>
                  ISBN of the book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book description */}
          <FormField
            control={newBook.control}
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
            control={newBook.control}
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

          {/* book availability */}
          <FormField
            control={newBook.control}
            name='available'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base sm:text-xl'>
                  Is the book available?
                </FormLabel>
                <FormControl>
                  <Select disabled={isLoading}>
                    <SelectTrigger
                      className='w-full text-base sm:text-xl'
                      disabled={isLoading}
                    >
                      <SelectValue
                        {...field}
                        placeholder='Is the book available?'
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value='true'
                        className='text-base sm:text-xl'
                      >
                        Yes
                      </SelectItem>
                      <SelectItem
                        value='false'
                        className='text-base sm:text-xl'
                      >
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className='hidden'>
                  Is the book available?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* book image url */}
          <FormField
            control={newBook.control}
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
            // disabled={isLoading || !newBook.formState.isValid}
          >
            Submit
          </Button>
        </form>
      </Form>
    </main>
  )
}

// EDIT A BOOK
export function EditABook() {
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
