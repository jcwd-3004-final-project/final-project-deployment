// src/controllers/auth.controllers.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { signUpValidator, signInValidator, refreshTokenValidator } from '../validator/auth.validator';

const authService = new AuthService();
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_access_token_secret';

export class AuthController {
  // --------------------- SIGN UP (USER) ---------------------
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      // Pisahkan referralCode (jika ada) dari data registrasi
      const { referralCode, ...data } = req.body;
      const user = await authService.signUp({ ...data, referralCode });
      return res.status(201).json({
        message: 'Registration successful. Please confirm your email.',
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // --------------------- SIGN UP SUPER ADMIN ---------------------
  async signUpSuperAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const user = await authService.signUpSuperAdmin(req.body);
      return res.status(201).json({
        message: 'Registration successful. Please confirm your email.',
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // --------------------- SIGN UP STORE ADMIN ---------------------
  async signUpStoreAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const user = await authService.signUpStoreAdmin(req.body);
      return res.status(201).json({
        message: 'Registration successful. Please confirm your email.',
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Handle email confirmation
  async confirmEmail(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string;

    if (!token) {
      res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1>Email Confirmation Failed ❌</h1>
          <p style="color: red;">Missing confirmation token.</p>
          <a href="http://localhost:3000/" style="color: #28a745; text-decoration: none;">Go to Homepage</a>
        </div>
      `);
      return;
    }
    try {
      await authService.confirmEmail(token);

      res.status(200).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1>Email Confirmed Successfully! ✅</h1>
          <p>Thank you for confirming your email. You will be redirected shortly.</p>
          <script>
            setTimeout(() => window.location.href = "http://localhost:3000/", 3000);
          </script>
        </div>
      `);
    } catch (err: any) {
      res.status(400).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h1>Email Confirmation Failed ❌</h1>
          <p style="color: red;">${err.message}</p>
          <a href="http://localhost:3000/" style="color: #28a745; text-decoration: none;">Go to Homepage</a>
        </div>
      `);
    }
  }

  // --------------------- SIGN IN ---------------------
  async signIn(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signInValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { accessToken, refreshToken, user } = await authService.signIn(req.body);
      return res.status(200).json({ accessToken, refreshToken, user });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  // --------------------- REFRESH TOKEN ---------------------
  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = refreshTokenValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { accessToken, refreshToken } = await authService.refreshTokens(req.body.refreshToken);
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  // --------------------- SOCIAL LOGIN CALLBACK ---------------------
  async socialCallback(req: Request, res: Response): Promise<void> {
    // Asumsi: req.user telah diisi oleh middleware seperti Passport
    const { accessToken, refreshToken, user } = await authService.socialLogin(req.user, req.params.provider);
    const userStr = encodeURIComponent(JSON.stringify(user));
    // Replace `http://localhost:3000` with the URL your frontend is using
    res.redirect(`http://localhost:3000/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userStr}`);
  }

  // --------------------- JSON-BASED SOCIAL CALLBACK ---------------------
  async socialCallbackJson(req: Request, res: Response): Promise<void> {
    const { accessToken, refreshToken, user } = await authService.socialLogin(req.user, req.params.provider);
    // Return JSON instead of redirect
    res.json({ accessToken, refreshToken, user });
  }

  // --------------------- GET REFERRAL INFO (TANPA MENGGUNAKAN MIDDLEWARE 'authenticate') ---------------------
  /**
   * Verifikasi token dilakukan secara langsung di dalam controller.
   * Token diambil dari header "Authorization" dengan format "Bearer <token>".
   */
  async getReferralInfo(req: Request, res: Response): Promise<Response> {
    // 1. Periksa header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // 2. Ekstrak token (asumsi format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      // 3. Verifikasi token
      const payload = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as { userId: number };
      const userId = payload.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
      }

      // 4. Ambil data referral menggunakan service
      const referral = await authService.getReferralInfo(userId);
      const referralData = {
        ...referral,
        points: referral.usageCount * 10000,
      };

      return res.status(200).json(referralData);
    } catch (err: any) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}
