import { z } from "zod";

export const updateScoreArgsSchema = z.object({
  userId: z.number(),
  score: z.number(),
});
export type UpdateScoreArgs = z.infer<typeof updateScoreArgsSchema>;
