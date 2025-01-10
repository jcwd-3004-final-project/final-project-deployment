// src/routes/discountRoutes.ts
import { Router } from 'express';
import { DiscountController } from '../controllers/discountController';

const router = Router();
const discountController = new DiscountController();

// ------------------ Discount CRUD ------------------
// .bind(discountController) agar 'this' di dalam method tetap instance controller
router.post('/discounts', discountController.createDiscount.bind(discountController));
router.get('/discounts', discountController.getDiscounts.bind(discountController));
router.put('/discounts/:id', discountController.updateDiscount.bind(discountController));
router.delete('/discounts/:id', discountController.deleteDiscount.bind(discountController));

// ------------------ Assign/Remove Discounts to/from Products ------------------
router.post('/discounts/:discountId/assign', discountController.assignDiscountToProduct.bind(discountController));
router.post('/discounts/:discountId/remove', discountController.removeDiscountFromProduct.bind(discountController));

// ------------------ Voucher Operations ------------------
router.post('/vouchers', discountController.createVoucher.bind(discountController));
router.get('/vouchers', discountController.getVouchers.bind(discountController));
router.put('/vouchers/:id', discountController.updateVoucher.bind(discountController));
router.delete('/vouchers/:id', discountController.deleteVoucher.bind(discountController));

// ------------------ Referral Code Operations ------------------
router.post('/referrals/create', discountController.createReferralCode.bind(discountController));
router.post('/referrals/redeem', discountController.redeemReferralCode.bind(discountController));

// ------------------ Calculate Discount ------------------
router.post('/calculate', discountController.calculateDiscount.bind(discountController));

export default router;
