import { z } from "zod";

export interface Leaderboard {
  standings: string[]; // array of usernames
}

const userSchema = z.object({
  username: z.string(),
  idInProgram: z.number(),
  score: z.number(),
});
export type User = z.infer<typeof userSchema>;

// key is username
const usersSchema = z.record(userSchema);
export type Users = z.infer<typeof usersSchema>;

export const getUsers = (): Users => {
  const unparsed = localStorage.getItem("users");
  if (!unparsed) return {};

  const users = usersSchema.parse(JSON.parse(unparsed));

  return users;
};

export const storeUser = (username: string, score: number) => {
  const users = getUsers();

  const oldUser = users[username];

  let newUser: User;

  if (oldUser) {
    newUser = { ...oldUser, score };
  } else {
    const latestId = localStorage.getItem("id");
    const id = latestId ? parseInt(latestId) : 1;
    localStorage.setItem("id", `${id + 1}`);
    newUser = { idInProgram: id, username, score };
  }

  const newUsers = {
    ...users,
    [username]: newUser,
  } satisfies Users;

  localStorage.setItem("users", JSON.stringify(newUsers));

  return newUser;
};
