// auth.model.ts
import { PrismaClient, User, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for authentication
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
  phoneNumber: string | null; // Now it accepts string or null
  role: Role;
  isVerified: boolean;
  avatar: string | null;
}

export interface TokenPayload {
  userId: number;
  role: Role;
}

export default prisma;
