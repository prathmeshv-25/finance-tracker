import { prisma } from "../db";
import cron from "node-cron";
import { recurringService } from "../recurringService";
import { reminderService } from "../reminderService";

export function initCronJobs() {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled tasks (Recurring & Reminders)...");
    try {
      const processedRT = await recurringService.processRecurringTransactions();
      const processedReminders = await reminderService.processDueReminders();
      console.log(`Processed ${processedRT.length} recurring transactions and ${processedReminders.length} reminders.`);
    } catch (error) {
      console.error("Error running scheduled tasks:", error);
    }
  });

  console.log("Cron jobs initialized.");
}
