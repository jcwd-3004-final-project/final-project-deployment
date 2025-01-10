// src/models/models.ts
import {
  PrismaClient,
  User,
  Role,
  Voucher,
  UserVoucher,
  DiscountType,
  DiscountValueType,
  VoucherUsageType,
} from "@prisma/client";

const prisma = new PrismaClient();

// Define custom interfaces for authentication and other purposes
export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: Role;
  isVerified: boolean;
  avatar: string | null;
}

export interface TokenPayload {
  userId: number;
  role: Role;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  images: string[];
  category?: Category;
}

// Export Prisma types as needed
export {
  Voucher,
  UserVoucher,
  DiscountType,
  DiscountValueType,
  VoucherUsageType,
};

// Export default Prisma Client
export default prisma;
