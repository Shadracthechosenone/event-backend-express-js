import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          message: "Validation échouée",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      req.body = result.data;
      next();
    };


// le user schema pour la verification de la validation des données d'un utilisateur

export const registerSchema = z.object({
  name: z.string()
    .min(1, "Le nom est requis")
    .transform((val) => val.trim()),

  email: z.email({ error: "L'email doit être valide" })
    .transform((val) => val.trim().toLowerCase())
  ,

  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});


export const loginSchema = z.object({
  email: z.email({ error: "L'email doit être valide" }),

  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;


