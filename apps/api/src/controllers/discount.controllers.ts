// src/controllers/discountController.ts
import { Request, Response } from 'express';
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} from '../services/discount.service';

/**
 * Membuat Diskon Baru
 */
export const createDiscountHandler = async (req: Request, res: Response) => {
  const {
    type,
    value,
    valueType,
    startDate,
    endDate,
    maxDiscount,
    minPurchase,
    productIds,
  } = req.body;

  const discount = await createDiscount({
    type,
    value,
    valueType,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    maxDiscount,
    minPurchase,
    productIds,
  });

  res.status(201).json(discount);
};

/**
 * Mendapatkan Semua Diskon
 */
export const getAllDiscountsHandler = async (req: Request, res: Response) => {
  const discounts = await getAllDiscounts();
  res.status(200).json(discounts);
};

/**
 * Mendapatkan Diskon Berdasarkan ID
 */
export const getDiscountByIdHandler = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const discount = await getDiscountById(id);
  
    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return; // Menghentikan eksekusi tanpa mengembalikan Response
    }
  
    res.status(200).json(discount);
  };

/**
 * Memperbarui Diskon
 */
export const updateDiscountHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const {
    type,
    value,
    valueType,
    startDate,
    endDate,
    maxDiscount,
    minPurchase,
    productIds,
  } = req.body;

  const discount = await updateDiscount({
    id,
    type,
    value,
    valueType,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    maxDiscount,
    minPurchase,
    productIds,
  });

  res.status(200).json(discount);
};

/**
 * Menghapus Diskon
 */
export const deleteDiscountHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const discount = await deleteDiscount(id);

  res.status(200).json(discount);
};
