// src/routes/discountRoutes.ts
import { Router } from 'express';
import { DiscountController } from '../controllers/discountController';
import { StoreAdminMiddleware } from '../middlewares/storeAdmin.middleware';

const router = Router();
const discountController = new DiscountController();
const storeAdminMiddleware = new StoreAdminMiddleware();

// ------------------ Discount CRUD ------------------
router.post(
  '/discounts',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.createDiscount.bind(discountController)
);

router.get(
  '/discounts',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.getDiscounts.bind(discountController)
);

router.put(
  '/discounts/:id',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.updateDiscount.bind(discountController)
);

router.delete(
  '/discounts/:id',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.deleteDiscount.bind(discountController)
);

// ------------------ Assign/Remove Discounts to/from Products ------------------
router.post(
  '/discounts/:discountId/assign',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.assignDiscountToProduct.bind(discountController)
);

router.post(
  '/discounts/:discountId/remove',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.removeDiscountFromProduct.bind(discountController)
);

// ------------------ Voucher Operations ------------------
router.post(
  '/vouchers',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.createVoucher.bind(discountController)
);

router.get(
  '/vouchers',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.getVouchers.bind(discountController)
);

router.put(
  '/vouchers/:id',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.updateVoucher.bind(discountController)
);

router.delete(
  '/vouchers/:id',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.deleteVoucher.bind(discountController)
);

// ------------------ Calculate Discount ------------------
router.post(
  '/calculate',
  storeAdminMiddleware.authenticateJwt.bind(storeAdminMiddleware),
  storeAdminMiddleware.authorizeRole(["STORE_ADMIN"]).bind(storeAdminMiddleware),
  discountController.calculateDiscount.bind(discountController)
);

export default router;
