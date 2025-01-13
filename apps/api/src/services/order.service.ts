// src/services/order.service.ts
import prisma from "../models/models";
import { InventoryService } from "./inventory.service";
import { UserService } from "./user.service";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
} from "@prisma/client";
import cloudinary from "../config/cloudinary";

interface OrderItemInput {
  productId: number;
  quantity: number;
}

/**
 * Returns the distance in km between two lat/long points
 * using the Haversine formula.
 */
function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;

  function toRad(angle: number) {
    return (angle * Math.PI) / 180;
  }
}

export class OrderService {
  private inventoryService: InventoryService;
  private userService: UserService;

  constructor() {
    this.inventoryService = new InventoryService();
    this.userService = new UserService();
  }

  /**
   * Create a new order
   * - Checks if the distance between store and user address > 50km => throw error
   * - Validates stock, calculates total & shipping, deducts inventory
   */
  async createOrder(
    userId: number,
    storeId: number,
    shippingAddressId: number,
    shippingMethod: ShippingMethod,
    paymentMethod: PaymentMethod,
    items: OrderItemInput[]
  ): Promise<Order> {
    // 1) Validate store
    const store = await prisma.store.findUnique({ where: { store_id: storeId } });
    if (!store) throw new Error("Store not found");

    // 2) Validate shipping address
    const address = await prisma.address.findUnique({
      where: { address_id: shippingAddressId },
    });
    if (!address || address.userId !== userId) {
      throw new Error("Invalid shipping address");
    }

    // 3) Check coordinates & distance <= 50km
    if (
      store.latitude == null ||
      store.longitude == null ||
      address.latitude == null ||
      address.longitude == null
    ) {
      throw new Error("Store or address coordinates missing");
    }

    const distanceKm = getDistanceInKm(
      store.latitude,
      store.longitude,
      address.latitude,
      address.longitude
    );

    if (distanceKm > 50) {
      throw new Error(
        `Sorry, delivery is not available beyond 50km. Distance is ${distanceKm.toFixed(
          2
        )}km`
      );
    }

    // 4) Validate stock & sum total
    let totalAmount = 0;
    let totalWeight = 0; // If you track product weight, sum it. Otherwise approximate.
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new Error(`Product ID ${item.productId} not found`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Add line price
      const linePrice = product.price;
      totalAmount += linePrice * item.quantity;

      // Example approximate weight: 500g per item
      totalWeight += 500 * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: linePrice,
      });
    }

    // 5) Auto-calc shipping cost
    // (Assuming you have a method in userService to do so.)
    const courierMap: Record<ShippingMethod, string> = {
      REGULAR: "jne",
      EXPRESS: "tiki",
      OVERNIGHT: "pos",
    };
    const courier = courierMap[shippingMethod];

    // Important: pass store.state / store.city & address.state / address.city
    const shippingCost = await this.userService.getAutoShippingCost(
      store.state!,
      store.city!,
      address.state!,
      address.city!,
      totalWeight,
      courier
    );

    // 6) Create the order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        shippingAddressId,
        shippingMethod,
        paymentMethod,
        totalAmount,
        shippingCost,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    // 7) Deduct stock
    for (const item of items) {
      await this.inventoryService.updateStock(
        storeId,
        item.productId,
        -item.quantity,
        `Order #${newOrder.id} created - deduct stock`
      );
    }

    return newOrder;
  }

  /**
   * Upload payment proof for an existing order
   */
  async uploadPaymentProof(
    userId: number,
    orderId: number,
    localFilePath: string
  ): Promise<Order> {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found or unauthorized");
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "payment_proofs",
    });

    // Update order with payment proof
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProof: uploadResult.secure_url,
        status: OrderStatus.WAITING_FOR_PAYMENT_CONFIRMATION,
      },
    });

    return updatedOrder;
  }

  /**
   * Retrieve one order by ID along with an invoice, if authorized
   */
  async getOrderWithInvoice(orderId: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new Error("Order not found or unauthorized");
    }

    const invoice = {
      invoiceNumber: `INV-${order.id}-${Date.now()}`,
      date: new Date(order.createdAt).toISOString(),
      customer: {
        name: `${order.user.first_name} ${order.user.last_name}`,
        email: order.user.email,
        phone: order.user.phone_number,
      },
      items: order.items.map((item) => ({
        product: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      shippingCost: order.shippingCost,
      grossAmount: order.totalAmount + order.shippingCost,
      status: order.status,
    };

    return invoice;
  }
}