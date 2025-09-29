import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db'
import * as z from "zod"; 
import { validateBody } from '../middleware/schemaValidation';
import { CreateProductSchema, type CreateProductDTO } from '../zodSchemas/product.schema';
// const prisma = require('../db')

const router = Router()

type ProductImageDto = {
  url: string;
  alt: string;
};

interface ICreateProductDto{
  name: string;
  slug: string;
  latinName: string;
  bulkGrams: number;
  reorderAtGrams: number;
  descriptionMd: string;
  originCountry: string;
  organicCert: string;
  active: boolean;
  variants: [];
  categories: string[];
  images: ProductImageDto[];
}

//POST /api/products - Create a new product
router.post("/", validateBody(CreateProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  console.log("Request body (new product data):", req.body);
  const dto = (req as any).validatedBody as CreateProductDTO;
  const newProduct = {
      name: dto.name,
      slug: dto.slug,
      latinName: dto.latinName ?? null,
      bulkGrams: dto.bulkGrams,
      reorderAtGrams: dto.reorderAtGrams ?? null,
      descriptionMd: dto.descriptionMd ?? null,
      originCountry: dto.originCountry ?? null,
      organicCert: dto.organicCert ?? null,
      active: dto.active,
  }
  
  try {
    // Product name should be unique
    const foundProduct = await prisma.product.findFirst({ where: { name: dto.name } })
    if(foundProduct){
      res.status(409).json({errorMessage: "Product cannot be created because there is already one with that name"})
      return;
    }

    const created = await prisma.product.create( {data: newProduct} )
    console.log("Created: ", created)
    res.status(201).json(created)

  } catch (error: any) {
    next(error);
  }
});

// GET all Products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await prisma.product.findMany()
    res.status(200).json(allProducts)
  } catch (error) {
    next(error)
  }
})

// GET one product
router.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
  try {
    const response = await prisma.product.findUnique({where:{id : productId}})
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

// UPDATE the description of one product
router.patch('/:productId', async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
    const updatedDescription = req.body
  try {
    const foundFoundation = await prisma.product.findUnique({where:{id : productId}})
    const updatedFoundations = {
        ... foundFoundation.data,
        "description" : updatedDescription
    }
    const response = await prisma.product.update({where:{id : productId}, data: updatedDescription})
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

// UPDATE several fields of one product
router.patch('/:productId', async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params
    const updates = req.body

  try {
    const foundFoundation = await prisma.product.findUnique({where:{id : productId}})
    const updatedFoundations = {
        ... foundFoundation.data,
        ...updates,
    }
    const response = await prisma.product.update({where:{id : productId}, data: updates})
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

// DELETE one product
router.delete('/:productId', async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params

  try {
    const response = await prisma.product.delete({where:{id : productId}})
    res.status(204).json(response)
  } catch (error) {
    next(error)
  }
})


const productsRouter = router
export default productsRouter