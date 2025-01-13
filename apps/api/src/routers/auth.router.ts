// auth.router.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers';
import passport from 'passport';

const router = Router();
const authController = new AuthController();

// Helper function to wrap async controller methods
const asyncHandler = (fn: Function) => (req:any, res:any, next:any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Local Authentication
router.post('/signup', asyncHandler(authController.signUp.bind(authController)));
router.post('/signup/store-admin', asyncHandler(authController.signUpStoreAdmin.bind(authController)));
router.post('/signup/super-admin', asyncHandler(authController.signUpSuperAdmin.bind(authController)));
router.post('/signin', asyncHandler(authController.signIn.bind(authController)));
router.post('/refresh-token', asyncHandler(authController.refreshToken.bind(authController)));
router.get('/confirm-email', asyncHandler(authController.confirmEmail.bind(authController)));

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  asyncHandler(authController.socialCallback.bind(authController))
);

// JSON-based Google callback (no redirect)
router.get(
  '/google/callback/json',
  passport.authenticate('google', { session: false }),
  asyncHandler(authController.socialCallbackJson.bind(authController))
);

// Facebook OAuth
router.get( '/facebook', passport.authenticate('facebook', { scope: ['email'] }) );
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), asyncHandler(authController.socialCallback.bind(authController)));

export default router;
