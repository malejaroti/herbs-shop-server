// src/middlewares/validateParams.ts
import { z, type ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateParams = <S extends ZodType>(schema: S) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.params);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.flatten() });
    }
    // overwrite with parsed+typed value
    req.params = parse.data as any;
    next();
  };
