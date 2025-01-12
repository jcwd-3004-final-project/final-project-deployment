// import { PrismaClient, DiscountType, DiscountValueType, VoucherUsageType } from '@prisma/client';

// const prisma = new PrismaClient();

// export class ReferralService {
//   /**
//    * Membuat referral code untuk user (pemilik code).
//    * Dipanggil misalnya ketika user baru register.
//    * @param userId - ID user yang baru register (pemilik referral)
//    */
//   async createReferralCodeForNewUser(userId: number) {
//     // Generate referral code unik
//     const referralCode = this.generateReferralCode();

//     // Simpan ke table Referral dengan usageCount = 0
//     const newReferral = await prisma.referral.create({
//       data: {
//         referralCode: referralCode,
//         referrerId: userId,
//         usageCount: 0,
//       },
//     });

//     return newReferral;
//   }

//   /**
//    * Menggunakan referral code oleh user yang direferensikan.
//    * Code hanya bisa dipakai sekali saja.
//    * @param referralCode - code yang dimasukkan user
//    * @param newUserId    - ID user yang menggunakan kode referral
//    */
//   async useReferralCodeWhenRegister(referralCode: string, newUserId: number) {
//     // Cari referral di DB
//     const referral = await prisma.referral.findUnique({
//       where: { referralCode },
//     });

//     if (!referral) {
//       throw new Error('Referral code tidak valid');
//     }

//     // Cek apakah code sudah digunakan
//     if (referral.usageCount >= 1) {
//       throw new Error('Referral code sudah pernah digunakan');
//     }

//     // Increment usageCount
//     await prisma.referral.update({
//       where: { id: referral.id },
//       data: {
//         usageCount: { increment: 1 },
//       },
//     });

//     // Berikan potongan 10.000 ke pemilik code
//     const ownerId = referral.referrerId;
//     const potongan = 10000;
//     const now = new Date();
//     const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari ke depan

//     // Buat voucher potongan 10.000
//     const voucher = await prisma.voucher.create({
//       data: {
//         code: `REF-BENEFIT-${referralCode}-${this.generateReferralCode()}`,
//         discountType: DiscountType.PRODUCT_DISCOUNT, // Sesuaikan dengan kebutuhan
//         value: potongan,
//         valueType: DiscountValueType.NOMINAL,
//         startDate: now,
//         endDate: endDate,
//         usageType: VoucherUsageType.TOTAL_PURCHASE,
//         minPurchaseAmount: 0,
//         maxDiscount: potongan, // Maksimal potongan 10.000
//       },
//     });

//     // Assign voucher ke pemilik code
//     await prisma.userVoucher.create({
//       data: {
//         userId: ownerId,
//         voucherId: voucher.id,
//       },
//     });

//     return { message: 'Referral code berhasil digunakan dan potongan 10.000 diberikan ke pemilik code' };
//   }

//   // ------------------ Helper Functions ------------------

//   /**
//    * Menghasilkan kode referral unik.
//    */
//   private generateReferralCode(): string {
//     return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
//   }
// }
