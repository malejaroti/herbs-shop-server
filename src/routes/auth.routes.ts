import express from "express"
import { Request, Response, NextFunction, Router} from 'express';
import {validateToken} from '../middleware/auth.middleware';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../db";
import { User } from "../generated/prisma";
import { MyJwtPayload } from "../types/express";

const router = Router();

//POST "/api/auth/signup" -> Register information about the user (including credentials)
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body as User;

  //validation
  // all the info is received or is not empty (email, password, username)
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ errorMessage: "Username , email and passwords are mandatory" });
    return; // stop the execution of the route
  }

  // Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ errorMessage: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character." });
    return;
  }

  // Email validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ errorMessage: "Provide a valid email address." });
    return;
  }

  try {
    // Check if there isn't another user with that same email
    const foundUser = await prisma.user.findUnique({where:{ email }});
    if (foundUser !== null) {
      res.status(409).json({ errorMessage: "An account with this email already exists" });
      return;
    }

    // If email is unique, proceed to hash the password
    const saltRounds = 12; // How many rounds should bcrypt run the salt
    const hashPassword = await bcrypt.hash(password, saltRounds); 

    const response = await prisma.user.create({ data: req.body});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => verify the credentials of the user and send a token
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.status(400).json({ errorMessage: "Email and passwords are mandatory" });
    return; // stop the execution of the route
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // res.status(200).json({errorMessage: "Password correct"})
      // Deconstruct the user object to omit the password
      const { id, role } = foundUser;
      console.log("foundUser:", foundUser);

      // Create an object that will be set as the token payload
      const payload: MyJwtPayload= { user_id: id, role };
      // console.log("payload:",payload)

      // Ensure TOKEN_SECRET is defined
      const tokenSecret = process.env.TOKEN_SECRET;
      if (!tokenSecret) {
        throw new Error("TOKEN_SECRET environment variable is not defined");
      }
      // Create and sign the token
      const authToken = jwt.sign(payload, tokenSecret, { algorithm: "HS256", expiresIn: "2w" });

      // Send the token as the response
      res.status(200).json({ authToken: authToken });
    }
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Validate the token and send the info of the user who logged in (functionality only for the frontend)
router.get("/verify", validateToken, (req: Request, res: Response) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
});

const authRouter = router
export default authRouter
