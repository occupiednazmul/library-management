// MODULE IMPORTS
import { useParams } from 'react-router'

// GET A BOOK
export default function GetABook() {
  return <div>Getting book: {useParams().id}</div>
}
