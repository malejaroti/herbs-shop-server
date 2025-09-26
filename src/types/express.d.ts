import { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  user_id: string;
  role: "admin" | "user";
}

declare global {
  namespace Express {
    export interface Request {
      payload?: MyJwtPayload;
    }
  }
}