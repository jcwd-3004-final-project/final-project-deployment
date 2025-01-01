import { Router } from "express";
import StoreController from "../controllers/store.controllers";

const router = Router();

// Instansiasi StoreController
const storeController = new StoreController();

// Mendefinisikan rute dan mengaitkan metode controller
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.post("/", storeController.createStore);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);
router.post("/:id/assign-admin", storeController.assignStoreAdmin);

// Tambahkan ini -> Endpoint untuk ambil store beserta products
router.get("/:id/products", storeController.getStoreWithProducts);

export default router;
