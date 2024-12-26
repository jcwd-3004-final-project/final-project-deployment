// src/services/discountService.ts
import prisma from '../models/models';
import { Discount, DiscountType, DiscountValueType } from '@prisma/client';

interface CreateDiscountInput {
  type: DiscountType;
  value: number;
  valueType: DiscountValueType;
  startDate: Date;
  endDate: Date;
  maxDiscount?: number;
  minPurchase?: number;
  productIds: number[]; // ID produk yang terkait
}

interface UpdateDiscountInput {
  id: number;
  type?: DiscountType;
  value?: number;
  valueType?: DiscountValueType;
  startDate?: Date;
  endDate?: Date;
  maxDiscount?: number;
  minPurchase?: number;
  productIds?: number[];
}

export const createDiscount = async (data: CreateDiscountInput): Promise<Discount> => {
  return await prisma.discount.create({
    data: {
      type: data.type,
      value: data.value,
      valueType: data.valueType,
      startDate: data.startDate,
      endDate: data.endDate,
      maxDiscount: data.maxDiscount,
      minPurchase: data.minPurchase,
      products: {
        connect: data.productIds.map((id) => ({ id })),
      },
    },
    include: {
      products: true,
    },
  });
};

export const getAllDiscounts = async (): Promise<Discount[]> => {
  return await prisma.discount.findMany({
    include: {
      products: true,
    },
  });
};

export const getDiscountById = async (id: number): Promise<Discount | null> => {
  return await prisma.discount.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
};

export const updateDiscount = async (data: UpdateDiscountInput): Promise<Discount> => {
  const { id, productIds, ...updateData } = data;

  return await prisma.discount.update({
    where: { id },
    data: {
      ...updateData,
      products: productIds
        ? {
            set: productIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      products: true,
    },
  });
};

export const deleteDiscount = async (id: number): Promise<Discount> => {
  return await prisma.discount.delete({
    where: { id },
    include: {
      products: true,
    },
  });
};
