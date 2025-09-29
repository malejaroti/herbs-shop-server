import { Router, Request, Response, NextFunction } from "express";
import {validateToken, validateAdminRole} from '../middleware/auth.middleware';
import authRouter from "../routes/auth.routes"
import productsRouter from "../routes/products.routes"


const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.use("/auth", authRouter)
router.use("/products", validateToken, validateAdminRole, productsRouter )

export default router