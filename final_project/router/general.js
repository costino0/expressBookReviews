const express = require('express');
const books = require('./booksdb.js'); // Import your mock books database
const public_users = express.Router();

// Route to get the list of books available in the shop
public_users.get('/books', (req, res) => {
    try {
        // Return all the books as a JSON response
        res.json(books);
    } catch (error) {
        console.error("Error fetching books: ", error);
        res.status(500).send("Error fetching books.");
    }
});

module.exports.general = public_users;
