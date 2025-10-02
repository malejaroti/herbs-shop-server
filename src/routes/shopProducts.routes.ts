import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db'
import * as z from "zod"; 
import { validateBody } from '../middleware/schemaValidation';
import { CreateProductSchema, type CreateProductDTO } from '../zodSchemas/product.schema';
import { validateParams } from '../middleware/reqParamsValidation';
import { CreateProductVariant_body, CreateProductVariantBodySchema, CreateProductVariantDTO, CreateProductVariantSchema } from '../zodSchemas/productVariant.schema';

const router = Router()

const productIdParams = z.object({
  productId: z.string().cuid(),
});
const slugParams = z.object({
  slug: z.string()
});

// GET /api/shop/products - Get all active products with the cheapest variant (to display an initial product price)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await prisma.product.findMany({
        where: { active: true },
        orderBy: [
          {
            name: 'asc',
          },
        ],
        include: {
            variants: {
                where: { active: true },
                orderBy: { price: 'asc' },
                take: 1,
            },
        },
    })
    res.status(200).json(allProducts)
  } catch (error) {
    next(error)
  }
})

// GET /api/products/:slug - Get one product with all variants
router.get('/:slug',  validateParams(slugParams), async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params as { slug: string }; 
  try {
    const response = await prisma.product.findUnique({ 
      where: { slug }, 
      include: { 
        variants: {
          where: { active: true },
          orderBy: { price: 'asc' },
        }
      } 
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
})

const shopProductsRouter = router
export default shopProductsRouter