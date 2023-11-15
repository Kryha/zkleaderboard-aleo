import { z } from "zod";

const playerSchema = z.object({
  username: z.string(),
  position: z.number(),
  score: z.number(),
  gamesPlayed: z.number(),
});
export type Player = z.infer<typeof playerSchema>;

export const leaderboardSchema = z.object({
  players: z.array(playerSchema),
});
export type Leadeboard = z.infer<typeof leaderboardSchema>;

// key is username, value is id in mapping (key of the mapping)
const usersSchema = z.record(z.number());
export type Users = z.infer<typeof usersSchema>;

export const getUsers = (): Users => {
  const unparsed = localStorage.getItem("users");
  if (!unparsed) return {};

  const users = usersSchema.parse(JSON.parse(unparsed));

  return users;
};

export const getUserMappingId = (username: string) => {
  const users = getUsers();

  const userId = users[username];

  if (userId) return userId;

  const latestId = localStorage.getItem("id");
  const id = latestId ? parseInt(latestId) : 1;
  localStorage.setItem("id", `${id + 1}`);

  const newUsers = {
    ...users,
    [username]: id,
  } satisfies Users;

  localStorage.setItem("users", JSON.stringify(newUsers));

  return id;
};

export const storeLeaderboard = (leaderboard: Leadeboard) => {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
};

export const getLeaderboard = (): Leadeboard | undefined => {
  const unparsed = localStorage.getItem("leaderboard");
  if (!unparsed) return;

  return leaderboardSchema.parse(JSON.parse(unparsed));
};
