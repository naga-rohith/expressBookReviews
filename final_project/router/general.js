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

public_users.get('/', async function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  });
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      booksByTitle[isbn] = books[isbn];
    }
  });
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).json(booksByTitle);
  }
  return res.status(404).json({ message: "No books found with this title" });
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