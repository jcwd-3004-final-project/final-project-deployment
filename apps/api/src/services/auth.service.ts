// auth.service.ts
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import prisma, { SignUpInput, SignInInput, AuthenticatedUser, TokenPayload, } from '../models/models';
import { TokenType, User } from '@prisma/client';

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const EMAIL_CONFIRMATION_SECRET = process.env.EMAIL_CONFIRMATION_SECRET || 'your_email_confirmation_secret';

export class AuthService {
  // User registration
  async signUp(data: SignUpInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: 'USER',
        isVerified: false,
        last_activity: new Date(),
      },
    });

    // Send confirmation email
    await this._sendConfirmationEmail(user);

    return this._sanitizeUser(user);
  }

  async signUpSuperAdmin(data: SignUpInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: 'SUPER_ADMIN',
        isVerified: false,
        last_activity: new Date(),
      },
    });

    // Send confirmation email
    await this._sendConfirmationEmail(user);

    return this._sanitizeUser(user);
  }

  async signUpStoreAdmin(data: SignUpInput): Promise<AuthenticatedUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        role: 'STORE_ADMIN',
        isVerified: false,
        last_activity: new Date(),
      },
    });

    // Send confirmation email
    await this._sendConfirmationEmail(user);

    return this._sanitizeUser(user);
  }



  async confirmEmail(token: string): Promise<void> {
    try {
      const payload = jwt.verify(token, EMAIL_CONFIRMATION_SECRET) as TokenPayload;
      const user = await prisma.user.update({
        where: { id: payload.userId },
        data: { isVerified: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Invalid or expired confirmation token');
    }
  }

  private async _sendConfirmationEmail(user: User): Promise<void> {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, EMAIL_CONFIRMATION_SECRET, { expiresIn: '1d' });

    const confirmationUrl = `http://localhost:8000/v1/api/auth/confirm-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or use another email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Confirmation',
      html: `
        <h1>Email Confirmation</h1>
        <p>Thank you for signing up. Please confirm your email by clicking the link below:</p>
        <a href="${confirmationUrl}">Confirm Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
  

  // User login
  async signIn(data: SignInInput): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._generateRefreshToken(user);

    return { accessToken, refreshToken, user: this._sanitizeUser(user) };
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenRecord = await prisma.token.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = tokenRecord.user as User; // Corrected typing

    const accessToken = this._generateAccessToken(user);
    const newRefreshToken = await this._generateRefreshToken(user);

    // Delete old refresh token
    await prisma.token.delete({ where: { id: tokenRecord.id } });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Generate Access Token
  private _generateAccessToken(user: User): string {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  // Generate Refresh Token
  private async _generateRefreshToken(user: User): Promise<string> {
    const payload: TokenPayload = { userId: user.id, role: user.role };
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store refresh token in database
    await prisma.token.create({
      data: {
        userId: user.id,
        token: refreshToken,
        type: TokenType.REFRESH_TOKEN,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return refreshToken;
  }

  // Helper method to remove sensitive fields
  private _sanitizeUser(user: User): AuthenticatedUser {
    const { password, ...rest } = user;
    return {
      id: rest.id,
      email: rest.email,
      firstName: rest.first_name,
      lastName: rest.last_name,
      phoneNumber: rest.phone_number,
      role: rest.role,
      isVerified: rest.isVerified,
      avatar: rest.avatar,
    };
  }

  // Social Login or Registration
  async socialLogin(profile: any, provider: string): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    let user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (!user) {
      // Register new user
      const data: any = {
        email: profile.emails[0].value,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        isVerified: true,
        last_activity: new Date(),
      };

      if (provider === 'google') {
        data.googleId = profile.id;
      } else if (provider === 'facebook') {
        data.facebookId = profile.id;
      }

      user = await prisma.user.create({ data });
    } else {
      // Update existing user with social ID if not already present
      if (provider === 'google' && !user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id },
        });
      } else if (provider === 'facebook' && !user.facebookId) {
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
}
