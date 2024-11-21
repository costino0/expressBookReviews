const express = require('express');
const session = require('express-session');
const books = require('./booksdb.js');
const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;  // Get username and password from the request body
    
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    // Here you can store users in a database or memory. For now, we'll store it in the session.
    req.session.username = username;  // Store username in session
    
    res.status(200).send("User registered successfully!");
});

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (req.session.username === username) {
        return res.status(200).send("User already logged in.");
    }
    
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    req.session.username = username;  // Set session username on login
    
    res.status(200).send("User logged in successfully!");
});

// Route to add a review
router.put('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review;
    const username = req.session.username;

    if (!username) {
        return res.status(401).send("Please log in to add a review.");
    }

    if (!review) {
        return res.status(400).send("Review text is required.");
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
    
    if (existingReviewIndex > -1) {
        // Modify the existing review
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been updated.`);
    } else {
        // Add a new review
        books[isbn].reviews.push({ username, review });
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added.`);
    }
});

// Route to delete a review
router.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const username = req.session.username;

    if (!username) {
        return res.status(401).send("Please log in to delete your review.");
    }

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    const reviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

    if (reviewIndex === -1) {
        return res.status(404).send("Review not found.");
    }

    // Remove the review
    books[isbn].reviews.splice(reviewIndex, 1);
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted.`);
});

module.exports.authenticated = router;
