import { Queue } from "bullmq";
import IORedis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const IMPORT_QUEUE = "import-queue";

export const importQueue = new Queue(IMPORT_QUEUE, {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

export const queueService = {
  async addImportJob(data: any) {
    return importQueue.add("process-import", data);
  },

  async addReceiptJob(data: any) {
    return importQueue.add("scan-receipt", data);
  },

  async addReportJob(data: any) {
    return importQueue.add("generate-report", data);
  },
};
