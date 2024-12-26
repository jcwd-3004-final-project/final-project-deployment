// src/routes/discountRoutes.ts
import express from 'express';
import {
  createDiscountHandler,
  getAllDiscountsHandler,
  getDiscountByIdHandler,
  updateDiscountHandler,
  deleteDiscountHandler,
} from '../controllers/discount.controllers';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();



// Definisikan rute-rute diskon dengan menggunakan asyncHandler
router.post('/discount', asyncHandler(createDiscountHandler));
router.get('/discount', asyncHandler(getAllDiscountsHandler));
router.get('/discount/:id', asyncHandler(getDiscountByIdHandler));
router.put('/discount/:id', asyncHandler(updateDiscountHandler));
router.delete('discount/:id', asyncHandler(deleteDiscountHandler));

export default router;
