// MODULE IMPORTS
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

// LOCAL IMPORTS
import '@/index.css'
import router from './router'

// ROOT ELEMENT
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
