// MODULE IMPORTS
import { connect } from 'mongoose'

// CONNECT TO DATABASE
export default async function connectDb(uri: string) {
  try {
    await connect(uri /*, { autoIndex: false }*/)

    console.log(`Connected to MongoDB...`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
