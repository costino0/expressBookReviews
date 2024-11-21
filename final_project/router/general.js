const express = require('express');
const axios = require('axios');  // Import axios for HTTP requests
const books = require('./booksdb.js');  // Mock book data
const public_users = express.Router();

// Route to get books based on the author's name (using async/await)
public_users.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;

    try {
        // Filter the books by author name (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found by this author." });
        }

        // If books are found, return them
        res.json(filteredBooks);
    } catch (error) {
        console.error("Error fetching books by author:", error);
        res.status(500).json({ message: "Error fetching books by author." });
    }
});

module.exports.general = public_users;
