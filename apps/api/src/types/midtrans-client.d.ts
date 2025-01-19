declare module 'midtrans-client' {
    export interface Config {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    }
  
    export interface CreateTransactionParameter {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
      }>;
      customer_details?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      };
      credit_card?: {
        secure: boolean;
      };
      [key: string]: any;
    }
  
    export interface CreateTransactionResponse {
      token: string;
      redirect_url: string;
    }
  
    export interface TransactionStatusResponse {
      order_id: string;
      transaction_status: string;
      fraud_status?: string;
      [key: string]: any;
    }
  
    export class Snap {
      constructor(config: Config);
      createTransaction(
        parameter: CreateTransactionParameter
      ): Promise<CreateTransactionResponse>;
    }
  
    export class CoreApi {
      constructor(config: Config);
      transaction: {
        notification(body: any): Promise<TransactionStatusResponse>;
      };
    }
  }