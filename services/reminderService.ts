import { prisma } from "./db";

export const reminderService = {
  async createReminder(userId: string, data: {
    title: string;
    description?: string;
    dueDate: string;
  }) {
    return await prisma.reminder.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
      },
    });
  },

  async getReminders(userId: string) {
    return await prisma.reminder.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });
  },

  async getUserReminders(userId: string) {
    return this.getReminders(userId);
  },

  async getUpcomingReminders(userId: string, days: number = 7) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await prisma.reminder.findMany({
      where: {
        userId,
        isCompleted: false,
        dueDate: {
          gte: today,
          lte: futureDate,
        },
      },
      orderBy: { dueDate: "asc" },
    });
  },

  async markReminderComplete(id: string, userId: string) {
    return await prisma.reminder.update({
      where: { id, userId },
      data: { isCompleted: true },
    });
  },

  async completeReminder(id: string, userId: string) {
    return this.markReminderComplete(id, userId);
  },

  async deleteReminder(id: string, userId: string) {
    return await prisma.reminder.delete({
      where: { id, userId },
    });
  },

  async processDueReminders(userId: string) {
    const today = new Date();
    // Get incomplete reminders due today or earlier for this specific user
    const dueReminders = await prisma.reminder.findMany({
      where: {
        userId,
        isCompleted: false,
        dueDate: {
          lte: today,
        },
      },
    });

    for (const reminder of dueReminders) {
      // Check for existing notification to avoid spam
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          type: "reminder",
          message: {
            contains: `Reminder: ${reminder.title}`,
          },
          createdAt: {
            gte: new Date(new Date().setDate(today.getDate() - 1)), // Don't notify more than once a day
          },
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            userId: reminder.userId,
            message: `Reminder: ${reminder.title} is due! (${reminder.dueDate.toLocaleDateString()})`,
            type: "reminder",
          },
        });
      }
    }

    return dueReminders;
  },
};
