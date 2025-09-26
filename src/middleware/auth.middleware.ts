import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../types/express';

export default function validateToken(req: Request, res: Response, next: NextFunction) {
    const unauthorized = () => res.status(401).json({ errorMessage: "Unauthorized" });
    console.log(req.headers)
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(400).json({ errorMessage: "Authorization header is missing" });
    }

    // Expect "Bearer <token>"
    const [scheme, authToken] = authHeader.split(" ");
    if (scheme !== "Bearer" || !authToken){
        return res.status(400).json({ errorMessage: "Auth header has wrong shape or no token" });
        // return unauthorized();
    } 

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
        console.error("TOKEN_SECRET is not defined");
        return res.status(500).json({ errorMessage: "Server misconfiguration: TOKEN_SECRET is not set" });
        // return unauthorized();
    }

    try {
        const payload = jwt.verify(authToken, tokenSecret) as MyJwtPayload;
        req.payload = payload // passing the payload to the route so it can be used for the functionality
        
        next() // continue with the route

    } catch (error) {
        console.warn("JWT verification failed:", (error as Error).message);
        res.status(401).json({errorMessage: "Invalid or expired token"})
    }
}
function validateAdminRole(req: Request, res: Response, next: NextFunction) {

  if (req.payload && req.payload.role === "admin") {
    next() // continue to the route
  } else {
    res.status(401).json({errorMessage: "you are not an admin"})
  }

}
