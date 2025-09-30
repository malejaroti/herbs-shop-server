import { z } from "zod";
import { Prisma } from "../generated/prisma";

export const CurrencyEnum = z.enum(["EUR"]); 
export const TaxClassEnum = z.enum(["STANDARD", "REDUCED", "EXEMPT"]); 


// Accepts "7.5", "7.50", 7.5, etc. → validates max 2 decimals → Prisma.Decimal
export const PriceSchema = z
  .union([z.number(), z.string().trim()])
  // normalize numbers to a string with 2 decimals; keep strings as-is
  .transform((v) => (typeof v === "number" ? v.toFixed(2) : v))
  // strictly max 2 decimals (and only digits + optional dot)
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), {
    message: "Price must be a number with up to 2 decimal places",
  })
  // convert to Prisma.Decimal
  .transform((v) => new Prisma.Decimal(v))
  // non-negative
  .refine((d) => d.comparedTo(0) >= 0, {
    message: "Price must be greater than or equal to 0",
  });


// Full schema (all fields, like Prisma model)
export const ProductVariantSchema = z.object({
  id: z.string().cuid(),
  productId: z.string().cuid(),
  sku: z.string().min(1),
  name: z.string().min(1), // e.g., "100 g"
  packSizeGrams: z.number().int().positive(),
  price: PriceSchema,
  currency: CurrencyEnum.default("EUR"),
  taxClass: TaxClassEnum.default("REDUCED"),
  active: z.boolean().default(true),
});

// Schema for creating a new product variant (DTO, what comes in req.body)
export const CreateProductVariantBodySchema = ProductVariantSchema.omit({
  id: true,
  productId: true,
  sku: true
});

export const CreateProductVariantSchema = ProductVariantSchema.omit({
  id: true,
});

export type CreateProductVariant_body = z.infer<typeof CreateProductVariantBodySchema>;
export type CreateProductVariantDTO = z.infer<typeof CreateProductVariantSchema>;