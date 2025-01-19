// user.models.ts
export interface AuthenticatedUser {
    id: number;
    email: string;
    // add any other fields you expect after authentication
  }
  
  // src/models/user.interface.ts

/**
 * Interfaces for user-related data structures
 */
export interface AddressInput {
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

export interface ShippingCostInput {
  origin: string;       // City or sub-district ID as required by RAJA Ongkir
  destination: string | null;  // City or sub-district ID as required by RAJA Ongkir
  weight: number;       // Weight in grams
  courier: string;      // e.g. "jne", "pos", "tiki"
}