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
  async confirmEmail(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: 'Confirmation token is required.' });
      }

      await authService.confirmEmail(token);
      return res.status(200).json({ message: 'Email confirmed successfully.' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
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
    res.redirect(`your-client-app-url?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
}