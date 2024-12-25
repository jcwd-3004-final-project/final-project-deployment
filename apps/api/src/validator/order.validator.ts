import { z } from "zod";
import { ShippingMethod, PaymentMethod } from "@prisma/client";

/**
 * Schema for items in the order
 * Using z.coerce.number() to allow string inputs that will be coerced to numbers
 */
const orderItemSchema = z.object({
  productId: z.coerce.number().min(1, "productId is required"),
  quantity: z.coerce.number().min(1, "quantity must be at least 1"),
});

/**
 * Schema for creating an order
 */
export const orderCreateSchema = z.object({
  storeId: z.coerce.number().min(1, "Invalid storeId"),
  shippingAddressId: z.coerce.number().min(1, "Invalid shippingAddressId"),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  items: z.array(orderItemSchema).min(1, "At least one order item required"),
});

/**
 * Schema for uploading payment proof
 * We coerce orderId to a number in case the client sends a string
 */
export const uploadPaymentProofSchema = z.object({
  orderId: z.coerce.number().min(1, "Invalid orderId"),
});