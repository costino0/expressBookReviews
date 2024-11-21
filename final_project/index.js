const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure session middleware for "/customer"
app.use(
    "/customer",
    session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })
);

// Middleware for authentication
app.use("/customer/auth/*", function auth(req, res, next) {
    try {
        // Retrieve token from session
        const token = req.session.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Access token is missing. Please log in." });
        }

        // Verify the token
        jwt.verify(token, "your_secret_key", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            // Attach user data to the request for subsequent handlers
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Authentication failed.", error: error.message });
    }
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
