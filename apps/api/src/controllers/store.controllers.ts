import { Request, Response } from "express";
import StoreService from "../services/store.services";

class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();

    // Bind metode
    this.getAllStores = this.getAllStores.bind(this);
    this.getStoreById = this.getStoreById.bind(this);
    this.createStore = this.createStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.assignStoreAdmin = this.assignStoreAdmin.bind(this);
    this.getStoreWithProducts = this.getStoreWithProducts.bind(this);
  }

  public async getAllStores(req: Request, res: Response): Promise<void> {
    try {
      const stores = await this.storeService.getAllStores();
      res.status(200).json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getStoreById(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const store = await this.storeService.getStoreById(storeId);

      if (!store) {
        res.status(404).json({ message: "Store not found" });
        return;
      }
      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async createStore(req: Request, res: Response): Promise<void> {
    try {
      const newStore = await this.storeService.createStore(req.body);
      res.status(201).json(newStore);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateStore(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const updatedStore = await this.storeService.updateStore(
        storeId,
        req.body
      );
      res.status(200).json(updatedStore);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async deleteStore(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      await this.storeService.deleteStore(storeId);
      res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async assignStoreAdmin(req: Request, res: Response): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const { adminUserId } = req.body;
      const store = await this.storeService.assignStoreAdmin(
        storeId,
        adminUserId
      );
      res.status(200).json(store);
    } catch (error) {
      console.error("Error assigning admin:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /**
   * Method baru:
   * Mendapatkan store + produk-produknya (via tabel StoreProduct)
   */
  public async getStoreWithProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const storeId = parseInt(req.params.id, 10);
      const store = await this.storeService.getStoreWithProducts(storeId);

      if (!store) {
        res.status(404).json({ message: "Store not found" });
        return;
      }

      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store with products:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async disconnectService(): Promise<void> {
    await this.storeService.disconnect();
  }
}

export default StoreController;
