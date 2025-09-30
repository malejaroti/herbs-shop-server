import { JwtPayload } from "jsonwebtoken";
import { Role } from "../generated/prisma";

interface MyJwtPayload extends JwtPayload {
  user_id: string;
  role: Role;
}

declare global {
  namespace Express {
    export interface Request {
      payload?: MyJwtPayload;
      validatedBody?: unknown;
    }
  }
}