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

  // static getUserIdFromToken(req: Request): number {
  //   const token = req.headers.authorization?.split(" ")[1];
  //   if (!token) throw new Error("Authorization token is missing");

  //   const decoded: any = jwt.verify(
  //     token,
  //     process.env.JWT_ACCESS_TOKEN_SECRET as string
  //   );
  //   if (!decoded || !decoded.userId) throw new Error("Invalid token");

  //   return decoded.userId;
  // }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const user = await userService.findUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found." });
      }
      // Return only safe fields
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phoneNumber: user.phone_number,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const { firstName, lastName, email, newPassword } = req.body;

      // In a real app, you'd handle password hashing and old password check
      const updatedUser = await userService.updateUserProfile(userId, {
        firstName,
        lastName,
        email,
        newPassword, // or hashed
      });

      return res.json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          phoneNumber: updatedUser.phone_number,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
          avatar: updatedUser.avatar,
        },
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteProfile(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      await userService.deleteUser(userId);
      return res.json({ success: true, message: "Account deleted successfully." });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}
