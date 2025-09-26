// require("dotenv").config();
// import configDotEnv from "dotenv"
import 'dotenv/config'
import express from 'express';
import handleErrors from './error-handling';
import config from './config';
import router from './routes/index.routes';

// Initialize the server
const app = express();

// Load and apply global middleware (CORS, JSON parsing, etc.) for server configurations
config(app);

// Define and apply route handlers
app.use("/api", router);

// Centralized error handling (must be placed after routes)
handleErrors(app);

// Define the server port (default: 5005)
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
