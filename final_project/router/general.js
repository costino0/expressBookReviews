const express = require('express');
const axios = require('axios');  // Import axios for HTTP requests
const books = require('./booksdb.js');  // Mock book data
const public_users = express.Router();

// Route to get books based on the title (using async/await)
public_users.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        // Filter the books by title name (case-insensitive)
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title." });
        }

        // If books are found, return them
        res.json(filteredBooks);
    } catch (error) {
        console.error("Error fetching books by title:", error);
        res.status(500).json({ message: "Error fetching books by title." });
    }
});

module.exports.general = public_users;
