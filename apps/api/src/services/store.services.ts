import { PrismaClient, Store } from "@prisma/client";

interface CreateStoreData {
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude: number; // Wajib
  longitude: number; // Wajib
  maxDeliveryDistance?: number | null; // Opsional
  store_admin?: string; // Opsional
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
  maxDeliveryDistance?: number | null; // Sama tipenya
  store_admin?: string;
}

class StoreService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async getAllStores(): Promise<Store[]> {
    return this.prisma.store.findMany();
  }

  /**
   * Ambil store berdasarkan ID
   * @param storeId - ID dari store yang ingin diambil
   * @returns Promise<Store | null>
   */
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
        // Jika nilainya undefined, jadikan null
        maxDeliveryDistance: maxDeliveryDistance ?? null,
        store_admin,
      },
    });
  }


  public async updateStore(storeId: number, data: UpdateStoreData): Promise<Store> {
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


  public async assignStoreAdmin(storeId: number, adminUserId: string): Promise<Store> {
    return this.prisma.store.update({
      where: { store_id: storeId },
      data: {
        store_admin: adminUserId,
      },
    });
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default StoreService;
