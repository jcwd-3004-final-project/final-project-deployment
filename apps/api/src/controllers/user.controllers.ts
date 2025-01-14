import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';

const userService = new UserService();
const upload = multer({ dest: "uploads/" });

export class UserController {
  static getUserIdFromToken(req: Request): number {
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

  static async updateProfilePhoto(req: Request, res: Response) {
    try {
      // Mendapatkan userId dari token yang ada di header Authorization
      const userId = UserController.getUserIdFromToken(req);
  
      // Pastikan file telah berhasil diupload melalui multer dan tersedia di req.file
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
  
      const avatarFile = req.file;
  
      // Upload gambar ke Cloudinary
      const result = await cloudinary.v2.uploader.upload(avatarFile.path, {
        folder: 'user_avatars', // Folder tempat gambar disimpan di Cloudinary
        use_filename: true,     // Gunakan nama file asli dari file yang diupload
        unique_filename: true,  // Gunakan nama file unik agar tidak ada konflik
      });
  
      // Mendapatkan URL gambar dari hasil upload Cloudinary
      const avatarUrl = result.secure_url;
  
      // Mengupdate data avatar pengguna di database dengan URL dari Cloudinary
      const updatedUser = await userService.updateUserProfilePicture(userId, avatarUrl);
  
      // Menanggapi dengan data pengguna yang telah diperbarui
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
          avatar: updatedUser.avatar, // URL gambar baru dari Cloudinary
        },
      });
    } catch (error: any) {
      console.error('Error updating profile photo:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  
  

  static async getUserProfile(req: Request, res: Response) {
    try {
      const userId = UserController.getUserIdFromToken(req);
      const userProfile = await userService.getUserProfile(userId);
      res.json({ success: true, data: userProfile });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
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
