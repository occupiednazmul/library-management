// MODULE IMPORTS
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// LOCAL IMPORTS
import { booksApi } from './booksQuery'
import { borrowApi } from './borrowQuery'

// REDUX STORE
const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [borrowApi.reducerPath]: borrowApi.reducer
  },
  middleware: function (getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      booksApi.middleware,
      borrowApi.middleware
    )
  }
})

// LISTENER
setupListeners(store.dispatch)

// TYPE EXPORTS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// EXPORT STORE
export default store
