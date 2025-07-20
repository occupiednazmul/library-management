// MODULE IMPORTS
import { Outlet } from 'react-router'

// GET A LIST OF BOOKS
function BookList() {
  return <h1 className='font-bold'>Get Books</h1>
}

// BOOKS PAGE
export default function GetBooks() {
  return (
    <div className='w-full p-16 flex justify-center-safe items-center-safe gap-2'>
      <BookList />
      <Outlet />
    </div>
  )
}
