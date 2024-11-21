const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username is valid (i.e., exists in the users array)
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to check if the username and password match a user in the records
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password;
};

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = "your_jwt_secret_key"; 

// Login route - only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username exists and password matches
    if (isValid(username) && authenticatedUser(username, password)) {
        // Generate JWT token with user details
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        // Send back the token as a response
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Middleware to check if the user is authenticated using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user;
        next(); // Proceed to the next route handler
    });
};

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty." });
    }

    if (books[isbn]) {
        // Add the review to the book's reviews
        if (!books[isbn].reviews) {
            books[isbn].reviews = [];
        }
        books[isbn].reviews.push({ username: req.user.username, review });

        return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
