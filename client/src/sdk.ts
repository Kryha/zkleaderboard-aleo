import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  AleoKeyProvider,
} from "@aleohq/sdk";
import { env } from "./utils";
import { Leadeboard, Player, getUsers } from "./db";

const keyProvider = new AleoKeyProvider();
keyProvider.useCache(true);

const account = new Account({ privateKey: env.VITE_PRIVATE_KEY });

const networkClient = new AleoNetworkClient(env.VITE_NETWORK_URL);
const recordProvider = new NetworkRecordProvider(account, networkClient);

const programManager = new ProgramManager(
  env.VITE_NETWORK_URL,
  keyProvider,
  recordProvider
);
programManager.setAccount(account);

const parseUserStruct = (struct: string, username: string): Player => {
  const lines = struct.split("\n");

  let score: number | undefined;
  let gamesPlayed: number | undefined;

  lines.forEach((line) => {
    const trimmed = line.trim();

    const parseU64 = (val: string) =>
      val.split(":")[1].trim().replace(",", "").replace("u64", "");

    if (trimmed.startsWith("score")) {
      const value = parseU64(trimmed);
      score = parseInt(value);
      return;
    }

    if (trimmed.startsWith("games_played")) {
      const value = parseU64(trimmed);
      gamesPlayed = parseInt(value);
      return;
    }
  });

  if (!score || !gamesPlayed) throw new Error("Failed parsing Aleo struct");

  return { score, gamesPlayed, username, position: 0 }; // position will be calculated later
};

const retrieveLeaderboard = async (): Promise<Leadeboard> => {
  const users = getUsers();

  const promises = Object.entries(users).map(
    async ([username, id]): Promise<Player> => {
      const response = await networkClient.getProgramMappingValue(
        env.VITE_PROGRAM_NAME,
        "users",
        `${id}field`
      );
      if (response instanceof Error) throw response;
      return parseUserStruct(response, username);
    }
  );

  const players = await Promise.all(promises);

  players.sort((a, b) => -(a.score - b.score));

  return {
    players: players.map((player, index) => ({
      ...player,
      position: index + 1,
    })),
  };
};

export const sdk = { retrieveLeaderboard };
