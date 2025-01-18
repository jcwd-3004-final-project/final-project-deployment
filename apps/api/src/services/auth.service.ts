// src/services/auth.service.ts

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import prisma, {
  SignUpInput,
  SignInInput,
  AuthenticatedUser,
  TokenPayload,
} from "../models/models";
import {
  TokenType,
  User,
  VoucherUsageType,
  DiscountType,
  DiscountValueType,
} from "@prisma/client";

const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "your_access_token_secret";
const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || "your_refresh_token_secret";
const EMAIL_CONFIRMATION_SECRET =
  process.env.EMAIL_CONFIRMATION_SECRET || "your_email_confirmation_secret";

export class AuthService {
  // ----------------------------------------------------
  // SIGN UP (USER)
  // ----------------------------------------------------
  /**
   * Registrasi user dengan opsi referralCode.
   * Jika referralCode dikirim, maka akan diproses (pengecekan dan pemberian benefit)
   */
  async signUp(
    data: SignUpInput & { referralCode?: string }
  ): Promise<AuthenticatedUser> {
    // Jika user mengirim referralCode, gunakan _useReferralCodeIfExists
    if (data.referralCode) {
      await this._useReferralCodeIfExists(data.referralCode);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: "USER",
        isVerified: false,
        last_activity: new Date(),
      },
    });

    // Buat referral code baru untuk user ini (usageCount = 0)
    await this._createReferralForNewUser(user.id);

    // Kirim email konfirmasi
    await this._sendConfirmationEmail(user);

    return this._sanitizeUser(user);
  }

  // ----------------------------------------------------
  // SIGN UP SUPER ADMIN
  // ----------------------------------------------------
  async signUpSuperAdmin(data: SignUpInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: "SUPER_ADMIN",
        isVerified: false,
        last_activity: new Date(),
      },
    });
    await this._sendConfirmationEmail(user);
    return this._sanitizeUser(user);
  }

  // ----------------------------------------------------
  // SIGN UP STORE ADMIN
  // ----------------------------------------------------
  async signUpStoreAdmin(data: SignUpInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: "STORE_ADMIN",
        isVerified: false,
        last_activity: new Date(),
      },
    });
    await this._sendConfirmationEmail(user);
    return this._sanitizeUser(user);
  }

  // ----------------------------------------------------
  // CONFIRM EMAIL
  // ----------------------------------------------------
  async confirmEmail(token: string): Promise<void> {
    try {
      const payload = jwt.verify(
        token,
        EMAIL_CONFIRMATION_SECRET
      ) as TokenPayload;
      const user = await prisma.user.update({
        where: { id: payload.userId },
        data: { isVerified: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
    } catch (error) {
      throw new Error("Invalid or expired confirmation token");
    }
  }

  // ----------------------------------------------------
  // SIGN IN
  // ----------------------------------------------------
  async signIn(data: SignInInput): Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
  }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || !user.password) {
      console.error(
        "User not found or password missing for email:",
        data.email
      );
      throw new Error("Invalid email or password");
    }
  
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
   
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._generateRefreshToken(user);
    return { accessToken, refreshToken, user: this._sanitizeUser(user) };
  }

  // ----------------------------------------------------
  // REFRESH TOKENS
  // ----------------------------------------------------
  async refreshTokens(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenRecord = await prisma.token.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token");
    }
    const user = tokenRecord.user as User;
    const accessToken = this._generateAccessToken(user);
    const newRefreshToken = await this._generateRefreshToken(user);
    // Remove old refresh token from DB
    await prisma.token.delete({ where: { id: tokenRecord.id } });
    return { accessToken, refreshToken: newRefreshToken };
  }

  // ----------------------------------------------------
  // SOCIAL LOGIN
  // ----------------------------------------------------
  /**
   * Social login / registration
   * @param profile - data user dari provider
   * @param provider - 'google' | 'facebook' | dsb.
   */
  async socialLogin(
    profile: any,
    provider: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
  }> {
    let user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });
    if (!user) {
      const data: any = {
        email: profile.emails[0].value,
        first_name: profile.name.givenName || "",
        last_name: profile.name.familyName || "",
        isVerified: true,
        last_activity: new Date(),
      };
      if (provider === "google") {
        data.googleId = profile.id;
      } else if (provider === "facebook") {
        data.facebookId = profile.id;
      }
      user = await prisma.user.create({ data });
    } else {
      // If existing user doesn't have googleId or facebookId, update them
      if (provider === "google" && !user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id },
        });
      } else if (provider === "facebook" && !user.facebookId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { facebookId: profile.id },
        });
      }
    }
    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._generateRefreshToken(user);
    return { accessToken, refreshToken, user: this._sanitizeUser(user) };
  }

  // ----------------------------------------------------
  // GET REFERRAL INFO
  // ----------------------------------------------------
  /**
   * Mengembalikan data referral untuk user yang terdaftar sebagai referrer.
   * Dapat digunakan untuk menampilkan referral code dan poinnya.
   */
  async getReferralInfo(userId: number) {
    const referral = await prisma.referral.findFirst({
      where: { referrerId: userId },
    });
    if (!referral) {
      throw new Error("Referral information not found for this user.");
    }
    return referral;
  }

  // ----------------------------------------------------
  // HELPER: Generate & Store Tokens
  // ----------------------------------------------------
  private _generateAccessToken(user: User): string {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
  }

  private async _generateRefreshToken(user: User): Promise<string> {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    await prisma.token.create({
      data: {
        userId: user.id,
        token: refreshToken,
        type: TokenType.REFRESH_TOKEN,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    return refreshToken;
  }

  // ----------------------------------------------------
  // HELPER: Send Confirmation Email (Fancy HTML version)
  // ----------------------------------------------------
  private async _sendConfirmationEmail(user: User): Promise<void> {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, EMAIL_CONFIRMATION_SECRET, {
      expiresIn: "1d",
    });

    const confirmationUrl = `http://localhost:8000/v1/api/auth/confirm-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Welcome to Pesan Aja! Confirm Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Pesan Aja! 🛒</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your favorite online grocery store 🌟</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; background-color: #f9f9f9; text-align: center;">
            <p style="font-size: 16px; color: #555; margin: 16px 0;">
              Thank you for signing up with <strong>Pesan Aja</strong>! You're just one step away from enjoying a seamless grocery shopping experience.
            </p>
            <p style="font-size: 16px; color: #555; margin: 16px 0;">
              Please confirm your email by clicking the button below:
            </p>
            
            <!-- Call to Action Button -->
            <a href="${confirmationUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
              Confirm Email
            </a>
            
            <!-- Divider -->
            <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
            
            <!-- Additional Information -->
            <p style="font-size: 14px; color: #888; margin: 0;">
              Need help? Reach out to our support team at <a href="mailto:support@pesanaja.com" style="color: #28a745; text-decoration: none;">support@pesanaja.com</a>.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #343a40; color: white; padding: 10px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Pesan Aja. All rights reserved.</p>
            <p style="margin: 0;">Jl. Pasar Baru No.123, Jakarta, Indonesia</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  // ----------------------------------------------------
  // HELPER: Sanitize User (remove password)
  // ----------------------------------------------------
  private _sanitizeUser(user: User): AuthenticatedUser {
    const { password, ...rest } = user;
    return {
      id: rest.id,
      email: rest.email,
      firstName: rest.first_name,
      lastName: rest.last_name,
      phoneNumber: rest.phone_number || "",
      role: rest.role,
      isVerified: rest.isVerified,
      avatar: rest.avatar || "",
    };
  }

  // ----------------------------------------------------
  // REFERRAL CODE LOGIC
  // ----------------------------------------------------
  /**
   * Cek apakah referral code valid dan usageCount < 3.
   * Jika valid, increment usageCount dan buat voucher 10.000 untuk pemilik referral.
   */
  private async _useReferralCodeIfExists(referralCode: string): Promise<void> {
    const referral = await prisma.referral.findUnique({
      where: { referralCode },
    });
    if (!referral) {
      // Jika kode tidak valid, bisa diabaikan atau dilempar error
      return;
    }

    // If code already used 3 times, do nothing
    if (referral.usageCount >= 3) {
      return;
    }

    // Increase usageCount by 1
    const updatedReferral = await prisma.referral.update({
      where: { id: referral.id },
      data: { usageCount: { increment: 1 } },
    });

    const discountValue = 10000;
    const usageSoFar = updatedReferral.usageCount; // 1..3

    // Buat voucher nominal 10.000 untuk pemilik referral code
    const voucher = await prisma.voucher.create({
      data: {
        code: `REF-BENEFIT-${referralCode}-${usageSoFar}`,
        discountType: DiscountType.MIN_PURCHASE_DISCOUNT,
        value: discountValue,
        valueType: DiscountValueType.NOMINAL,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageType: VoucherUsageType.TOTAL_PURCHASE,
        minPurchaseAmount: 0,
        maxDiscount: discountValue,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.userVoucher.create({
      data: {
        userId: referral.referrerId,
        voucherId: voucher.id,
      },
    });
  }

  /**
   * Membuat referral code untuk user yang baru mendaftar (usageCount=0).
   */
  private async _createReferralForNewUser(userId: number): Promise<void> {
    const code = this._generateReferralCode();
    await prisma.referral.create({
      data: {
        referrerId: userId,
        referralCode: code,
        usageCount: 0,
      },
    });
  }

  private _generateReferralCode(): string {
    return "GRI" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
