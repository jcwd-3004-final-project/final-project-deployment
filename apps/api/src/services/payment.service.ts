import axios from 'axios';
import { PrismaClient, PaymentMethod, OrderStatus } from '@prisma/client';
import midtransClient from 'midtrans-client';

const prisma = new PrismaClient();

class PaymentService {
  // We'll keep snap client solely for reference or remove it if not needed for other reasons
  // private snap: midtransClient.Snap;

  constructor() {
    // If you no longer need Snap for anything else,
    // you can remove this constructor entirely
    // or leave it blank if you want to keep handleNotification as is.
  }

  /**
   * Create a Midtrans payment transaction (via Axios) for an existing order
   * that has paymentMethod = PAYMENT_GATEWAY.
   */
  public async createPayment(orderId: number, userId: number) {
    // 1) Fetch the order from the database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Optional: Verify the order belongs to the requesting user
    // if (order.userId !== userId) {
    //   throw new Error('You do not have permission to pay for this order');
    // }

    // 2) Ensure the order is meant to be paid via Payment Gateway
    if (order.paymentMethod !== PaymentMethod.PAYMENT_GATEWAY) {
      throw new Error('This order is not set to be paid via Payment Gateway');
    }

    // 3) Prepare the total price (sum of items + shipping)
    const grossAmount = order.totalAmount + order.shippingCost;

    // 4) Prepare the item_details array:
    //    Combine product items + shipping cost as a separate line item
    const productItems = order.items.map((item) => ({
      id: item.productId.toString(),
      price: Math.round(item.price), // ensure an integer
      quantity: item.quantity,
      name: item.product.name,
    }));

    // Add shipping cost as a separate item
    // so it appears in the Snap/transaction breakdown
    const shippingItem = {
      id: 'SHIPPING',
      price: Math.round(order.shippingCost),
      quantity: 1,
      name: 'Shipping Cost',
    };

    const allItems = [...productItems, shippingItem];

    // 5) Build the Midtrans parameter payload
    const body = {
      transaction_details: {
        order_id: `ORDER-${order.id}-${Date.now()}`,
        // must be a number, not string
        gross_amount: Math.round(grossAmount),
      },
      credit_card :{
        secure : true
    },
      customer_details: {
        first_name: order.user.first_name,
        last_name: order.user.last_name,
        email: order.user.email,
        phone: order.user.phone_number ?? '',
      },
      item_details: allItems,
    };

    // 6) Build the Authorization header (Base64("<serverKey>:"))
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';


    // 7) Hit Midtrans Snap endpoint with Axios
    const url = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    const response = await axios.post(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${serverKey}`,
      },
    });

    // 8) Parse the response
    const transaction = response.data; // e.g. { token, redirect_url, etc. }

    // 9) Return the important parts
    return {
      snapToken: transaction.token,        // Snap token
      redirectUrl: transaction.redirect_url, // Payment UI URL
      midtransData: transaction,             // Full midtrans response
    };
  }

  /**
   * Handle Midtrans Notification (unchanged).
   * Uses midtrans-client for verifying transaction status.
   */
  public async handleNotification(notificationBody: any) {
    const coreApi = new midtransClient.CoreApi({
      isProduction: false, // or true in production
      serverKey: process.env.MIDTRANS_SERVER as string,
      clientKey: process.env.MIDTRANS_CLIENT as string,
    });
  
    // Parse notification
    const statusResponse = await coreApi.transaction.notification(notificationBody);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
  
    // Extract the actual orderId
    const splitted = orderId.split('-');
    const actualOrderId = parseInt(splitted[1], 10);
  
    // Determine new status
    let newStatus: OrderStatus | null = null;
    if (transactionStatus === 'settlement') {
      newStatus = OrderStatus.PROCESSING;
    } else if (['cancel', 'expire', 'deny'].includes(transactionStatus)) {
      newStatus = OrderStatus.CANCELLED;
    } else if (transactionStatus === 'pending') {
      newStatus = OrderStatus.WAITING_FOR_PAYMENT;
    } else if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        newStatus = OrderStatus.PROCESSING;
      } else if (fraudStatus === 'challenge') {
        newStatus = OrderStatus.WAITING_FOR_PAYMENT_CONFIRMATION;
      }
    }
  
    // Update the order status in the database
    if (newStatus) {
      await prisma.order.update({
        where: { id: actualOrderId },
        data: { status: newStatus },
      });
    }
  
    // Retrieve updated order details
    const order = await prisma.order.findUnique({
      where: { id: actualOrderId },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });
  
    if (!order) {
      throw new Error('Order not found');
    }
  
    // Generate an invoice
    const invoice = {
      invoiceNumber: `INV-${order.id}-${Date.now()}`,
      date: new Date().toISOString(),
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
      status: newStatus,
    };
  
    // Return the generated invoice
    return invoice;
  }
}

export default new PaymentService();