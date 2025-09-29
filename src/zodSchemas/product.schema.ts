import { z } from "zod";

const OrganicCertSchema = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.string()
    .trim()
    .regex(/^([A-Z]{2})-(ÖKO|OEKO)-\d{3}$/, "Expected like DE-ÖKO-001")
    .max(50)
    .nullable()
);

const ImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1).max(160),
});

const VariantSchema = z.object({
  sku: z.string().min(1),
  label: z.string().min(1),        // e.g. "100 g"
  grams: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

// If ProductCategory is a Prisma enum, mirror the options here:
export const ProductCategoryEnum = z.enum(["HERBS","SPICES"]);

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(120).transform(s => s.trim()),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes"),
  latinName: z.string().max(140).optional(),
  bulkGrams: z.number().int().min(0),
  reorderAtGrams: z.number().int().min(0).optional(),
  descriptionMd: z.string().max(20_000).optional(),
  originCountry: z.string().max(80).optional(),
  organicCert: OrganicCertSchema,
  active: z.boolean().default(true),
  variants: z.array(VariantSchema).default([]),
  categories: z.array(ProductCategoryEnum).min(1),
  images: z.array(ImageSchema).default([]),  // maps to Prisma Json
}).superRefine((d, ctx) => {
  if (d.active && d.variants.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["variants"],
      message: "Active products must have at least one variant.",
    });
  }
  if (d.reorderAtGrams !== undefined && d.reorderAtGrams >= d.bulkGrams) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["reorderAtGrams"],
      message: "reorderAtGrams should be less than bulkGrams.",
    });
  }
});

// This line tells TS: Generate a type CreateProductDTO from whatever rules I defined in CreateProductSchema.
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
