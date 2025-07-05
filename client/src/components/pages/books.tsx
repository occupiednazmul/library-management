// MODULE IMPORTS
import { Outlet } from 'react-router'

// GET A LIST OF BOOKS
export function BookList() {
  return <h1 className='font-bold'>Get Books</h1>
}

// GET A BOOK
export function GetABook() {
  return <h1 className='font-bold'>Get a Book</h1>
}

// BOOKS PAGE
export function GetBooks() {
  return (
    <div className='w-screen h-screen flex justify-center-safe items-center-safe gap-2'>
      <img
        src='/libmgt.png'
        alt='Library Management App Icon'
        width={80}
        height={80}
      />
      <BookList />
      <Outlet />
    </div>
  )
}

// CREATE A BOOK
export function CreateABook() {
  return (
    <div className='w-screen h-screen flex justify-center-safe items-center-safe gap-2'>
      <img
        src='/libmgt.png'
        alt='Library Management App Icon'
        width={80}
        height={80}
      />
      <h1 className='font-bold'>Create Book</h1>
    </div>
  )
}

// EDIT A BOOK
export function EditABook() {
  return (
    <div className='w-screen h-screen flex justify-center-safe items-center-safe gap-2'>
      <img
        src='/libmgt.png'
        alt='Library Management App Icon'
        width={80}
        height={80}
      />
      <h1 className='font-bold'>Edit a Book</h1>
    </div>
  )
}
