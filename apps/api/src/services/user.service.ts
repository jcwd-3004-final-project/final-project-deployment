import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { AddressInput, ShippingCostInput } from "../models/user.models";

import cloudinary from 'cloudinary';

const prisma = new PrismaClient();
const RAJA_ONGKIR_BASE_URL = "https://api.rajaongkir.com/starter";

export class UserService {
  // -------------------------
  // Address Methods
  // -------------------------
  async getUserAddresses(userId: number) {
    return prisma.address.findMany({ where: { userId } });
  }

  async addUserAddress(userId: number, data: AddressInput) {
    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
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

  async updateUserAddress(
    userId: number,
    addressId: number,
    data: AddressInput
  ) {
    const address = await prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new Error("Address not found or not authorized");
    }

    if (data.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
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

  async deleteUserAddress(userId: number, addressId: number) {
    const address = await prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new Error("Address not found or not authorized");
    }

    await prisma.address.delete({ where: { address_id: addressId } });
    return { message: "Address deleted successfully" };
  }

  async setShippingAddressForOrder(
    userId: number,
    orderId: number,
    addressId: number
  ) {
    const address = await prisma.address.findUnique({
      where: { address_id: addressId },
    });
    if (!address || address.userId !== userId) {
      throw new Error("Address not found or not authorized");
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) {
      throw new Error("Order not found or not authorized");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { shippingAddressId: addressId },
    });

    return updatedOrder;
  }

  // -------------------------
  // RajaOngkir Helpers
  // -------------------------
  public async getProvinceIdByName(provinceName: string): Promise<string> {
    if (!provinceName) throw new Error("No state/province provided");

    const apiKey = process.env.RAJA_ONGKIR_API_KEY as string;
    const url = `${RAJA_ONGKIR_BASE_URL}/province`;

    const response = await axios.get(url, {
      headers: { key: apiKey },
    });

    const provinces = response.data?.rajaongkir?.results;
    if (!provinces) {
      throw new Error("Failed to fetch provinces from RajaOngkir");
    }

    // Find province where 'province' matches our provinceName
    const found = provinces.find(
      (p: any) => p.province.toLowerCase() === provinceName.toLowerCase()
    );
    // console.log(found)

    if (!found) {
      throw new Error(`Province not found for name: ${provinceName}`);
    }

    return found.province_id; // e.g. "12"
  }

  private async getCityIdByProvinceAndCityName(
    provinceId: string,
    cityName: string
  ): Promise<string> {
    if (!cityName) throw new Error("No city provided");

    const apiKey = process.env.RAJA_ONGKIR_API_KEY as string;
    const url = `${RAJA_ONGKIR_BASE_URL}/city?province=${provinceId}`;

    const response = await axios.get(url, {
      headers: { key: apiKey },
    });

    const cities = response.data?.rajaongkir?.results;
    if (!cities) {
      throw new Error("Failed to fetch cities from RajaOngkir");
    }

    // Find city where 'city_name' matches our cityName
    const foundCity = cities.find(
      (c: any) => c.city_name.toLowerCase() === cityName.toLowerCase()
    );

    if (!foundCity) {
      throw new Error(
        `City not found for name: ${cityName}, in province_id: ${provinceId}`
      );
    }
    // console.log(foundCity)
    return foundCity.city_id; // e.g. "176"
  }

  private async buildLocationCode(
    state: string,
    city: string
  ): Promise<string> {
    const provinceId = await this.getProvinceIdByName(state);
    const cityId = await this.getCityIdByProvinceAndCityName(provinceId, city);
    // e.g. "12" + "176" => "12176"
    return `${cityId}`;
  }

  async calculateShippingCost({
    origin,
    destination,
    weight,
    courier,
  }: ShippingCostInput) {
    const RAJA_ONGKIR_API_KEY = process.env.RAJA_ONGKIR_API_KEY;
    const RAJA_ONGKIR_COST_URL = `https://api.rajaongkir.com/starter/cost`;
    // console.log("origin : ", origin, "destination : ", destination, "weight :", weight, "courier : ", courier )
    const response = await axios.post(
      RAJA_ONGKIR_COST_URL,
      { origin, destination, weight, courier },
      {
        headers: {
          key: RAJA_ONGKIR_API_KEY as string,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.data)
    const costs = response.data?.rajaongkir?.results?.[0]?.costs;
    if (!costs || costs.length === 0) {
      throw new Error("No shipping cost found from RajaOngkir");
    }

    // We'll take the first available service for simplicity
    const shippingCost = costs[0].cost[0].value;
    return shippingCost;
  }

  // Public method to build location code from `state`/`city`,
  // then call calculateShippingCost
  async getAutoShippingCost(
    storeState: string,
    storeCity: string,
    addressState: string,
    addressCity: string,
    weight: number,
    courier: string
  ): Promise<number> {
    const originCode = await this.buildLocationCode(storeState, storeCity);
    const destinationCode = await this.buildLocationCode(
      addressState,
      addressCity
    );

    const cost = await this.calculateShippingCost({
      origin: originCode,
      destination: destinationCode,
      weight,
      courier,
    });
    return cost;
  }

  async findUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  async updateUserProfile(
    userId: number,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      newPassword?: string;
    }
  ) {
    // Optional: verify old password. For demo, we skip it.

    // If newPassword is provided, you should hash it using bcrypt or similar.
    // For demo, we just store it in plain text (NOT recommended in production).
    const updateData: any = {};
    if (data.firstName) updateData.first_name = data.firstName;
    if (data.lastName) updateData.last_name = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.newPassword) updateData.password = data.newPassword; // hash in real app

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  }

  async updateUserProfilePicture(userId: number, avatarUrl: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl }, // Menyimpan URL avatar gambar dari Cloudinary
    });
    return updatedUser;
  }
  
  async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true, // Include avatar field
        phone_number: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async deleteUser(userId: number) {
    // You might want to handle cascade deletes or check references
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found.");

    // This will delete user if references are set up with onDelete = Cascade
    await prisma.user.delete({ where: { id: userId } });
  }
}
