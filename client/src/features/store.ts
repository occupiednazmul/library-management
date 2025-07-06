// MODULE IMPORTS
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// LOCAL IMPORTS
import { booksApi } from './booksQuery'

// REDUX STORE
const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer
  },
  middleware: function (getDefaultMiddleware) {
    return getDefaultMiddleware().concat(booksApi.middleware)
  }
})

// LISTENER
setupListeners(store.dispatch)

// TYPE EXPORTS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// EXPORT STORE
export default store
