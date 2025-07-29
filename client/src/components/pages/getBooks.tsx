// MODULE IMPORTS
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Link, Outlet, useParams, useSearchParams } from 'react-router'
import { ListFilter } from 'lucide-react'
import { useForm } from 'react-hook-form'

// LOCAL IMPORTS
import {
  useGetAuthorsQuery,
  useGetBooksQuery,
  type TBookDb
} from '../../features/booksQuery'
import { Button } from '../ui/button'
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
import { genres } from '../../validations/books.validations'

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
          <p className='hidden sm:block'>|</p>
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

// FILTER BOX
function FilterBox() {
  const [isLoading, setIsLoading] = useState(true)

  const filterForm = useForm()

  const { data, isLoading: isAuthorLoading } = useGetAuthorsQuery()

  useEffect(
    function () {
      setIsLoading(isAuthorLoading)
    },
    [isAuthorLoading]
  )

  return (
    <div className='border-2 rounded-xl mt-4 mb-8 p-4'>
      <p className='text-md sm:text-2xl font-semibold mb-4'>Filters</p>

      <Form {...filterForm}>
        <form>
          <div className='grid lg:grid-cols-3 gap-4'>
            {/* Author */}
            {(data?.data as Array<string>)?.length > 0 ? (
              <FormField
                control={filterForm.control}
                name='genre'
                render={function ({ field }) {
                  return (
                    <FormItem>
                      <FormLabel className='font-bold text-base sm:text-xl'>
                        Author
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
                            <SelectValue placeholder='Author name' />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.data?.map(function (author) {
                              return (
                                <SelectItem
                                  key={author}
                                  value={author}
                                  className='text-base sm:text-xl'
                                >
                                  {author}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className='hidden'>
                        Author
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            ) : (
              <FormField
                control={filterForm.control}
                name='author'
                render={function (field) {
                  return (
                    <FormItem>
                      <FormLabel className='font-bold text-base sm:text-xl'>
                        Author
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Author name'
                          {...field}
                          className='text-base sm:text-xl'
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            )}

            {/* book genre */}
            <FormField
              control={filterForm.control}
              name='genre'
              render={function ({ field }) {
                return (
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
                    <FormDescription className='hidden'>Genres</FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* book availability */}
            <FormField
              control={filterForm.control}
              name='genre'
              render={function ({ field }) {
                return (
                  <FormItem>
                    <FormLabel className='font-bold text-base sm:text-xl'>
                      Available
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
                          <SelectValue placeholder='Book availability' />
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
                      Book availability
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Apply filters */}
          <Button
            size='lg'
            className='w-full mt-6 cursor-pointer'
            disabled={isLoading}
          >
            Apply filters
          </Button>
        </form>
      </Form>
    </div>
  )
}

// BOOKS PAGE
export default function GetBooks() {
  const [showList, setShowList] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const { id } = useParams()

  return (
    <main className='w-full max-w-7xl mx-auto'>
      <div className='w-full flex justify-between items-baseline'>
        <h1 className='mb-6 text-2xl font-semibold sm:text-4xl'>
          <span className='px-6 py-2 bg-indigo-200 rounded-md'>Book List</span>
        </h1>
        <Button
          size='lg'
          variant={showFilter ? 'secondary' : 'outline'}
          className='border text-base sm:text-xl cursor-pointer'
          onClick={function () {
            setShowFilter(cur => !cur)
          }}
        >
          Filter <ListFilter />
        </Button>
      </div>
      {showFilter ? <FilterBox /> : <></>}
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
