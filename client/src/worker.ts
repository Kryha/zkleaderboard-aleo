import {
  Account,
  AleoKeyProvider,
  AleoNetworkClient,
  KeySearchParams,
  NetworkRecordProvider,
  ProgramManager,
} from "@aleohq/sdk";

import { env, wait } from "./utils";
import { updateScoreArgsSchema } from "./types";

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

const workerFunctions = {
  updateScore: async (args: unknown) => {
    const { userId, score } = updateScoreArgsSchema.parse(args);

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

    // TODO: instead of waiting, we can check the transaction every x seconds for x minutes
    await wait();

    const transaction = await programManager.networkClient.getTransaction(txId);

    if (transaction instanceof Error) throw transaction;

    return transaction;
  },
};

export type WorkerFunctions = keyof typeof workerFunctions;

export interface ZkappWorkerRequest {
  id: number;
  fn: WorkerFunctions;
  args: unknown;
}

export interface ZkappWorkerReponse {
  id: number;
  data: unknown;
}

onmessage = async (event: MessageEvent<ZkappWorkerRequest>) => {
  try {
    const returnData = await workerFunctions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    };
    postMessage(message);
  } catch (error) {
    console.error("Worker Error:", error);
  }
};
