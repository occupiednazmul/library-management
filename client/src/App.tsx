// MODULE IMPORTS
import { type ReactElement } from 'react'
import { NavLink, Outlet } from 'react-router'
import { LibraryBig, Plus, Table } from 'lucide-react'

// ROOT LAYOUT
export default function App() {
  return (
    <>
      <header className='w-full fixed top-0 left-0 bg-white shadow-md shadow-indigo-50'>
        <nav className='max-w-7xl mx-auto flex justify-between items-center'>
          <NavLink
            to='/'
            className='flex items-center gap-2'
          >
            <img
              src='/libmgt.png'
              alt='Library Management App Icon'
              width={50}
              height={50}
            />
            <p className='font-bold text-base sm:text-xl'>
              Library Management App
            </p>
          </NavLink>
          <div className='w-full md:w-auto bg-white md:bg-transparent fixed md:static left-0 md:left-auto bottom-0 md:bottom-auto p-2 md:p-0 flex justify-around items-center gap-6 shadow-2xl md:shadow-none shadow-indigo-400 *:text-center *:sm:text-lef *:rounded-md *:sm:rounded-sm *:px-4 *:py-2 *:sm:py-4  *:md:py-2 *:w-full *:md:w-auto *:flex *:flex-col *:sm:flex-row *:items-center *:sm:justify-center *:gap-1'>
            <NavigationItem
              path={`/create-book`}
              icon={<Plus className='w-5 h-5' />}
              text={`Add Book`}
            />
            <NavigationItem
              path={`/books`}
              icon={<LibraryBig className='w-4 h-4' />}
              text={`Book List`}
            />
            <NavigationItem
              path={`/borrow-summary`}
              icon={<Table className='w-4 h-4' />}
              text={`Borrow Summary`}
            />
          </div>
        </nav>
      </header>
      <Outlet />
      <footer className='text-xs md:text-sm lg:text-base text-center'>
        <p className='my-2'>&copy; {new Date().getFullYear()} Md Nazmul Huda</p>
      </footer>
    </>
  )
}

function NavigationItem({
  path,
  icon,
  text
}: {
  path: string
  icon: ReactElement
  text: string
}): ReactElement {
  return (
    <NavLink
      to={path}
      className={function ({ isActive, isPending, isTransitioning }) {
        return [
          isPending ? 'bg-slate-50' : '',
          isActive ? 'bg-indigo-100 font-bold' : 'hover:bg-slate-100',
          isTransitioning ? 'bg-slate-100' : '',
          'hover:bg-slate-50'
        ].join(' ')
      }}
    >
      {icon}
      <p className='text-xs md:text-sm lg:text-base w-12 sm:w-auto'>{text}</p>
    </NavLink>
  )
}
