import { z } from "zod";

export type Page = "score-creation" | "leaderboard";

const envSchema = z.object({
  VITE_PRIVATE_KEY: z.string(),
  VITE_NETWORK_URL: z.string(),
  VITE_PROGRAM_NAME: z.string(),
});

export const env = envSchema.parse(import.meta.env);

// 3 minutes default waiting time
export const wait = (ms = 180000) =>
  new Promise((resolve) => setTimeout(resolve, ms));
