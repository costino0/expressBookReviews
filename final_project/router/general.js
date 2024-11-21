const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Add new user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params; // Extract ISBN from request parameters
    const book = books[isbn]; // Find the book in the database by ISBN

    if (book) {
        return res.status(200).json(book); // Return book details if found
    } else {
        return res.status(404).json({ message: "Book not found." }); // Error if not found
    }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found for the specified author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with the specified title." });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews || { message: "No reviews available." });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
