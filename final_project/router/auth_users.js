const express = require('express');
const session = require('express-session');
const books = require("./booksdb.js"); // Correctly import books from booksdb.js
const router = express.Router();

// Route to register a user (assuming this is part of your system)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Ensure both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // For simplicity, assuming user is added
    req.session.username = username;  // Store the username in session
    res.status(200).json({ message: "User registered successfully." });
});

// Route for adding/reviewing a book using query params
router.put('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review; // Retrieve the review from query params
    const username = req.session.username; // Assuming the username is stored in the session

    // Ensure user is logged in (username should be in the session)
    if (!username) {
        return res.status(401).json({ message: "You must be logged in to add a review." });
    }

    // Ensure the review exists in the query params
    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Check if the book exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user already reviewed the book
    const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

    if (existingReviewIndex > -1) {
        // Modify the existing review if the user has already reviewed this book
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been updated.`);
    } else {
        // Add a new review for the book if the user hasn't reviewed it before
        books[isbn].reviews.push({ username, review });
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added.`);
    }
});

// Route to delete a review by ISBN and username
router.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const username = req.session.username;

    // Ensure the user is logged in
    if (!username) {
        return res.status(401).json({ message: "You must be logged in to delete a review." });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Find and delete the user's review
    const reviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
    if (reviewIndex > -1) {
        books[isbn].reviews.splice(reviewIndex, 1);
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted.`);
    } else {
        return res.status(404).json({ message: "No review found for this user." });
    }
});

module.exports.authenticated = router;
