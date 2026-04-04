// src/types/authRequest.ts
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}