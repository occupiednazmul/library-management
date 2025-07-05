// MODULE IMPORTS
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '@/app/features/store'

// STYLESHEET
import '@/stylesheets/global.css'

// ROUTER
import router from '@/app/router.tsx'

// ROOT
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
