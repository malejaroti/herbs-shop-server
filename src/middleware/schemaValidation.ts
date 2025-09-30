import type { ZodType , ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateBody<T>(schema: ZodType <T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const zerr: ZodError = parsed.error;
      // You can return flatten() or map it to your own structure
      return res.status(400).json({ errors: zerr.flatten() });
    }
    // attach parsed data so route can use the already-typed DTO
    req.validatedBody = parsed.data;
    return next();
  };
}
