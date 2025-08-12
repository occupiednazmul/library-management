# Library App (Vite + React + TypeScript + RTK Query)

A small library management frontend that lets users **browse, filter, and paginate books**, view a **single book**, **create/edit** books, **borrow** copies, and see a **borrow summary**. The homepage highlights **Top 5 Most Borrowed** and **Latest 5** books.

> Frontend is built with **Vite + React + TypeScript**, **Redux Toolkit Query**, **react-hook-form + zod**, and **shadcn/ui** components.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Contract (expected)](#api-contract-expected)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment & Base URL](#environment--base-url)
- [Routes](#routes)
- [Data Flow](#data-flow)
- [Home Page](#home-page)
- [Books List Page](#books-list-page)
- [Borrow Flow](#borrow-flow)
- [Development Tips](#development-tips)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Tech Stack

- **Build:** Vite
- **UI:** React + TypeScript
- **State/Data:** Redux Toolkit Query (RTK Query)
- **Forms/Validation:** react-hook-form + zod
- **UI Components:** shadcn/ui, lucide-react
- **Routing:** `react-router` (v6-style APIs), lazy-loaded routes with `Suspense`

---

## Features

- **Home**
  - Top 5 **Most Borrowed** books (popular)
  - Latest 5 **Newest** books
- **Books**
  - List + **filters** (author, genre, availability)
  - **Sorting** (asc/desc by `createdAt`)
  - **Pagination** with URL-driven `page` & `resultsPerPage`
  - Book detail page
- **Borrow**
  - Borrow a book with **quantity** and **due date**
  - Borrow summary aggregation (book + total quantity)
- **Create/Edit**
  - Create a new book
  - Update book fields (description, copies, image)

---

## API Contract (expected)

The frontend expects a REST API at `/api/*`. In **development**, it talks to `http://localhost:3000/api/`. In **production (Vercel)**, it talks to relative `/api/`.

### Shared Response Types

```ts
type TBookResponse<T> = {
  success: boolean
  message: string
  booksCount?: number
  data?: T
  error?: unknown
}

type TBorrowResponse<T> = {
  success: boolean
  message: string
  data?: T
  error?: unknown
}
```

### Books

- `GET /api/books?author=&genre=&available=&sortBy=asc|desc&resultsPerPage=10|20|50|100&page=1`
  - Returns: `TBookResponse<TBookDb[]>`
  - `booksCount` contains the total count matching filters (for pagination).
- `GET /api/books/:bookId`
  - Returns: `TBookResponse<TBookDb>`
- `POST /api/books`
  - Body: `TBookNew`
  - Returns: `TBookResponse<TBookDb>`
- `PUT /api/books/:bookId`
  - Body: `Partial<TBookNew>`
  - Returns: `TBookResponse<TBookDb>`
- `GET /api/books/authors`
  - Returns: unique list of author names: `TBookResponse<string[]>`
- `GET /api/books/latest`
  - Returns latest 5 books: `TBookResponse<TBookDb[]>`
- `GET /api/books/popular?limit=5`
  - Returns top borrowed books. The Home page expects items with a nested `book`:
  ```ts
  // example shape used in src/components/pages/home.tsx
  type PopularItem = {
    totalQuantity: number
    book: TBookDb // must include _id, title, imageURI at minimum
  }
  // TBookResponse<PopularItem[]>
  ```

> If your backend returns a different shape, adapt the mapping in `home.tsx`.

### Borrow

- `GET /api/borrow`
  - Aggregated summary of borrows per title:
  ```ts
  type TBorrowedBook = {
    totalQuantity: number
    book: Pick<TBookNew, 'title' | 'isbn' | 'imageURI'>
  }
  // TBorrowResponse<TBorrowedBook[]>
  ```
- `POST /api/borrow`
  - Body:
  ```ts
  type TBorrow = {
    book: string // Book ObjectId
    quantity: number // >= 1
    dueDate: string // ISO Date
  }
  ```
- (Optional) `GET /api/borrow/popular?limit=5`
  - Alternative to `/api/books/popular` if you implement it here.

---

## Project Structure

```
src/
  components/
    elements/
      loader.tsx
    pages/
      home.tsx
      getBooks.tsx
      getABook.tsx
      createBook.tsx
      editBook.tsx
      borrowABook.tsx
      borrowSummary.tsx
    ui/                # shadcn/ui components (Form, Select, Button, etc.)
  features/
    booksQuery.ts      # RTK Query slice for books
    borrowQuery.ts     # RTK Query slice for borrow
  validations/
    books.validations.ts
    borrow.validation.ts
  lib/
    utils.ts
  App.tsx
  router.tsx
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (recommended)
- A backend server exposing the endpoints above:
  - **Dev:** `http://localhost:3000/api/*`
  - **Prod:** served under the same domain at `/api/*` (e.g., Vercel functions)

### Install

```bash
pnpm i
# or
npm i
# or
yarn
```

### Run Dev Server

```bash
pnpm dev
# or npm run dev
```

Vite will start on something like `http://localhost:5173`.

> Ensure your backend is running at `http://localhost:3000` with routes under `/api`, or configure a Vite proxy if needed.

### Build

```bash
pnpm build
# or npm run build
```

### Preview Production Build

```bash
pnpm preview
# or npm run preview
```

---

## Environment & Base URL

The RTK Query slices use:

```ts
baseUrl: import.meta.env.VERCEL_ENV === 'production'
  ? '/api/'
  : 'http://localhost:3000/api/'
```

- **Local dev:** no env needed; it will call `http://localhost:3000/api/`.
- **Vercel production:** it will call relative `/api/`.

If you deploy elsewhere, adjust the `baseUrl` in `booksQuery.ts` and `borrowQuery.ts` or map `/api` via a reverse proxy.

---

## Routes

Defined in `src/router.tsx`:

```
/                       → Home
/books                  → Books list (filters + pagination)
/books/:id              → Book details
/create-book            → Create a book
/edit-book/:id          → Edit a book
/borrow/:bookId         → Borrow a book
/borrow-summary         → Borrow summary
```

Routes (except Home) are **lazy-loaded** with `<Suspense fallback={<Loader />}>`.

---

## Data Flow

- **Fetching:** RTK Query hooks (e.g., `useGetBooksQuery`) encapsulate network requests.
- **Caching/Tags:** Endpoints provide or invalidate `['Books']` or `['Borrow']` tags to refetch on mutations.
- **Forms:** `react-hook-form` + `zod` validations ensure strong typing & UX.
- **Filters/Pagination:** `getBooks.tsx` keeps **URL** as the single source of truth (`page`, `resultsPerPage`, `sortBy`, etc.).

---

## Home Page

File: `src/components/pages/home.tsx`

- **Popular:** `useGetPopularBooksQuery()`  
  Expects `data` as array of items where each has a nested `book` (with `_id`, `title`, `imageURI`) and a `totalQuantity`.
- **Latest:** `useGetLatestBooksQuery()`

Both lists render using the same **card** markup used in the Books list page for visual consistency.

---

## Books List Page

File: `src/components/pages/getBooks.tsx`

- **FilterBox** syncs fields to `?author=&genre=&available=&sortBy=&resultsPerPage=&page=`.
- **Pagination** shows current ±2 pages, includes ellipses, and disables Prev/Next on edges.
- **Results per page** (10/20/50/100) resets `page` to 1 on change.
- **Sort** resets `page` to 1.

---

## Borrow Flow

- `BorrowABook` (`/borrow/:bookId`) posts `{ book: id, quantity, dueDate }`.
- On success, it navigates to `/books/:bookId`.
- `BorrowSummary` shows an aggregate list from `/api/borrow`.

---

## Development Tips

- **TypeScript JSX namespace:** Set `"jsx": "react-jsx"` and `"types": ["react"]` in `tsconfig.json` to avoid `Cannot find namespace 'JSX'` errors.
- **Indexes (backend):**
  - `borrow.book` (for popular aggregation)
  - `books.createdAt` (for latest)
- **Popular optimization:** Consider a `borrowCount` field on `Book` and increment it on each borrow. Then `/books/popular` becomes a simple indexed sort.

---

## Troubleshooting

- **CORS issues in dev:** Ensure your backend enables CORS for `http://localhost:5173` or use a Vite proxy.
- **Wrong popular payload shape:** If items don’t have `book._id`, adjust the backend projection or map the shape in `home.tsx`.
- **Empty authors list:** `/api/books/authors` uses an aggregation; ensure books exist and authors are strings.

---

## Roadmap

- Shared `BookCard` component used by both Home and Books pages (currently duplicated markup).
- Add skeleton loaders for better perceived performance.
- Add search by title.
- Authentication (admin-only create/edit).
- Infinite scroll for Books list.

---

## License

MIT (or your preferred license). Update this section as needed.
