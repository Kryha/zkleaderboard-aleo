import {
  type WorkerFunctions,
  type ZkappWorkerReponse,
  type ZkappWorkerRequest,
} from "./worker";
import { UpdateScoreArgs } from "./types";

export class ZkAppWorkerClient {
  private worker: Worker;

  private promises: {
    [id: number]: {
      resolve: (res: unknown) => void;
      reject: (err: unknown) => void;
    };
  };

  private nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  private call(fn: WorkerFunctions, args: unknown) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }

  async updateScore(args: UpdateScoreArgs) {
    await this.call("updateScore", args);
  }
}

export const workerClient = new ZkAppWorkerClient();
