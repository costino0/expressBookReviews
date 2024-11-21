const express = require('express');
let books = require('./booksdb.js'); // Assuming this file contains your books data
const public_users = express.Router();

// Add or modify a book review (using query params for review)
public_users.put('/auth/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const review = req.query.review;  // Get review from query parameters
    const username = req.session.username;

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user already has a review for this ISBN
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

module.exports.general = public_users;
