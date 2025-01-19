import {
  PrismaClient,
  Role,
  AdjustmentType,
  StockAdjustmentReason,
} from "@prisma/client";
import { storeSchema } from "../validator/store.schema";
import bcrypt from "bcryptjs";
// Jika diperlukan, buat juga schema validasi untuk user store admin misalnya:
// import { storeAdminSchema } from "../validator/storeAdmin.schema";

export class SuperAdminServices {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ===============================
  // Methods untuk _Store_
  // ===============================

  // Create a new store
  async createStore(data: any) {
    const validateData = storeSchema.parse(data);
    return this.prisma.store.create({
      data: {
        name: validateData.name,
        address: validateData.address,
        city: validateData.city,
        state: validateData.state,
        latitude: validateData.latitude,
        longitude: validateData.longitude,
        maxDeliveryDistance: validateData.maxDeliveryDistance,
      },
    });
  }

  // Get all stores
  async getAllStores() {
    return this.prisma.store.findMany({
      include: {
        storeAdmins: true,
        storeProducts: true,
      },
    });
  }

  // Get a store by ID
  async getStoreById(storeId: number) {
    return this.prisma.store.findUnique({
      where: { store_id: storeId },
      include: {
        storeAdmins: true,
        storeProducts: true,
      },
    });
  }

  // Update store details
  async updateStore(storeId: number, data: any) {
    const validateData = storeSchema.parse(data);
    return this.prisma.store.update({
      where: { store_id: storeId },
      data: {
        name: validateData.name,
        address: validateData.address,
        city: validateData.city,
        state: validateData.state,
        latitude: validateData.latitude,
        longitude: validateData.longitude,
        maxDeliveryDistance: validateData.maxDeliveryDistance,
      },
    });
  }

  // Delete a store
  async deleteStore(storeId: number) {
    return this.prisma.store.delete({
      where: { store_id: storeId },
    });
  }

  // ===============================
  // Methods untuk _User_ dengan role STORE_ADMIN
  // ===============================

  /**
   * Membuat user baru dengan role STORE_ADMIN.
   * Pastikan untuk melakukan validasi data terlebih dahulu jika diperlukan.
   */
  async createStoreAdmin(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;

    storeId?: number;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword, // Pastikan password di-hash
        role: Role.STORE_ADMIN,
        isVerified: true,
        ...(data.storeId && {
          store: {
            connect: { store_id: data.storeId },
          },
        }),
      },
    });
  }

  /**
   * Memperbarui data user dengan role STORE_ADMIN.
   * Hanya superadmin yang bisa melakukan perubahan data user.
   */
  async updateStoreAdmin(
    userId: number,
    data: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      storeId: number;
    }>
  ) {
    // Periksa apakah user ada dan role-nya STORE_ADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== Role.STORE_ADMIN)
      throw new Error("User is not a store admin");

    const updateData: any = {
      ...(data.first_name ? { first_name: data.first_name } : {}),
      ...(data.last_name ? { last_name: data.last_name } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.password ? { password: data.password } : {}), // Jangan lupa hash password jika diperlukan
    };

    if ("storeId" in data) {
      updateData.store = data.storeId
        ? { connect: { store_id: data.storeId } }
        : { disconnect: true };
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  /**
   * Menghapus user dengan role STORE_ADMIN.
   */
  async deleteStoreAdmin(userId: number) {
    // 1. Pastikan user ada dan berperan sebagai STORE_ADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== Role.STORE_ADMIN)
      throw new Error("User is not a store admin");

    // 2. Hapus semua data cart yang terkait user ini (karena itulah yang menimbulkan foreign key constraint)
    await this.prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    // 3. Hapus semua token yang terkait dengan user ini
    await this.prisma.token.deleteMany({
      where: { userId: userId },
    });

    // 4. Hapus user tersebut
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // ===============================
  // Method-method tambahan lain
  // ===============================

  // Assign a user as a store admin
  async assignStoreAdmin(storeId: number, userId: number): Promise<void> {
    const store = await this.prisma.store.findUnique({
      where: { store_id: storeId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!store) throw new Error("Store not found");
    if (!user) throw new Error("User not found");

    // Update the user's role and assign to the store
    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: {
        role: Role.STORE_ADMIN,
        store: {
          connect: { store_id: storeId },
        },
      },
    });
  }

  // Get all users with a specific role
  async getUsersByRole(role: Role) {
    return this.prisma.user.findMany({
      where: { role },
      include: {
        store: true,
      },
    });
  }

  // **New Method: Get all users (for Super Admin)**
  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        store: true, // Include related store data jika ada
      },
    });
  }

  // Get products for a specific store
  async getStoreProducts(storeId: number) {
    return this.prisma.storeProduct.findMany({
      where: { storeId },
      include: {
        product: true,
      },
    });
  }

  // Add a product to a store's inventory
  async addStoreProduct(storeId: number, productId: number, stock: number) {
    return this.prisma.storeProduct.create({
      data: {
        storeId,
        productId,
        stock,
      },
    });
  }

  // Adjust stock for a store product
  async adjustProductStock(
    storeProductId: number,
    adjustmentType: AdjustmentType,
    quantity: number,
    reason: StockAdjustmentReason
  ) {
    return this.prisma.stockAdjustment.create({
      data: {
        storeProductId,
        adjustmentType,
        quantity,
        reason,
      },
    });
  }
}
