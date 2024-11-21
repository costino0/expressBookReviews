const express = require('express');
let books = require("./booksdb.js"); // Assuming books data is stored in this file
const session = require('express-session');
const router = express.Router();

// For simplicity, we assume books are stored in this format:
const books = {
  "1": { title: "Book 1", reviews: [] },
  "2": { title: "Book 2", reviews: [] },
};

// Define the route for adding/reviewing a book using query params
router.put('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const review = req.query.review; // Retrieve the review from query params
    const username = req.session.username; // Assuming the username is stored in the session

    // Ensure the review exists in the query
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
        return res.status(200).json({ message: "Review updated successfully." });
    } else {
        // Add a new review for the book if the user hasn't reviewed it before
        books[isbn].reviews.push({ username, review });
        return res.status(200).json({ message: "Review added successfully." });
    }
});

module.exports.authenticated = router;
