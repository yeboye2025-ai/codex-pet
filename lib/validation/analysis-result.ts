import { z } from "zod";

export const analysisSignalSchema = z.object({
  name: z.string().min(1),
  observation: z.string().min(1),
  meaning: z.string().min(1)
});

export const analysisResultSchema = z.object({
  id: z.string().min(1),
  imageDataUrl: z.string().startsWith("data:image/"),
  createdAt: z.string().datetime(),
  emotionLabel: z.string().min(1),
  emotionSummary: z.string().min(1),
  confidenceNote: z.string().min(1),
  signals: z.array(analysisSignalSchema).min(1),
  scientificInterpretation: z.string().min(1),
  innerMonologue: z.string().min(1),
  disclaimer: z.string().min(1),
  isFavorited: z.boolean()
});
