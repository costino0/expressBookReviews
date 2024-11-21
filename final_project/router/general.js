const express = require('express');
let books = require('./booksdb.js');  // Assuming this file contains your books data
const public_users = express.Router();

// Route for retrieving book details
public_users.get('/', function (req, res) {
    return res.status(200).json({ books });
});

// Get book review (public)
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews || { message: "No reviews available." });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
