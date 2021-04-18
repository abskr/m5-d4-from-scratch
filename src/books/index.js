import express from 'express'
import {check, validationResult} from 'express-validator'
import uniqid from 'uniqid'
import {readBooks, writeBooks} from '../lib/fs-tools.js'

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    const books = await readBooks()
    if (req.query && req.query.name) {
      const filteredBook = books.filter((book) => book.hasOwnProperty('name') && book.name.toLowerCase() === req.query.name.toLowerCase())
      //console.log(filteredBook)
      if (filteredBook.length > 0) {
        res.status(200).send(filteredBook)
      } else {
        res.status(200).send(books)
      }
    } else {
      res.status(200).send(books)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/:isbn', async (req, res, next) => {
  try {
    const books = await readBooks()
    const selectedBook = books.find(book => book.isbn === req.params.isbn)
    if (selectedBook) {
      res.send(selectedBook)
    } else {
      const err = new Error("Book not found!")
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.post("/", [check("name").exists().withMessage("Input a name!"), check("isbn").exists().withMessage("Input ISBN!").isISBN().withMessage("Input a valid ISBN!")], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const books = await readBooks()
      const newBook = req.body
      
      books.push(newBook)
      await writeBooks(books)
      res.status(201).send({
        msg: "data uploaded!"
      })
    } else {
      res.status(400).send(errors)
    }
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.put("/:isbn", async (req, res, next) => {
  try {
    const books = await readBooks()
    
    const moddedBooks = books.filter(book => book.isbn !== req.params.isbn)
    const moddedBook = {
      ...req.body,
      isbn: req.params.isbn,
      updatedAt: new Date()
    }

    moddedBooks.push(moddedBook)
    await writeBooks(moddedBooks)

    res.send(moddedBooks)
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.delete("/:isbn", async (req, res, next) => {
  try {
    const books = await readBooks()
    const moddedBooks = books.filter(book => book.isbn !== req.params.isbn)
    await writeBooks(moddedBooks)
    res.status(204).send()
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

//router.post ("/isbn/")

export default router