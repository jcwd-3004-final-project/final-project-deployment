import prisma from "../models/models"; // Make sure this points to the same prisma instance as your other services

export class CartService {
  /**
   * Get or create a cart for a user.
   */
  async getCart(userId: number) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, // or select fields you need
          },
        },
      },
    });

    // If no cart found, create an empty one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add item to the user's cart.
   * If the item already exists, we increment quantity.
   */
  // cart.service.ts
  async addItemToCart(userId: number, productId: number, quantity: number) {
    // 1) Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new Error(`Product with id=${productId} does not exist`);
    }

    // 2) Get or create cart
    const cart = await this.getCart(userId);

    // 3) Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // 4) If item exists, update. Otherwise, create new item
    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  /**
   * Remove or decrement quantity of an item in the cart.
   * If 'quantity' >= existing quantity, remove the item entirely.
   */
  async removeItemFromCart(
    userId: number,
    productId: number,
    quantity: number
  ) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error("Cart not found for this user");
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    if (cartItem.quantity > quantity) {
      // Decrement quantity
      return prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity - quantity,
        },
      });
    } else {
      // Remove the item if quantity to remove is >= current quantity
      return prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
  }

  async deleteCartItem(userId: number, productId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) throw new Error("Cart not found");

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });
    if (!cartItem) throw new Error("Item not found in cart");

    return prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }
}
