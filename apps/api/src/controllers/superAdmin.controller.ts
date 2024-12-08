import { Request, Response } from "express";
import { SuperAdminServices } from "../services/superAdmin.service";

export class SuperAdminController {
    private SuperAdminServices: SuperAdminServices

    constructor() {
        this.SuperAdminServices = new SuperAdminServices();
    }

    async createStore(req: Request, res: Response) {
        try {
            const store = await this.SuperAdminServices.createStore(req.body);
            res.status(201).json(store);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating store" });
        }
    }

    async getAllStores(req: Request, res: Response) {
        const store = await this.SuperAdminServices.getAllStores();
        if (store){
            res.status(200).send({
                data:store,
                status: res.statusCode
            })
        } else {
            res.status(404).send({
                message: "Store not found",
                status: res.statusCode
            })
        }
    }

    async getStoreById(req: Request, res: Response) {
        const storeId = parseInt(req.params.storeId);
        const store = await this.SuperAdminServices.getStoreById(storeId);
        if (store) {
            res.status(200).send({
                message: `Store with id ${storeId} was succesfully retrieved`,
                data: store,
                status: res.statusCode
            });
        } else {
            res.status(404).send({
                message: `Store with id ${storeId} not found`,
                status: res.statusCode
            });
        }
    }

    async updateStore(req: Request, res: Response) {
        const storeId = parseInt(req.params.storeId);
        const store = await this.SuperAdminServices.updateStore(storeId, req.body);
        if (store) {
            res.status(200).send({
                message: `Store with id ${storeId} was updated successfully`,
                data: store,
                status: res.statusCode
            });
        } else {
            res.status(404).send({
                message: `Store with id ${storeId} not found`,
                status: res.statusCode
            });
        }
    }

    async deleteStore(req: Request, res: Response) {
        const storeId = parseInt(req.params.storeId);
        const store = await this.SuperAdminServices.deleteStore(storeId);
        if (store) {
            res.status(200).send({
                message: `Store with id ${storeId} was deleted successfully`,
                status: res.statusCode
            });
        } else {
            res.status(404).send({
                message: `Store with id ${storeId} not found`,
                status: res.statusCode
            });
        }
    }

    async assignStoreAdmin(req: Request, res: Response) {
        const storeId = parseInt(req.params.storeId);
        const userId = parseInt(req.params.userId);
        await this.SuperAdminServices.assignStoreAdmin(storeId, userId);
        res.status(200).send({
            message: `Store admin was assigned to store with id ${storeId} successfully`,
            status: res.statusCode
        });
    }
}