import { Router, Request, Response, NextFunction } from "express";
import {validateToken, validateAdminRole} from '../middleware/auth.middleware';
import authRouter from "../routes/auth.routes"
import productsRouter from "./adminProducts.routes"
import shopProductsRouter from "./shopProducts.routes";


const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.use("/auth", authRouter)
router.use('/shop/products', shopProductsRouter); // public
router.use("/admin/products", validateToken, validateAdminRole, productsRouter )
// router.use("/products", productsRouter )

export default router