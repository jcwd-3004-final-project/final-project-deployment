import { PrismaClient, Role, AdjustmentType, StockAdjustmentReason } from "@prisma/client";
import { storeSchema } from "../validator/store.schema";

export class SuperAdminServices {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Create a new store
    async createStore(data: any) {
        const validateData = storeSchema.parse(data);
        return this.prisma.store.create({
            data: {
                name: validateData.name, // Matches "name" in schema
                address: validateData.address,
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
                storeAdmins: true, // Include related admins
                storeProducts: true,
            },
        });
    }

    // Get a store by ID
    async getStoreById(storeId: number) {
        return this.prisma.store.findUnique({
            where: { store_id: storeId },
            include: {
                storeAdmins: true, // Include related admins
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

    // Assign a user as a store admin
    async assignStoreAdmin(storeId: number, userId: number): Promise<void> {
        const store = await this.prisma.store.findUnique({
            where: { store_id: storeId },
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!store) throw new Error('Store not found');
        if (!user) throw new Error('User not found');

        // Update the user's role and assign to the store
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                role: Role.STORE_ADMIN,
                store: {
                    connect: { store_id: storeId }, // Assign store
                },
            },
        });
    }

    // Get all users with a specific role
    async getUsersByRole(role: Role) {
        return this.prisma.user.findMany({
            where: { role },
            include: {
                store: true, // Include related store for store admins
            },
        });
    }

    // Get products for a specific store
    async getStoreProducts(storeId: number) {
        return this.prisma.storeProduct.findMany({
            where: { storeId },
            include: {
                product: true, // Include product details
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
        adjustmentType: AdjustmentType, // Use the enum type
        quantity: number,
        reason: StockAdjustmentReason // Use the enum type
    ) {
        // Create the stock adjustment record
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