// MODULE IMPORTS
import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'
import {
  Link,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router'
import { ListFilter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'

// LOCAL IMPORTS
import {
  useGetAuthorsQuery,
  useGetBooksQuery,
  type TBookDb,
  type TBookResponse
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
import { genres, type TGenres } from '../../validations/books.validations'

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
            to={`/books/${book._id}`}
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
  show,
  data,
  error,
  isError,
  isLoading,
  isSuccess
}: {
  bookId: string | undefined
  show: Dispatch<SetStateAction<boolean>>
  data: TBookResponse<Array<TBookDb>> | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}) {
  useEffect(
    function () {
      show(() => !data?.data)
    },
    [data, show]
  )

  if (bookId && !data) {
    return null
  }

  if (isLoading) {
    return <p className='text-xl sm:text-2xl'>Loading book data.</p>
  }

  if (isError) {
    return (
      <p className='text-xl sm:text-2xl'>
        {
          (error as { status: number; data: TBookResponse<Array<TBookDb>> })
            .data.message
        }
      </p>
    )
  }

  if (isSuccess && (data?.data as Array<TBookDb>).length > 0) {
    return (
      <div>
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
      </div>
    )
  }

  return <div className='text-xl sm:text-2xl'>No book found.</div>
}

// FILTER BOX
function FilterBox({ filterBox }: { filterBox: boolean }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetAuthorsQuery()

  const filterForm = useForm<{
    author?: string
    genre?: Exclude<TGenres, ''>
    available?: 'true' | 'false'
  }>({
    defaultValues: {
      author: searchParams.get('author') ?? undefined,
      genre: (searchParams.get('genre') as Exclude<TGenres, ''>) ?? undefined,
      available:
        (searchParams.get('available') as 'true' | 'false') ?? undefined
    }
  })

  function redirectQuery(
    event: FormEvent<HTMLFormElement> | ChangeEvent<HTMLSelectElement>
  ) {
    event.preventDefault()

    const newSearchParams = {
      ...Object.fromEntries(searchParams.entries()),
      ...filterForm.getValues()
    } as Record<string, string>

    const search = new URLSearchParams()

    Object.keys(newSearchParams).forEach(function (key) {
      const value = newSearchParams[key]

      if (value !== undefined && value !== '') {
        search.append(key, value)
      }
    })

    filterForm.reset()

    navigate(`/books?${search.toString()}`)
  }

  return (
    <>
      {filterBox ? (
        <div className='border-2 rounded-xl mt-4 mb-4 p-4'>
          <p className='text-md sm:text-2xl font-semibold mb-4'>Filters</p>

          <Form {...filterForm}>
            <form onSubmit={redirectQuery}>
              <div className='grid lg:grid-cols-3 gap-4'>
                {/* Author */}
                {(data?.data as Array<string>)?.length > 0 ? (
                  <FormField
                    control={filterForm.control}
                    name='author'
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
                        <FormDescription className='hidden'>
                          Genres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                {/* book availability */}
                <FormField
                  control={filterForm.control}
                  name='available'
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
      ) : (
        <></>
      )}
      <div className='mb-8'>Sort by, results per page, page</div>
    </>
  )
}

// BOOKS PAGE
export default function GetBooks() {
  const [searchParams] = useSearchParams()

  const { id: bookId } = useParams()

  const { data, error, isError, isLoading, isSuccess } = useGetBooksQuery(
    Object.fromEntries(searchParams.entries()),
    {
      skip: Boolean(bookId)
    }
  )

  const [showList, setShowList] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(
    function () {
      setShowFilter(false)
    },
    [searchParams]
  )

  useEffect(
    function () {
      if (Boolean(bookId) && Boolean(data) === true) {
        setShowList(function () {
          return true
        })
      }

      if (Boolean(bookId) && Boolean(data) === false) {
        setShowList(function () {
          return false
        })
      }
    },
    [bookId, data, setShowList]
  )

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
          disabled={isLoading}
        >
          Filter <ListFilter />
        </Button>
      </div>
      <FilterBox filterBox={showFilter} />
      <div
        className={
          bookId ? `lg:grid${showList ? ` lg:grid-cols-2` : ''} lg:gap-4` : ''
        }
      >
        <BookList
          bookId={bookId}
          show={setShowList}
          data={data}
          error={error}
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
        />
        <Outlet />
      </div>
    </main>
  )
}
