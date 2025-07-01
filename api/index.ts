import express, { Request, Response } from 'express'

const port = process.env.PORT || 3000
const app = express()

app.all('/api', function (req: Request, res: Response) {
  res.json({ message: `API route is working!!!` })
})

app.listen(port, function () {
  console.log(`Server is running on PORT: ${port}`)
})
