// MODULE IMPORTS
import { Outlet, NavLink } from 'react-router'
import { cn } from '@/lib/utils'

// APP ROOT
export default function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow-md px-4 py-2 border-b'>
        <nav className='flex gap-4 items-center'>
          <NavLink
            to='/books'
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'text-sm font-medium',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )
            }
          >
            All Books
          </NavLink>
          <NavLink
            to='/create-book'
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'text-sm font-medium',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )
            }
          >
            Add Book
          </NavLink>
          <NavLink
            to='/borrow-summary'
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'text-sm font-medium',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )
            }
          >
            Borrow Summary
          </NavLink>
        </nav>
      </header>

      <main className='flex-1 px-4 py-6'>
        <Outlet />
      </main>

      <footer className='text-center text-sm text-gray-500 py-4 border-t'>
        Minimal Library App — {new Date().getFullYear()}
      </footer>
    </div>
  )
}
