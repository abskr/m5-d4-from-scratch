import express from 'express'
import listEndpoints from 'express-list-endpoints'
import userRoutes from './users/index.js'
import bookRoutes from './books/index.js'
import { getCurrentFolderPath } from "./lib/fs-tools.js"
import { join } from 'path'
import cors from 'cors'

const server = express()
const port = process.env.PORT || 3001

const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")

server.use(express.static(publicFolderPath))

server.use(cors())
server.use(express.json())
server.use('/users', userRoutes)
server.use('/books', bookRoutes)

console.log(listEndpoints(server))
server.listen(port, () => {
  console.log('Server running on port ', port)
})