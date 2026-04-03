import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { ImportService } from "./importService";
import { IMPORT_QUEUE } from "./queueService";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const startWorker = () => {
  const worker = new Worker(
    IMPORT_QUEUE,
    async (job: Job) => {
      console.log(`[Worker] Processing job ${job.id} for ${job.name}`);
      
      try {
        switch (job.name) {
          case "process-import":
            // Move complex import logic here if needed
            // For now, it might involve normalizing and saving thousands of rows
            console.log("Processing bulk import...", job.data);
            break;
            
          case "scan-receipt":
            console.log("Processing receipt OCR in background...");
            // Integrate with OCR service if moving away from client-side
            break;

          case "generate-report":
            console.log("Generating monthly report...");
            break;

          default:
            console.warn(`Unknown job name: ${job.name}`);
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        throw error;
      }
    },
    { connection: redisConfig }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });

  console.log("Background worker started and listening for jobs...");
  return worker;
};
