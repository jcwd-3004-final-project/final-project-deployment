import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { signUpValidator, signInValidator, refreshTokenValidator } from '../validator/auth.validator';

const authService = new AuthService();

export class AuthController {
  // Handle user registration
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = await authService.signUp(req.body);
      return res.status(201).json({ message: 'Registration successful. Please confirm your email.', user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async signUpSuperAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = await authService.signUpSuperAdmin(req.body);
      return res.status(201).json({ message: 'Registration successful. Please confirm your email.', user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async signUpStoreAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const { error } = signUpValidator.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = await authService.signUpStoreAdmin(req.body);
      return res.status(201).json({ message: 'Registration successful. Please confirm your email.', user });
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

  // Handle user login
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

  // Handle token refreshing
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

  // Handle social login callbacks
  async socialCallback(req: Request, res: Response): Promise<void> {
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