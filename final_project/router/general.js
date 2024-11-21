const express = require('express');
const axios = require('axios'); // Axios to make HTTP requests
const books = require('./booksdb.js'); // Import the mock book data
const public_users = express.Router();

// Route to get the list of books available in the shop
public_users.get('/books', (req, res) => {
    try {
        res.json(books); // Return all books
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Error fetching books.");
    }
});

// Route to get the details of a book based on ISBN (using async/await)
public_users.get('/books/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        // Here we're checking if the book exists in the mock database first
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found." });
        }

        // If the book is found, return the details
        const bookDetails = books[isbn];
        res.json(bookDetails);
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).json({ message: "Error fetching book details." });
    }
});

module.exports.general = public_users;
