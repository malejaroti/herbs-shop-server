import express, {type Application} from "express";

// ℹ️ Logs incoming requests and responses to the terminal (useful for debugging)
import logger from "morgan";

// ℹ️ Allows the server to accept requests from different origins (e.g., frontend apps)
// CORS (Cross-Origin Resource Sharing) enables secure cross-origin requests.
import cors from "cors";

import cookieParser from "cookie-parser";

// Middleware configuration
export default function config(app : Application) {
    
    // ℹ️ Enables Express to trust reverse proxies (e.g., when deployed behind services like Heroku, Vercel, or Fly, which have a `proxy`,so  express needs to know that it should trust that setting)
    app.set("trust proxy", 1);
  
    // ℹ️ Configures CORS to allow requests only from the specified origin
    const allowedOrigins =
    (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map(s => s.trim())
        .filter((v): v is string => !!v);

    app.use(
        cors({
            // origin: allowedOrigins
            origin: process.env.ORIGIN
        })
    );
  
    // ℹ️ Logs requests in the development environment
    app.use(logger("dev")); 

    // ℹ️ Parses incoming JSON requests
    app.use(express.json()); 

    // ℹ️ Parses incoming request bodies with URL-encoded data (form submissions)
    app.use(express.urlencoded({ extended: false }));

    app.use(cookieParser());
  
};
