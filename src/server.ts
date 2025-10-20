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
const PORT = Number(process.env.PORT)

// Start server with explicit error handling
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// More explicit startup error reporting (e.g., port already in use)
server.on('error', (err: any) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\n✖ Port ${PORT} is already in use.\n` +
      `• Either stop the other process using it, or set a different PORT env var.\n` +
      `• Example (bash): PORT=${PORT + 1} npm run dev`);
  } else if (err && err.code === 'EACCES') {
    console.error(`\n✖ Permission denied trying to bind to port ${PORT}. Try a higher port (>1024) or run with proper permissions.`);
  } else {
    console.error('\n✖ Server failed to start due to unexpected error:\n', err);
  }
  // Ensure watcher restarts or process exits cleanly so user notices
  process.exit(1);
});

// Optional: catch unhandled promise rejections / exceptions to avoid silent exits
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
