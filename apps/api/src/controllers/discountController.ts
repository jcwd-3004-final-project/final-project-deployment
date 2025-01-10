// src/controllers/discountController.ts
import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountService();
  }

  // ------------------ Diskon (CRUD) ------------------

  public async createDiscount(req: Request, res: Response): Promise<void> {
    try {
      const discount = await this.discountService.createDiscount(req.body);
      // TANPA return agar fungsi tetap Promise<void>
      res.status(201).json(discount);
    } catch (error: any) {
      console.error('Error creating discount:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async getDiscounts(req: Request, res: Response): Promise<void> {
    try {
      const discounts = await this.discountService.getDiscounts();
      res.status(200).json(discounts);
    } catch (error: any) {
      console.error('Error getting discounts:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateDiscount(req: Request, res: Response): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);
      const updated = await this.discountService.updateDiscount(discountId, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error updating discount:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteDiscount(req: Request, res: Response): Promise<void> {
    try {
      const discountId = parseInt(req.params.id, 10);
      await this.discountService.deleteDiscount(discountId);
      res.status(200).json({ message: 'Discount deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting discount:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------ Diskon <-> Produk ------------------

  public async assignDiscountToProduct(req: Request, res: Response): Promise<void> {
    try {
      const discountId = parseInt(req.params.discountId, 10);
      const { productId } = req.body;
      const updated = await this.discountService.assignDiscountToProduct(discountId, productId);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error assigning discount to product:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async removeDiscountFromProduct(req: Request, res: Response): Promise<void> {
    try {
      const discountId = parseInt(req.params.discountId, 10);
      const { productId } = req.body;
      const updated = await this.discountService.removeDiscountFromProduct(discountId, productId);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error removing discount from product:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------ Voucher (CRUD) ------------------

  public async createVoucher(req: Request, res: Response): Promise<void> {
    try {
      const voucher = await this.discountService.createVoucher(req.body);
      res.status(201).json(voucher);
    } catch (error: any) {
      console.error('Error creating voucher:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async getVouchers(req: Request, res: Response): Promise<void> {
    try {
      const vouchers = await this.discountService.getVouchers();
      res.status(200).json(vouchers);
    } catch (error: any) {
      console.error('Error getting vouchers:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async updateVoucher(req: Request, res: Response): Promise<void> {
    try {
      const voucherId = parseInt(req.params.id, 10);
      const updated = await this.discountService.updateVoucher(voucherId, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error updating voucher:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteVoucher(req: Request, res: Response): Promise<void> {
    try {
      const voucherId = parseInt(req.params.id, 10);
      await this.discountService.deleteVoucher(voucherId);
      res.status(200).json({ message: 'Voucher deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting voucher:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------ Referral ------------------

  public async createReferralCode(req: Request, res: Response): Promise<void> {
    try {
      const { referrerId } = req.body;
      const referral = await this.discountService.createReferralCode(referrerId);
      res.status(201).json(referral);
    } catch (error: any) {
      console.error('Error creating referral code:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  public async redeemReferralCode(req: Request, res: Response): Promise<void> {
    try {
      const { code, referredUserId } = req.body;
      const result = await this.discountService.redeemReferralCode(code, referredUserId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error redeeming referral code:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------ Calculate Discount ------------------

  public async calculateDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { cartItems, userId, shippingCost } = req.body;
      const result = await this.discountService.calculateDiscount(cartItems, userId, shippingCost);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error calculating discount:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
