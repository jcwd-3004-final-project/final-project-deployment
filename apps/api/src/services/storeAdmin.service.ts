import { PrismaClient, Role } from "@prisma/client";

export class StoreAdminServices {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getStoreAdminDetails(adminId: number) {
    if (!adminId) {
      throw new Error("Admin ID is required");
    }

    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: {
        store: true, // Include store yang terkait dengan admin
      },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (admin.role !== Role.STORE_ADMIN) {
      throw new Error("User is not a store admin");
    }

    return {
      id: admin.id,
      firstName: admin.first_name,
      lastName: admin.last_name,
      email: admin.email,
      store: admin.store || null,
    };
  }
}
