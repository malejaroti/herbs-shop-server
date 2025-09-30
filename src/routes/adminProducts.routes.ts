import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db'
import * as z from "zod"; 
import { validateBody } from '../middleware/schemaValidation';
import { CreateProductSchema, ProductSchema, type CreateProductDTO } from '../zodSchemas/product.schema';
import { validateParams } from '../middleware/reqParamsValidation';
import { CreateProductVariant_body, CreateProductVariantBodySchema, CreateProductVariantDTO, CreateProductVariantSchema } from '../zodSchemas/productVariant.schema';

const router = Router()

const productIdParams = z.object({
  productId: z.string().cuid(),
});

//POST /api/products - Create a new product
router.post("/", validateBody(CreateProductSchema), async (req: Request, res: Response, next: NextFunction) => {
  console.log("Request body (new product data):", req.body);
  const dto = req.validatedBody as CreateProductDTO;
  const newProduct = {
      name: dto.name,
      slug: dto.slug,
      latinName: dto.latinName ?? null,
      bulkGrams: dto.bulkGrams,
      reorderAtGrams: dto.reorderAtGrams ?? null,
      descriptionMd: dto.descriptionMd ?? null,
      originCountry: dto.originCountry ?? null,
      organicCert: dto.organicCert ?? null,
      images: dto.images ?? null,
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

const generateSKU = (productName: string, variantName: string): string => {
  const prodCode = productName.slice(0,4)
  const variantCode = variantName 
  return `${prodCode}-${variantCode}`;
}

//POST /api/products/:productId/variants - Create a new product variamt
router.post("/:productId/variants", validateBody(CreateProductVariantBodySchema), async (req: Request, res: Response, next: NextFunction) => {
  console.log("Request body (new product variant):", req.validatedBody);
  const {name: variantName} = req.validatedBody as CreateProductVariant_body
  const { productId } = req.params as { productId: string }; 
  console.log("ProductId (from params): ", productId);
  
  try {
    // Find product with given id
    const foundProduct = await prisma.product.findUnique({ where: { id: productId } })
    console.log("FoundProduct: ", foundProduct)
    
    if (!foundProduct || !foundProduct.name) {
      res.status(404).json({ errorMessage: "Product not found or missing name" });
      return;
    }
    const SKU = generateSKU(foundProduct.name, variantName)
    console.log("Generated SKU: ", SKU)
    
    const newProductVariant: CreateProductVariantDTO = {
      ...req.validatedBody as CreateProductVariant_body,
      sku: SKU,
      productId
    }
    try {
      // Variant name should be unique
      const exists = await prisma.productVariant.findFirst({ where: { productId, name: newProductVariant.name }});
      if (exists) return res.status(409).json({ message: `Variant "${newProductVariant.name}" already exists for this product.` });
  
      const created = await prisma.productVariant.create( {data: newProductVariant} )
      console.log("Created: ", created)
      res.status(201).json(created)
  
    } catch (error: any) {
      console.log(error)
      next(error);
    }
    
  } catch (error: any) {
    console.log(error)
    next(error);
  }
});

// GET /api/admin/products - Get all Products with variant details
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: [{ active: 'desc' }, { price: 'asc' }],
        },
      }
    })
    res.status(200).json(allProducts)
  } catch (error) {
    next(error)
  }
})

// GET /api/products/:productId - Get one product
router.get('/:productId',  validateParams(productIdParams), async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params as { productId: string }; 
  try {
    const response = await prisma.product.findUnique({ where: { id: productId } });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
})

// UPDATE api/admin/products/:productId - Update several fields of one product
router.patch('/:productId', validateParams(productIdParams), async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params as { productId: string }; 
    const updates = req.body

  try {
    const foundProduct = await prisma.product.findUnique({where:{id : productId}})
    if(!foundProduct){
      return res.status(400).json({error: "There is no product with that Id" })
    }
    const updatedProduct = {
        ... foundProduct,
        ...updates,
    }
    const validatedUpdates = ProductSchema.safeParse(updatedProduct);
    if (!validatedUpdates.success) {
        const zerr: z.ZodError = validatedUpdates.error;
        return res.status(400).json({ errors: zerr.flatten() });
    }

    const response = await prisma.product.update({where:{id : productId}, data: updates})
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

// DELETE api/products/:productId - Delete one product
router.delete('/:productId', validateParams(productIdParams), async (req, res, next) => {
    const {productId} = req.params as { productId: string }; 

  try {
    const response = await prisma.product.delete({where:{id : productId}})
    res.status(204).json(response)
  } catch (error) {
    next(error)
  }
})


const productsRouter = router
export default productsRouter