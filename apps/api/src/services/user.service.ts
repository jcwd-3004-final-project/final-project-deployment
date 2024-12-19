import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface AddressInput {
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

interface ShippingCostInput {
  origin: string;       // City or sub-district ID as required by RAJA Ongkir
  destination: string;  // City or sub-district ID as required by RAJA Ongkir
  weight: number;       // Weight in grams
  courier: string;      // e.g. "jne", "pos", "tiki"
}

export class UserService {
  // Fetch user's addresses
  async getUserAddresses(userId: number) {
    return prisma.address.findMany({
      where: { userId: userId },
    });
  }

  // Add a new address for user
  async addUserAddress(userId: number, data: AddressInput) {
    // If isDefault is true, unset the current default address for the user
    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId: userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        isDefault: data.isDefault ?? false,
      },
    });

    return newAddress;
  }

  // Update an existing address
  async updateUserAddress(userId: number, addressId: number, data: AddressInput) {
    const address = await prisma.address.findUnique({ where: { address_id: addressId } });
    if (!address || address.userId !== userId) {
      throw new Error('Address not found or not authorized');
    }

    // If isDefault is set to true, make sure to unset others
    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId: userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { address_id: addressId },
      data: {
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        isDefault: data.isDefault,
      },
    });

    return updatedAddress;
  }

  // Delete an address
  async deleteUserAddress(userId: number, addressId: number) {
    const address = await prisma.address.findUnique({ where: { address_id: addressId } });
    if (!address || address.userId !== userId) {
      throw new Error('Address not found or not authorized');
    }

    await prisma.address.delete({ where: { address_id: addressId } });
    return { message: 'Address deleted successfully' };
  }

  // Set a shipping address at checkout
  // Typically, you'd have an order or a cart checkout process; here's a simplified version:
  async setShippingAddressForOrder(userId: number, orderId: number, addressId: number) {
    const address = await prisma.address.findUnique({ where: { address_id: addressId } });
    if (!address || address.userId !== userId) {
      throw new Error('Address not found or not authorized');
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) {
      throw new Error('Order not found or not authorized');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingAddressId: addressId,
      },
    });

    return updatedOrder;
  }

  // Calculate shipping costs using RAJA Ongkir API
  async calculateShippingCost({ origin, destination, weight, courier }: ShippingCostInput) {
    // Replace with your RAJA Ongkir API key and endpoint as per their documentation
    const RAJA_ONGKIR_API_KEY = process.env.RAJA_ONGKIR_API_KEY;
    const RAJA_ONGKIR_COST_URL = 'https://api.rajaongkir.com/starter/cost';

    const response = await axios.post(RAJA_ONGKIR_COST_URL, {
      origin,
      destination,
      weight,
      courier
    }, {
      headers: {
        key: RAJA_ONGKIR_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // The response format depends on RAJA Ongkir's API response
    return response.data;
  }
}
