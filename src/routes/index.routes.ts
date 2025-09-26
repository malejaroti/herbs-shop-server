import { Router, Request, Response, NextFunction } from "express";
import validateToken from '../middleware/auth.middleware';
import authRouter from "../routes/auth.routes"


const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.use("/auth", authRouter)
export default router