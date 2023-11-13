import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  KeySearchParams,
  AleoKeyProvider,
} from "@aleohq/sdk";
import { env } from "./utils";

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

const updateScore = async (userId: number, score: number) => {
  const functionName = "update_score";
  const keySearchParams: KeySearchParams = {
    cacheKey: `${env.VITE_PROGRAM_NAME}:${functionName}`,
  };
  const txId = await programManager.execute(
    env.VITE_PROGRAM_NAME,
    "update_score",
    0.02,
    false,
    [`${userId}field`, `${score}u64`],
    undefined,
    keySearchParams
  );

  if (txId instanceof Error) throw txId;

  const transaction = await programManager.networkClient.getTransaction(txId);

  if (transaction instanceof Error) throw transaction;

  return transaction;
};

export const sdk = { updateScore };
