import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  KeySearchParams,
  AleoKeyProvider,
} from "@aleohq/sdk";
import { env, wait } from "./utils";
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

const updateScore = async (userId: number, score: number) => {
  console.log("🚀 ~ updateScore ~ userId:", userId);
  console.log("🚀 ~ updateScore ~ score:", score);
  const functionName = "update_score";
  const keySearchParams: KeySearchParams = {
    cacheKey: `${env.VITE_PROGRAM_NAME}:${functionName}`,
  };
  const txId = await programManager.execute(
    env.VITE_PROGRAM_NAME,
    "update_score",
    0.3,
    false,
    [`${userId}field`, `${score}u64`],
    undefined,
    keySearchParams
  );
  console.log("🚀 ~ updateScore ~ txId:", txId);

  if (txId instanceof Error) throw txId;

  await wait();

  const transaction = await programManager.networkClient.getTransaction(txId);

  if (transaction instanceof Error) throw transaction;

  return transaction;
};

const parseUserStruct = (struct: string, username: string): Player => {
  // TODO: delete logs
  console.log("🚀 ~ parseUserStruct ~ username:", username);
  console.log("🚀 ~ parseUserStruct ~ struct:", struct);

  const lines = struct.split("\n").slice();

  let score: number | undefined;
  let gamesPlayed: number | undefined;

  lines.forEach((line) => {
    const trimmed = line.trim();

    const parseU64 = (val: string) =>
      val.split(":")[1].trim().replace(";", "").replace("u64", "");

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

export const sdk = { updateScore, retrieveLeaderboard };
