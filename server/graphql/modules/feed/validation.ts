import { z } from "zod";

export const createFeedInputSchema = z.object({
  title: z.string().trim().min(1),
  rssUrl: z.string().trim().url(),
  siteUrl: z.string().trim().url(),
});

