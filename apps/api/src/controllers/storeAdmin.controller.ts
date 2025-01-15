import { Request, Response } from "express";
import { StoreAdminServices } from "../services/storeAdmin.service";

const storeAdminServices = new StoreAdminServices();

/**
 * Controller untuk mendapatkan detail store admin
 */
export const getStoreAdminDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      res.status(400).json({
        message: "Invalid request: User ID is missing",
      });
      return;
    }

    const adminDetails = await storeAdminServices.getStoreAdminDetails(
      user.userId
    );

    res.status(200).json({
      message: "Store admin details fetched successfully",
      data: adminDetails,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch store admin details",
    });
  }
};
