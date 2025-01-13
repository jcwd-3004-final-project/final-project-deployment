import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { signUpValidator, signInValidator, refreshTokenValidator } from '../validator/auth.validator';

const authService = new AuthService();

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
    // Replace `http://localhost:3000` with whichever URL your frontend is actually using
    + res.redirect(`http://localhost:3000/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${userStr}`);
  }


  // New JSON-based social callback
async socialCallbackJson(req: Request, res: Response): Promise<void> {
  const { accessToken, refreshToken, user } = await authService.socialLogin(
    req.user,
    req.params.provider
  );

  // Return JSON instead of redirect
  res.json({ accessToken, refreshToken, user });
}
}

  // --------------------- GET REFERRAL INFO ---------------------
  /**
   * Pastikan middleware otentikasi mengisi req.user dengan data user (minimal user.id).
   */
  async getReferralInfo(req: Request, res: Response): Promise<Response> {
    try {
      // Ambil userId dari req.user (misalnya, jika sudah diisi oleh middleware autentikasi)
      const userId = (req.user as any)?.id;
      console.log(userId, "disamping adalah user id");
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
      const referral = await authService.getReferralInfo(userId);
      // Misalnya, kita juga ingin mengembalikan poin referral (usageCount * 10000)
      const referralData = {
        ...referral,
        points: referral.usageCount * 10000,
      };
      return res.status(200).json(referralData);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

