import { prisma } from "./db";

export class ProfileService {
  static async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        phone: true,
        country: true,
        currency: true,
        emailNotifications: true,
        appNotifications: true,
        reminderNotifications: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async updateUserProfile(userId: string, data: {
    name?: string;
    phone?: string;
    country?: string;
    currency?: string;
    profileImage?: string;
    emailNotifications?: boolean;
    appNotifications?: boolean;
    reminderNotifications?: boolean;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        phone: true,
        country: true,
        currency: true,
        emailNotifications: true,
        appNotifications: true,
        reminderNotifications: true,
      },
    });
  }
}
