import prisma from "../prisma/client";

// Clean up expired sessions (dapat dipanggil secara periodik)
export const cleanupExpiredSessions = async () => {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`🧹 Cleaned up ${result.count} expired sessions`);
    return result.count;
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    return 0;
  }
};

// Get active sessions count for a supplier
export const getActiveSessionsCount = async (supplierId: number) => {
  try {
    const count = await prisma.session.count({
      where: {
        supplierId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Error getting sessions count:", error);
    return 0;
  }
};

// Logout all sessions for a supplier
export const logoutAllSessions = async (supplierId: number) => {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        supplierId,
      },
    });

    return result.count;
  } catch (error) {
    console.error("Error logging out all sessions:", error);
    return 0;
  }
};

// Extend session expiry
export const extendSession = async (
  sessionId: string,
  additionalDays: number = 7
) => {
  try {
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

    const session = await prisma.session.update({
      where: { sessionId },
      data: {
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      },
    });

    return session;
  } catch (error) {
    console.error("Error extending session:", error);
    return null;
  }
};
