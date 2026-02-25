const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists! Please log in." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Task 10: Get all books using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((allBooks) => {
    return res.status(200).json(allBooks);
  })
  .catch((err) => {
    return res.status(500).json({ message: "Error retrieving books" });
  });
});

// Task 11: Get book by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      const result = books[isbn];
      if (result) resolve(result);
      else reject("Book not found");
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get books by Author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      const result = {};
      Object.keys(books).forEach(isbn => {
        if (books[isbn].author === author) {
          result[isbn] = books[isbn];
        }
      });
      if (Object.keys(result).length > 0) resolve(result);
      else reject("No books found for this author");
    });
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get books by Title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await new Promise((resolve, reject) => {
      const result = {};
      Object.keys(books).forEach(isbn => {
        if (books[isbn].title === title) {
          result[isbn] = books[isbn];
        }
      });
      if (Object.keys(result).length > 0) resolve(result);
      else reject("No books found with this title");
    });
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;