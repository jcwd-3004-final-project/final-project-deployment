import { PrismaClient } from "@prisma/client";
import { Store, User, StoreAdmin } from "../models/admin.models"; // Make sure this imports Prisma models
import { storeSchema } from "../validator/store.schema";

export class SuperAdminServices {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Create a new store
    async createStore(data: Store) {
        const validateData = storeSchema.parse(data); // Validate input using your schema
        return this.prisma.store.create({
            data: {
                store_name: validateData.store_name,
                address: validateData.address,
                latitude: validateData.latitude,
                longitude: validateData.longitude,
            }
        });
    }

    // Get all stores
    async getAllStores() {
        return this.prisma.store.findMany(); // Use Prisma's findMany to get stores
    }

    // Get store by ID
    async getStoreById(storeId: number) {
        return this.prisma.store.findUnique({
            where: {
                id: storeId,
            }
        });
    }

    // Update store details
    async updateStore(storeId: number, data: Store) {
        const validateData = storeSchema.parse(data); // Validate input using your schema
        return this.prisma.store.update({
            where: {
                id: storeId,
            },
            data: {
                store_name: validateData.store_name,
                address: validateData.address,
                latitude: validateData.latitude,
                longitude: validateData.longitude,
            }
        });
    }

    // Delete a store
    async deleteStore(storeId: number) {
        return this.prisma.store.delete({
            where: {
                id: storeId,
            }
        });
    }

    // Assign store admin
    async assignStoreAdmin(storeId: number, userId: number): Promise<void> {
        const store = await this.prisma.store.findUnique({
            where: { id: storeId }
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!store) {
            throw new Error('Store not found');
        }

        if (!user) {
            throw new Error('User not found');
        }

        // Check if user is already a store admin
        const existingAdmin = await this.prisma.storeAdmin.findFirst({
            where: { storeId, userId }
        });

        if (existingAdmin) {
            throw new Error('User is already a store admin for this store');
        }

        // Add the user as a store admin
        await this.prisma.storeAdmin.create({
            data: {
                storeId,
                userId
            }
        });
    }
}
