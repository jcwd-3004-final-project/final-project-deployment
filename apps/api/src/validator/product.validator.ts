import { z as validate } from "zod";

export const productSchema = validate.object({
  name: validate.string().min(1, "Name is required"),
  description: validate.string().min(1, "Description is required"),
  price: validate.number().positive("Price must be positive"),
  categoryId: validate
    .number()
    .int("Category ID must be an integer")
    .min(1, "Category is required"),
  images: validate
    .array(validate.string().url("Each image must be a valid URL"))
    .min(1, "At least one image URL is required"),
  stockQuantity: validate
    .number()
    .int("Stock quantity must be an integer")
    .nonnegative("Stock quantity cannot be negative"),
});
