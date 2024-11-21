const express = require('express');
const axios = require('axios'); // If you want to fetch data using Axios in real scenarios
const books = require('./booksdb.js'); // Mock book data
const public_users = express.Router();

// Route to get all books available in the shop
public_users.get('/books', async (req, res) => {
    try {
        res.json(Object.values(books)); // Sending all books from the mock database
    } catch (error) {
        res.status(500).json({ message: "Error fetching books." });
    }
});

// Route to get book details based on ISBN
public_users.get('/books/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN." });
    }
});

// Route to get books by title
public_users.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title." });
        }

        res.json(filteredBooks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title." });
    }
});

// Route to get books by author
public_users.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;

    try {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));

        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found by this author." });
        }

        res.json(filteredBooks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author." });
    }
});

module.exports.general = public_users;
