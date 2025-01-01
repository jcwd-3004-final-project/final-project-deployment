import { PrismaClient, Store, Prisma } from "@prisma/client";

interface CreateStoreData {
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance?: number | null;
  store_admin?: string;
}

interface UpdateStoreData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  maxDeliveryDistance?: number | null;
  store_admin?: string;
}

// Tambahkan type untuk hasil "Store dengan products"
type StoreWithProducts = Prisma.StoreGetPayload<{
  include: {
    storeProducts: {
      include: {
        product: true;
      };
    };
  };
}>;

class StoreService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getAllStores(): Promise<Store[]> {
    return this.prisma.store.findMany();
  }

  public async getStoreById(storeId: number): Promise<Store | null> {
    return this.prisma.store.findUnique({
      where: { store_id: storeId },
    });
  }

  public async createStore(data: CreateStoreData): Promise<Store> {
    const {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      maxDeliveryDistance,
      store_admin,
    } = data;

    return this.prisma.store.create({
      data: {
        name,
        address,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
        maxDeliveryDistance: maxDeliveryDistance ?? null,
        store_admin,
      },
    });
  }

  public async updateStore(
    storeId: number,
    data: UpdateStoreData
  ): Promise<Store> {
    const {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      maxDeliveryDistance,
      store_admin,
    } = data;

    return this.prisma.store.update({
      where: { store_id: storeId },
      data: {
        name,
        address,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
        maxDeliveryDistance: maxDeliveryDistance ?? null,
        store_admin,
      },
    });
  }

  public async deleteStore(storeId: number): Promise<Store> {
    return this.prisma.store.delete({
      where: { store_id: storeId },
    });
  }

  public async assignStoreAdmin(
    storeId: number,
    adminUserId: string
  ): Promise<Store> {
    return this.prisma.store.update({
      where: { store_id: storeId },
      data: {
        store_admin: adminUserId,
      },
    });
  }

  /**
   * **Method baru**: Ambil store beserta produk (via StoreProduct)
   */
  public async getStoreWithProducts(
    storeId: number
  ): Promise<StoreWithProducts | null> {
    return this.prisma.store.findUnique({
      where: { store_id: storeId },
      include: {
        storeProducts: {
          include: {
            product: {
              include: {
                category: true, // Menyertakan data kategori
                images: true, // Menyertakan data gambar
              },
            },
          },
        },
      },
    });
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default StoreService;
