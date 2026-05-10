import { z } from "zod";

export const createArticleInputSchema = z.object({
  feedId: z.string().regex(/^\d+$/),
  title: z.string().trim().min(1),
  url: z.string().trim().url(),
  summary: z.string().trim().nullable().optional(),
  publishedAt: z
    .string()
    .datetime()
    .nullable()
    .optional(),
});

