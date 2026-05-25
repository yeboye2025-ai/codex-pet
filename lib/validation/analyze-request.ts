import { z } from "zod";

export const analyzeRequestSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/"),
  apiUrl: z.string().url(),
  apiKey: z.string().min(1),
  model: z.string().min(1)
});
