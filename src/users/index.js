import express from 'express'
import {check, validationResult} from 'express-validator'
import uniqid from 'uniqid'
import {readUsers, writeUsers, readUserPicDB, writeUserPictures, writeUserPicDB} from '../lib/fs-tools.js'
import multer from "multer"



const router =express.Router()

router.get("/", async (req, res, next) => {
  try {
    const users = await readUsers()
    console.log(users)
    console.log(req.query)
    if(req.query && req.query.name) {
      const filteredUser = users.filter((user) => user.hasOwnProperty('name') && user.name.toLowerCase() === req.query.name.toLowerCase())
      console.log(filteredUser)
      if(filteredUser.length > 0){
        res.status(200).send(filteredUser)
      } else {
        res.status(200).send(users)  
      }
    } else {
      res.status(200).send(users)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
   const users = await readUsers()
   const selectedUser = users.find(user => user.userId === req.params.id)
   if (selectedUser){
     res.send(selectedUser)
   } else {
     const err = new Error ("User not found!")
     err.httpStatusCode = 404
     next(err)
   }
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.post("/", [check("name").exists().withMessage("Input a name!").isLength({min : 2}).withMessage("In put invalid!"), check("email").exists().withMessage("Input an email!").isEmail().withMessage("Input a valid email!")], async(req, res, next) => {
  try {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      const users = await readUsers()
      const newUser = {...req.body, userId: uniqid()}
      users.push(newUser)
      await writeUsers(users)
      res.status(201).send({ msg : "data uploaded!"})
    } else {
      res.status(400).send(errors)
    }
  } catch (error) {
    error.httpStatusCode = 500
    next(error)
  }
})

router.put("/:id", async(req, res, next) => {
  try {
    const users = await readUsers()
    const moddedUsers = users.filter(user => user.userID !== req.params.id)
    const moddedUser = {...req.body, userId: req.params.id, updatedAt: new Date()}
    
    moddedUsers.push(moddedUser)
    await writeUsers(moddedUsers)

    res.send(moddedUsers)
  } catch (error) {
      error.httpStatusCode = 500
      next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const users = await readUsers()
    const moddedUsers = users.filter(user => user.userId !== req.params.id)
    await writeUsers(moddedUsers)
    res.status(204).send()
  } catch (error) {
      error.httpStatusCode = 500
      next(error)
  }
})

router.get("/:userId/books", async (req, res, next) => {
  const books = await getBooks();

  const userId = req.params.userId;

  const selectedBooks = books.filter((book) => book.userid === userId);

  res.send(selectedBooks);
});

router.post("/:id/uploadPhoto", multer().single("userPic"), async (req, res, next) => {
  try {
    console.log(req.file)
    const users = await readUsers()
    const imgDB = await readUserPicDB()
    let selectedUser = users.filter(user => user.id === req.params.id)

    if(!selectedUser) {
      const err = new Error ("user ID not found!")
      err.httpStatusCode = 404
      next(err)
    }
    
    const { originalname, size } = req.file;
    const previewLink = `${req.protocol}://${req.hostname}:${process.env.PORT}/${originalname}`;
    const downloadLink = `${req.protocol}://${req.hostname}:${process.env.PORT}/files/${originalname}`;
    
    const name = originalname
    const kb = parseFloat((size/1024).toFixed(2))

    const dataProperty = {
      id : uniqid(),
      userId : req.params.id,
      name,
      previewLink,
      downloadLink,
      size: kb,
      unit: "kb",
      createdAt: new Date()
    }

    imgDB.push(dataProperty)

    await writeUserPictures(req.file.originalname, req.file.buffer)

    await writeUserPicDB(imgDB)
    res.send(imgDB)

  } catch (error) {
    console.log(error) 
    next(error)
  }
})

export default router