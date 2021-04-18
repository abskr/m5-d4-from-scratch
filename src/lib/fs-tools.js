import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const {readJSON, writeJSON, writeFile} = fs

const pathTojsondataFolder = join(dirname(fileURLToPath(import.meta.url)), '../jsondata')
const usersImgPubFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/users")
const booksImgPubFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/books")

export const readUsers = async () => await readJSON(join(pathTojsondataFolder, 'users.json'))
export const writeUsers = async (content) => await writeJSON(join(pathTojsondataFolder, 'users.json'), content)

export const readBooks = async () => await readJSON(join(pathTojsondataFolder, 'books.json'))
export const writeBooks = async (content) => await writeJSON(join(pathTojsondataFolder, 'books.json'), content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))


export const readUserPicDB = async () => await readJSON(join(pathTojsondataFolder, 'imgProps.json'))
export const writeUserPictures = async (fileName, content) => await writeFile(join(usersImgPubFolderPath, fileName), content)
export const writeUserPicDB = async (content) => await writeJSON(join(pathTojsondataFolder, 'imgProps.json'), content)

export const writeBookPictures = async (fileName, content) => await writeFile(join(booksImgPubFolderPath, fileName), content)