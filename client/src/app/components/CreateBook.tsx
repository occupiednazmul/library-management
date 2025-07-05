// MODULE IMPORTS
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

// SHADCN ELEMENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Button } from '@/app/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/app/components/ui/select'
import {
  bookSchema,
  genres,
  useCreateBookMutation,
  type TBook
} from '@/app/features/books/bookApi'

// CREATE BOOK
export default function CreateBook() {
  const form = useForm({
    resolver: zodResolver(bookSchema)
  })

  const [createBook, { isLoading }] = useCreateBookMutation()
  const navigate = useNavigate()

  async function onSubmit(data: TBook) {
    try {
      const response = await createBook(data).unwrap()
      console.log(response)
      const bookId = response._id

      toast('✅ Book created successfully')

      navigate(`/books/${bookId}`)
    } catch (error) {
      toast('❌ Failed to create book')
    }
  }

  return (
    <div className='max-w-xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-6'>➕ Create New Book</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='author'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='genre'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem
                        key={genre}
                        value={genre}
                      >
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isbn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='copies'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copies</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='imageURI'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full'
          >
            Create Book
          </Button>
        </form>
      </Form>
    </div>
  )
}
