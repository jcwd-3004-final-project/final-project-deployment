// import { Request, Response } from 'express';
// import { AuthController } from '../controllers/auth.controllers';
// import { AuthService } from '../services/auth.service';
// import { signUpValidator, signInValidator, refreshTokenValidator } from '../validator/auth.validator';

// jest.mock('../services/auth.service');
// jest.mock('../validator/auth.validator');

// const mockAuthService = new AuthService() as jest.Mocked<AuthService>;

// describe('AuthController', () => {
//   let authController: AuthController;
//   let req: Partial<Request>;
//   let res: Partial<Response>;

//   beforeEach(() => {
//     authController = new AuthController();
//     req = { body: {}, query: {}, params: {} };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       redirect: jest.fn(),
//     };
//   });

//   describe('signUp', () => {
//     it('should return 400 if validation fails', async () => {
//       (signUpValidator.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: 'Invalid input' }] } });

//       await authController.signUp(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
//     });

//     it('should return 201 and user if registration is successful', async () => {
//       (signUpValidator.validate as jest.Mock).mockReturnValue({ error: null });
//       mockAuthService.signUp.mockResolvedValue({
//         id: 1,
//         email: 'test@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         phoneNumber: '1234567890',
//         role: 'USER',
//         avatar: null,
//         isVerified: false,
//       });

//       req.body = { email: 'test@example.com', password: 'password123' };

//       await authController.signUp(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         message: 'Registration successful. Please confirm your email.',
//         user: {
//           id: '1',
//           email: 'test@example.com',
//           firstName: 'John',
//           lastName: 'Doe',
//           phoneNumber: '1234567890',
//           role: 'USER',
//           avatar: null,
//           isVerified: false,
//         },
//       });
//     });
//   });

//   describe('confirmEmail', () => {
//     it('should return 400 if no token is provided', async () => {
//       req.query = {};

//       await authController.confirmEmail(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Confirmation token is required.' });
//     });

//     it('should return 200 if email is confirmed successfully', async () => {
//       req.query = { token: 'validToken' };

//       await authController.confirmEmail(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Email confirmed successfully.' });
//     });
//   });

//   describe('signIn', () => {
//     it('should return 400 if validation fails', async () => {
//       (signInValidator.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: 'Invalid input' }] } });

//       await authController.signIn(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
//     });

//     it('should return 200 and tokens if login is successful', async () => {
//       (signInValidator.validate as jest.Mock).mockReturnValue({ error: null });
//       mockAuthService.signIn.mockResolvedValue({
//         accessToken: 'accessToken',
//         refreshToken: 'refreshToken',
//         user: {
//           id: 1,
//           email: 'test@example.com',
//           firstName: 'John',
//           lastName: 'Doe',
//           phoneNumber: '1234567890',
//           role: 'USER',
//           avatar: null,
//           isVerified: true,
//         },
//       });

//       req.body = { email: 'test@example.com', password: 'password123' };

//       await authController.signIn(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         accessToken: 'accessToken',
//         refreshToken: 'refreshToken',
//         user: {
//           id: '1',
//           email: 'test@example.com',
//           firstName: 'John',
//           lastName: 'Doe',
//           phoneNumber: '1234567890',
//           role: 'USER',
//           avatar: null,
//           isVerified: true,
//         },
//       });
//     });
//   });

//   describe('refreshToken', () => {
//     it('should return 400 if validation fails', async () => {
//       (refreshTokenValidator.validate as jest.Mock).mockReturnValue({ error: { details: [{ message: 'Invalid token' }] } });

//       await authController.refreshToken(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
//     });

//     it('should return 200 and new tokens if refresh is successful', async () => {
//       (refreshTokenValidator.validate as jest.Mock).mockReturnValue({ error: null });
//       mockAuthService.refreshTokens.mockResolvedValue({
//         accessToken: 'newAccessToken',
//         refreshToken: 'newRefreshToken',
//       });

//       req.body = { refreshToken: 'validRefreshToken' };

//       await authController.refreshToken(req as Request, res as Response);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         accessToken: 'newAccessToken',
//         refreshToken: 'newRefreshToken',
//       });
//     });
//   });

//   describe('socialCallback', () => {
//     it('should redirect to client app with tokens', async () => {
//       mockAuthService.socialLogin.mockResolvedValue({
//         accessToken: 'accessToken',
//         refreshToken: 'refreshToken',
//         user: {
//           id: 1,
//           email: 'test@example.com',
//           firstName: 'John',
//           lastName: 'Doe',
//           phoneNumber: '1234567890',
//           role: 'USER',
//           avatar: null,
//           isVerified: true,
//         },
//       });

//       req.user = { id: '1' };
//       req.params = { provider: 'google' };

//       await authController.socialCallback(req as Request, res as Response);

//       expect(res.redirect).toHaveBeenCalledWith(
//         'your-client-app-url?accessToken=accessToken&refreshToken=refreshToken'
//       );
//     });
//   });
// });