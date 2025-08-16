import { z } from "zod";

export const formSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters")
    .nonempty("Title is required"),

  code: z.string()
    .min(2, "Code must be at least 2 characters")
    .max(1000, "Code must not exceed 1000 characters")
    .nonempty("Code is required"),

  language: z.string()
    .nonempty("Language is required"),

  tags: z.string().optional(),

  description: z.string().optional()
});
