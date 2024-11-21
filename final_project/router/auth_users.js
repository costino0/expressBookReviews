const express = require('express');
const session = require('express-session');
const books = require('./booksdb.js');  // Import books data from booksdb.js
const router = express.Router();

let users = [];  // Store users (username and password)

// Registration route to create a new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Add the new user to the users array
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully!" });
});

// Login route for user authentication
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username exists and the password matches
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Set the username in the session
        req.session.username = username;
        return res.status(200).json({ message: "Customer successfully logged in." });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Route for adding or modifying book reviews using query params
router.put('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review;  // Get the review from query params
    const username = req.session.username;  // Get the username from session

    // Ensure review exists in the query
    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Check if book exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Ensure user is logged in
    if (!username) {
        return res.status(401).json({ message: "Please log in to add a review." });
    }

    // Check if the user has already reviewed this book
    const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

    if (existingReviewIndex > -1) {
        // Modify existing review
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been updated.` });
    } else {
        // Add new review if it's the first time the user is reviewing the book
        books[isbn].reviews.push({ username, review });
        return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added.` });
    }
});

module.exports.authenticated = router;
