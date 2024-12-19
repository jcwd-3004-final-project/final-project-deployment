import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';

const userService = new UserService();

export class UserController {
  static getUserIdFromToken(req: Request): number {
    // console.log(req)
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Authorization token is missing');
      
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string);
      if (!decoded || !decoded.userId) throw new Error('Invalid token');
  
      return decoded.userId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Unable to authenticate user: ' + error.message);
      } else {
        throw new Error('Unable to authenticate user due to an unknown error');
      }
    }
  }
  

  static async getAddresses(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const addresses = await userService.getUserAddresses(userId);
      res.json({ success: true, data: addresses });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async addAddress(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      // console.log(userId)
      const data = req.body;
      const newAddress = await userService.addUserAddress(userId, data);
      res.json({ success: true, data: newAddress });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const addressId = Number(req.params.addressId);
      const data = req.body;
      const updatedAddress = await userService.updateUserAddress(userId, addressId, data);
      res.json({ success: true, data: updatedAddress });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const addressId = Number(req.params.addressId);
      const result = await userService.deleteUserAddress(userId, addressId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async setShippingAddress(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const { orderId, addressId } = req.body;
      const result = await userService.setShippingAddressForOrder(userId, orderId, addressId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getShippingCost(req: Request, res: Response) {
    try {
      const { origin, destination, weight, courier } = req.query;
      const costData = await userService.calculateShippingCost({
        origin: String(origin),
        destination: String(destination),
        weight: Number(weight),
        courier: String(courier)
      });
      res.json({ success: true, data: costData });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
