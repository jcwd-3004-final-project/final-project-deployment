// // src/controllers/referralController.ts
// import { Request, Response } from 'express';
// import { ReferralService } from '../services/referral.service';

// export class ReferralController {
//   private referralService: ReferralService;

//   constructor() {
//     this.referralService = new ReferralService();

//     // Bind method agar `this` tetap mengarah ke instance class
//     this.createReferralCodeForUser = this.createReferralCodeForUser.bind(this);
//     this.useReferralCodeWhenRegister = this.useReferralCodeWhenRegister.bind(this);
//   }

//   /**
//    * Membuat referral code untuk user (pemilik code).
//    * Endpoint ini bisa dipanggil misalnya setelah user register, 
//    * atau kapan pun Anda mau generate code untuk user.
//    * 
//    * Body: { userId: number }
//    */
//   async createReferralCodeForUser(req: Request, res: Response) {
//     try {
//       const { userId } = req.body;
//       if (!userId) {
//         return res.status(400).json({ error: "userId is required" });
//       }

//       const newReferral = await this.referralService.createReferralCodeForNewUser(userId);
//       return res.status(201).json({
//         message: "Referral code created successfully",
//         referralCode: newReferral.referralCode,
//       });
//     } catch (error: any) {
//       console.error("Error creating referral code:", error.message);
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Menggunakan referral code (satu kali saja)
//    * untuk user lain yang baru register atau mau mendaftar.
//    * 
//    * Body: { referralCode: string, newUserId: number }
//    */
//   async useReferralCodeWhenRegister(req: Request, res: Response) {
//     try {
//       const { referralCode, newUserId } = req.body;

//       if (!referralCode || !newUserId) {
//         return res.status(400).json({ error: "referralCode and newUserId are required" });
//       }

//       const result = await this.referralService.useReferralCodeWhenRegister(referralCode, Number(newUserId));
//       return res.status(200).json(result);
//     } catch (error: any) {
//       console.error("Error using referral code:", error.message);
//       return res.status(500).json({ error: error.message });
//     }
//   }
// }
